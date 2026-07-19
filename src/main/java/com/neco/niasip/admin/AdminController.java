package com.neco.niasip.admin;

import com.neco.niasip.admin.dto.*;
import com.neco.niasip.common.ApiResponse;
import com.neco.niasip.common.PagedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboardStats() {
        DashboardStats stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }

    @GetMapping("/staff")
    public ResponseEntity<ApiResponse<PagedResponse<AdminStaffResponse>>> getAllStaff(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<AdminStaffResponse> response = adminService.getAllStaff(search, page, size);
        return ResponseEntity.ok(ApiResponse.success("Staff retrieved", response));
    }

    @PostMapping("/staff/{staffId}/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@PathVariable String staffId) {
        adminService.resetPassword(staffId);
        return ResponseEntity.ok(ApiResponse.success("Password reset to default: 123456"));
    }

    @PostMapping("/staff/{staffId}/toggle-status")
    public ResponseEntity<ApiResponse<Void>> toggleStaffStatus(@PathVariable String staffId) {
        adminService.toggleStaffStatus(staffId);
        return ResponseEntity.ok(ApiResponse.success("Staff status toggled"));
    }

    @GetMapping("/submissions")
    public ResponseEntity<ApiResponse<PagedResponse<SubmissionResponse>>> getAllSubmissions(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<SubmissionResponse> response = adminService.getAllSubmissions(status, page, size);
        return ResponseEntity.ok(ApiResponse.success("Submissions retrieved", response));
    }

    @PostMapping("/submissions/{id}/approve")
    public ResponseEntity<ApiResponse<Void>> approveSubmission(@PathVariable Long id) {
        adminService.approveSubmission(id);
        return ResponseEntity.ok(ApiResponse.success("Submission approved"));
    }

    @PostMapping("/submissions/{id}/reject")
    public ResponseEntity<ApiResponse<Void>> rejectSubmission(
            @PathVariable Long id,
            @RequestBody SubmissionActionRequest request) {
        adminService.rejectSubmission(id, request.getReason());
        return ResponseEntity.ok(ApiResponse.success("Submission rejected"));
    }

    @PostMapping("/submissions/{id}/reopen")
    public ResponseEntity<ApiResponse<Void>> reopenSubmission(@PathVariable Long id) {
        adminService.reopenSubmission(id);
        return ResponseEntity.ok(ApiResponse.success("Submission reopened"));
    }
}
