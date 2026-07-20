package com.neco.neco.staff;

import com.neco.neco.bank.BankDetails;
import com.neco.neco.bank.BankDetailsRepository;
import com.neco.neco.common.exception.ResourceNotFoundException;
import com.neco.neco.staff.dto.StaffProfileResponse;
import com.neco.neco.staff.dto.StaffUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final StaffRepository staffRepository;
    private final BankDetailsRepository bankDetailsRepository;

    public StaffProfileResponse getOwnProfile() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Staff staff = staffRepository.findByStaffId(username)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "username", username));
        return mapToProfileResponse(staff);
    }

    public StaffProfileResponse getProfileByStaffId(String staffId) {
        Staff staff = staffRepository.findByStaffId(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "staffId", staffId));
        return mapToProfileResponse(staff);
    }

    public StaffProfileResponse updateProfile(StaffUpdateRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Staff staff = staffRepository.findByStaffId(username)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "username", username));

        if (request.getPhoneNumber() != null) {
            staff.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getEmail() != null) {
            staff.setEmail(request.getEmail());
        }

        staff = staffRepository.save(staff);
        return mapToProfileResponse(staff);
    }

    private StaffProfileResponse mapToProfileResponse(Staff staff) {
        StaffProfileResponse response = new StaffProfileResponse();
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
        response.setPassportPhoto(staff.getPassportPhoto());
        response.setAccountStatus(staff.getAccountStatus().name());

        var bankDetails = bankDetailsRepository.findByStaff(staff);
        if (bankDetails.isPresent()) {
            response.setHasBankDetails(true);
            response.setBankSubmissionStatus(bankDetails.get().getSubmissionStatus().name());
        } else {
            response.setHasBankDetails(false);
            response.setBankSubmissionStatus("NONE");
        }

        return response;
    }
}
