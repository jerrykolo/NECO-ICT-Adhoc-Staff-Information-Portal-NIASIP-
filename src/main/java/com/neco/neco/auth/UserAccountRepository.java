package com.neco.neco.auth;

import com.neco.neco.auth.role.Role;
import com.neco.neco.staff.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, Long> {

    Optional<UserAccount> findByUsername(String username);

    Optional<UserAccount> findByStaff(Staff staff);

    boolean existsByUsername(String username);

    long countByRole(Role role);
}
