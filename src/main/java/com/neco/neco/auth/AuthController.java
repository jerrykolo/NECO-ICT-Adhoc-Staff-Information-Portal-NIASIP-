package com.neco.neco.auth;

import com.neco.neco.auth.dto.ChangePasswordRequest;
import com.neco.neco.auth.dto.LoginRequest;
import com.neco.neco.auth.dto.LoginResponse;
import com.neco.neco.common.ApiResponse;
import com.neco.neco.config.jwt.JwtTokenProvider;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        LoginResponse response = authService.loginAndGetToken(request, tokenProvider);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        authService.changePassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully"));
    }

    @PostMapping("/reset-password/{staffId}")
    public ResponseEntity<ApiResponse<Void>> resetPassword(
            @PathVariable String staffId,
            @RequestBody java.util.Map<String, String> body) {
        String newPassword = body.getOrDefault("newPassword", "123456");
        authService.resetPassword(staffId, newPassword);
        return ResponseEntity.ok(ApiResponse.success("Password reset successfully"));
    }
}
