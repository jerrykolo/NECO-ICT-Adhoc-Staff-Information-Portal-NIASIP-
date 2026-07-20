package com.neco.neco.staff;

import com.neco.neco.common.ApiResponse;
import com.neco.neco.staff.dto.StaffProfileResponse;
import com.neco.neco.staff.dto.StaffUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/staff")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StaffProfileResponse>> getOwnProfile() {
        StaffProfileResponse profile = staffService.getOwnProfile();
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", profile));
    }

    @GetMapping("/profile/{staffId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<StaffProfileResponse>> getProfileByStaffId(
            @PathVariable String staffId) {
        StaffProfileResponse profile = staffService.getProfileByStaffId(staffId);
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StaffProfileResponse>> updateProfile(
            @Valid @RequestBody StaffUpdateRequest request) {
        StaffProfileResponse profile = staffService.updateProfile(request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated", profile));
    }
}
