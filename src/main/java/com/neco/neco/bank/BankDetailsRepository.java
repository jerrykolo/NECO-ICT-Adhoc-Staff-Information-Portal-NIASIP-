package com.neco.neco.bank;

import com.neco.neco.staff.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BankDetailsRepository extends JpaRepository<BankDetails, Long> {

    Optional<BankDetails> findByStaff(Staff staff);

    Optional<BankDetails> findByStaffId(Long staffId);

    List<BankDetails> findBySubmissionStatus(BankDetails.SubmissionStatus status);

    @Query("SELECT bd FROM BankDetails bd JOIN FETCH bd.staff WHERE bd.submissionStatus = :status")
    List<BankDetails> findBySubmissionStatusWithStaff(@Param("status") BankDetails.SubmissionStatus status);

    @Query("SELECT bd FROM BankDetails bd JOIN FETCH bd.staff")
    List<BankDetails> findAllWithStaff();

    @Query("SELECT COUNT(bd) FROM BankDetails bd WHERE bd.submissionStatus = :status")
    long countBySubmissionStatus(@Param("status") BankDetails.SubmissionStatus status);

    @Query("SELECT COUNT(bd) FROM BankDetails bd WHERE bd.submissionStatus IN :statuses")
    long countBySubmissionStatusIn(@Param("statuses") List<BankDetails.SubmissionStatus> statuses);
}
