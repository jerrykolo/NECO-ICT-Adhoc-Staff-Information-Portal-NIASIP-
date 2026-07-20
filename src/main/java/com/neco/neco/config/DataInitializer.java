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
        initializeSampleStaff();
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

    private void initializeSampleStaff() {
        if (!staffRepository.existsByStaffId("ICT2026001")) {
            String[][] sampleData = {
                    {"ICT2026001", "Abubakar Ibrahim", "Senior ICT Officer", "ICT", "Examinations", "Data Analyst", "08012345678", "abubakar@neco.gov.ng"},
                    {"ICT2026002", "Fatima Bello", "ICT Officer", "ICT", "Examinations", "System Admin", "08023456789", "fatima@neco.gov.ng"},
                    {"ICT2026003", "Oluwaseun Adeyemi", "Junior ICT Officer", "ICT", "Technical", "Network Admin", "08034567890", "oluwaseun@neco.gov.ng"},
                    {"ICT2026004", "Grace Okonkwo", "ICT Officer", "ICT", "Support", "Help Desk Lead", "08045678901", "grace@neco.gov.ng"},
                    {"ICT2026005", "Mohammed Usman", "Senior ICT Officer", "ICT", "Examinations", "Project Manager", "08056789012", "mohammed@neco.gov.ng"},
            };

            for (String[] data : sampleData) {
                Staff staff = Staff.builder()
                        .staffId(data[0])
                        .fullName(data[1])
                        .designation(data[2])
                        .department(data[3])
                        .division(data[4])
                        .role(data[5])
                        .phoneNumber(data[6])
                        .email(data[7])
                        .accountStatus(Staff.AccountStatus.ACTIVE)
                        .build();
                staff = staffRepository.save(staff);

                UserAccount account = UserAccount.builder()
                        .staff(staff)
                        .username(data[0])
                        .passwordHash(passwordEncoder.encode("123456"))
                        .active(true)
                        .firstLogin(true)
                        .role(Role.STAFF)
                        .build();
                userAccountRepository.save(account);
            }

            log.info("5 sample staff records created with default password: 123456");
        }
    }
}
