package com.neco.neco.bank;

import com.neco.neco.bank.dto.BankDetailsRequest;
import com.neco.neco.bank.dto.BankDetailsResponse;
import com.neco.neco.common.exception.BadRequestException;
import com.neco.neco.common.exception.ResourceNotFoundException;
import com.neco.neco.staff.Staff;
import com.neco.neco.staff.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BankDetailsService {

    private final BankDetailsRepository bankDetailsRepository;
    private final StaffRepository staffRepository;

    public BankDetailsResponse getOwnBankDetails() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Staff staff = staffRepository.findByStaffId(username)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "username", username));

        Optional<BankDetails> existing = bankDetailsRepository.findByStaff(staff);
        if (existing.isPresent()) {
            return mapToResponse(existing.get());
        }
        return new BankDetailsResponse();
    }

    public BankDetailsResponse saveDraft(BankDetailsRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Staff staff = staffRepository.findByStaffId(username)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "username", username));

        BankDetails bankDetails = bankDetailsRepository.findByStaff(staff)
                .orElse(BankDetails.builder().staff(staff).build());

        bankDetails.setBankName(request.getBankName() != null ? request.getBankName().toUpperCase() : null);
        bankDetails.setAccountName(request.getAccountName() != null ? request.getAccountName().toUpperCase() : null);
        bankDetails.setAccountNumber(request.getAccountNumber());
        bankDetails.setSubmissionStatus(BankDetails.SubmissionStatus.DRAFT);
        bankDetails.setRejectionReason(null);

        bankDetails = bankDetailsRepository.save(bankDetails);
        return mapToResponse(bankDetails);
    }

    public BankDetailsResponse submit(BankDetailsRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Staff staff = staffRepository.findByStaffId(username)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "username", username));

        BankDetails bankDetails = bankDetailsRepository.findByStaff(staff)
                .orElse(BankDetails.builder().staff(staff).build());

        bankDetails.setBankName(request.getBankName() != null ? request.getBankName().toUpperCase() : null);
        bankDetails.setAccountName(request.getAccountName() != null ? request.getAccountName().toUpperCase() : null);
        bankDetails.setAccountNumber(request.getAccountNumber());
        bankDetails.setSubmissionStatus(BankDetails.SubmissionStatus.SUBMITTED);
        bankDetails.setSubmittedAt(Timestamp.from(Instant.now()));
        bankDetails.setRejectionReason(null);
        bankDetails.setApprovedAt(null);

        bankDetails = bankDetailsRepository.save(bankDetails);
        return mapToResponse(bankDetails);
    }

    private BankDetailsResponse mapToResponse(BankDetails bd) {
        BankDetailsResponse response = new BankDetailsResponse();
        response.setId(bd.getId());
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
