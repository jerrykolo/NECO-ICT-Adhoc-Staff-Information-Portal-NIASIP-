package com.neco.neco.admin;

import com.neco.neco.admin.dto.AdminStaffResponse;
import com.neco.neco.admin.dto.DashboardStats;
import com.neco.neco.admin.dto.SubmissionResponse;
import com.neco.neco.bank.BankDetails;
import com.neco.neco.bank.BankDetailsRepository;
import com.neco.neco.common.PagedResponse;
import com.neco.neco.common.exception.BadRequestException;
import com.neco.neco.common.exception.ResourceNotFoundException;
import com.neco.neco.auth.UserAccount;
import com.neco.neco.auth.UserAccountRepository;
import com.neco.neco.announcement.AnnouncementRepository;
import com.neco.neco.staff.Staff;
import com.neco.neco.staff.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final StaffRepository staffRepository;
    private final BankDetailsRepository bankDetailsRepository;
    private final AnnouncementRepository announcementRepository;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public DashboardStats getDashboardStats() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalStaff(staffRepository.count());
        stats.setActiveStaff(staffRepository.countByAccountStatus(Staff.AccountStatus.ACTIVE));
        stats.setInactiveStaff(staffRepository.countByAccountStatus(Staff.AccountStatus.INACTIVE));
        stats.setSubmittedCount(bankDetailsRepository.countBySubmissionStatus(BankDetails.SubmissionStatus.SUBMITTED));
        stats.setApprovedCount(bankDetailsRepository.countBySubmissionStatus(BankDetails.SubmissionStatus.APPROVED));
        stats.setRejectedCount(bankDetailsRepository.countBySubmissionStatus(BankDetails.SubmissionStatus.REJECTED));
        stats.setDraftCount(bankDetailsRepository.countBySubmissionStatus(BankDetails.SubmissionStatus.DRAFT));
        stats.setTotalSubmissions(stats.getSubmittedCount() + stats.getApprovedCount() + stats.getRejectedCount() + stats.getDraftCount());
        stats.setTotalAnnouncements(announcementRepository.count());
        return stats;
    }

    public PagedResponse<AdminStaffResponse> getAllStaff(String search, int page, int size) {
        Page<Staff> staffPage = staffRepository.search(search,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));

        List<AdminStaffResponse> content = new ArrayList<>();
        for (Staff staff : staffPage.getContent()) {
            content.add(mapToAdminStaffResponse(staff));
        }

        return new PagedResponse<>(
                content,
                staffPage.getNumber(),
                staffPage.getSize(),
                staffPage.getTotalElements(),
                staffPage.getTotalPages(),
                staffPage.isLast()
        );
    }

    public void resetPassword(String staffId) {
        Staff staff = staffRepository.findByStaffId(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "staffId", staffId));

        UserAccount account = userAccountRepository.findByStaff(staff)
                .orElseThrow(() -> new ResourceNotFoundException("User account", "staffId", staffId));

        account.setPasswordHash(passwordEncoder.encode("123456"));
        account.setFirstLogin(true);
        userAccountRepository.save(account);
    }

    @Transactional(readOnly = true)
    public PagedResponse<SubmissionResponse> getAllSubmissions(String status, int page, int size) {
        List<BankDetails> submissions;
        if (status != null && !status.isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            BankDetails.SubmissionStatus submissionStatus = BankDetails.SubmissionStatus.valueOf(status.toUpperCase());
            submissions = bankDetailsRepository.findBySubmissionStatusWithStaff(submissionStatus);
        } else {
            submissions = bankDetailsRepository.findAllWithStaff();
        }

        int start = page * size;
        int end = Math.min(start + size, submissions.size());
        List<BankDetails> pageContent = start < submissions.size() ? submissions.subList(start, end) : List.of();

        List<SubmissionResponse> responseList = pageContent.stream()
                .map(this::mapToSubmissionResponse)
                .toList();

        int totalPages = (int) Math.ceil((double) submissions.size() / size);

        return new PagedResponse<>(
                responseList, page, size,
                submissions.size(), totalPages,
                page >= totalPages - 1
        );
    }

    public void approveSubmission(Long bankDetailsId) {
        BankDetails bankDetails = bankDetailsRepository.findById(bankDetailsId)
                .orElseThrow(() -> new ResourceNotFoundException("Bank details", "id", bankDetailsId));

        bankDetails.setSubmissionStatus(BankDetails.SubmissionStatus.APPROVED);
        bankDetails.setApprovedAt(Timestamp.from(Instant.now()));
        bankDetailsRepository.save(bankDetails);
    }

    public void rejectSubmission(Long bankDetailsId, String reason) {
        BankDetails bankDetails = bankDetailsRepository.findById(bankDetailsId)
                .orElseThrow(() -> new ResourceNotFoundException("Bank details", "id", bankDetailsId));

        if (reason == null || reason.isBlank()) {
            throw new BadRequestException("Rejection reason is required");
        }

        bankDetails.setSubmissionStatus(BankDetails.SubmissionStatus.REJECTED);
        bankDetails.setRejectionReason(reason != null ? reason.toUpperCase() : null);
        bankDetailsRepository.save(bankDetails);
    }

    public void reopenSubmission(Long bankDetailsId) {
        BankDetails bankDetails = bankDetailsRepository.findById(bankDetailsId)
                .orElseThrow(() -> new ResourceNotFoundException("Bank details", "id", bankDetailsId));

        bankDetails.setSubmissionStatus(BankDetails.SubmissionStatus.DRAFT);
        bankDetails.setRejectionReason(null);
        bankDetails.setApprovedAt(null);
        bankDetailsRepository.save(bankDetails);
    }

    public void toggleStaffStatus(String staffId) {
        Staff staff = staffRepository.findByStaffId(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "staffId", staffId));

        staff.setAccountStatus(
                staff.getAccountStatus() == Staff.AccountStatus.ACTIVE
                        ? Staff.AccountStatus.INACTIVE
                        : Staff.AccountStatus.ACTIVE);
        staffRepository.save(staff);
    }

    private AdminStaffResponse mapToAdminStaffResponse(Staff staff) {
        AdminStaffResponse response = new AdminStaffResponse();
        response.setId(staff.getId());
        response.setStaffId(staff.getStaffId());
        response.setFullName(staff.getFullName());
        response.setDesignation(staff.getDesignation());
        response.setDepartment(staff.getDepartment());
        response.setDivision(staff.getDivision());
        response.setRole(staff.getRole());
        response.setCategory(staff.getCategory());
        response.setPhoneNumber(staff.getPhoneNumber());
        response.setEmail(staff.getEmail());
        response.setAccountStatus(staff.getAccountStatus().name());

        var bankDetails = bankDetailsRepository.findByStaff(staff);
        response.setHasBankDetails(bankDetails.isPresent());
        if (bankDetails.isPresent()) {
            response.setBankSubmissionStatus(bankDetails.get().getSubmissionStatus().name());
        }

        return response;
    }

    private SubmissionResponse mapToSubmissionResponse(BankDetails bd) {
        SubmissionResponse response = new SubmissionResponse();
        response.setId(bd.getId());

        Staff staff = bd.getStaff();
        if (staff != null) {
            response.setStaffId(staff.getStaffId());
            response.setFullName(staff.getFullName());
            response.setDepartment(staff.getDepartment());
            response.setDivision(staff.getDivision());
            response.setPassportPhoto(staff.getPassportPhoto());
        }

        response.setBankName(bd.getBankName());
        response.setAccountName(bd.getAccountName());
        response.setAccountNumber(bd.getAccountNumber());
        response.setSubmissionStatus(bd.getSubmissionStatus().name());
        response.setRejectionReason(bd.getRejectionReason());
        if (bd.getSubmittedAt() != null) response.setSubmittedAt(bd.getSubmittedAt().toString());
        if (bd.getApprovedAt() != null) response.setApprovedAt(bd.getApprovedAt().toString());

        return response;
    }
}
