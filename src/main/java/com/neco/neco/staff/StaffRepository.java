package com.neco.neco.staff;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {

    Optional<Staff> findByStaffId(String staffId);

    boolean existsByStaffId(String staffId);

    @Query("SELECT s FROM Staff s WHERE " +
           "(:search IS NULL OR :search = '' OR " +
           "LOWER(s.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.staffId) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.department) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Staff> search(@Param("search") String search, Pageable pageable);

    @Query("SELECT COUNT(s) FROM Staff s WHERE s.accountStatus = :status")
    long countByAccountStatus(@Param("status") Staff.AccountStatus status);
}
