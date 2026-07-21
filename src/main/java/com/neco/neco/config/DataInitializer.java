package com.neco.neco.config;

import com.neco.neco.auth.UserAccount;
import com.neco.neco.auth.UserAccountRepository;
import com.neco.neco.auth.role.Role;
import com.neco.neco.staff.Staff;
import com.neco.neco.staff.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final StaffRepository staffRepository;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        initializeAdmin();
    }

    private void initializeAdmin() {
        if (!userAccountRepository.existsByUsername("admin")) {
            Staff adminStaff = Staff.builder()
                    .staffId("ADMIN001")
                    .fullName("System Administrator")
                    .designation("Administrator")
                    .department("ICT")
                    .division("Administration")
                    .role("Administrator")
                    .accountStatus(Staff.AccountStatus.ACTIVE)
                    .build();
            adminStaff = staffRepository.save(adminStaff);

            UserAccount adminAccount = UserAccount.builder()
                    .staff(adminStaff)
                    .username("admin")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .active(true)
                    .firstLogin(true)
                    .role(Role.ADMIN)
                    .build();
            userAccountRepository.save(adminAccount);

            log.info("Admin user created: admin / admin123");
        }
    }

}
