package com.neco.neco.auth;

import com.neco.neco.auth.dto.ChangePasswordRequest;
import com.neco.neco.auth.dto.LoginRequest;
import com.neco.neco.auth.dto.LoginResponse;
import com.neco.neco.common.exception.BadRequestException;
import com.neco.neco.common.exception.ResourceNotFoundException;
import com.neco.neco.staff.Staff;
import com.neco.neco.staff.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserAccountRepository userAccountRepository;
    private final StaffRepository staffRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public LoginResponse loginAndGetToken(LoginRequest request,
                                           com.neco.neco.config.jwt.JwtTokenProvider tokenProvider) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), request.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserAccount account = userAccountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User account", "username", request.getUsername()));

        Staff staff = account.getStaff();
        String token = tokenProvider.generateToken(authentication);

        account.setLastLogin(Timestamp.from(Instant.now()));
        userAccountRepository.save(account);

        return LoginResponse.builder()
                .token(token)
                .type("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .staffId(staff.getStaffId())
                .fullName(staff.getFullName())
                .role(account.getRole().name())
                .firstLogin(account.isFirstLogin())
                .passportPhoto(staff.getPassportPhoto())
                .build();
    }

    public void changePassword(ChangePasswordRequest request) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        UserAccount account = userAccountRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User account", "username", username));

        if (!passwordEncoder.matches(request.getCurrentPassword(), account.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        account.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        account.setFirstLogin(false);
        userAccountRepository.save(account);
    }

    public void resetPassword(String staffId, String newPassword) {
        Staff staff = staffRepository.findByStaffId(staffId)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", "staffId", staffId));

        UserAccount account = userAccountRepository.findByStaff(staff)
                .orElseThrow(() -> new ResourceNotFoundException("User account", "staffId", staffId));

        account.setPasswordHash(passwordEncoder.encode(newPassword));
        account.setFirstLogin(true);
        userAccountRepository.save(account);
    }
}
