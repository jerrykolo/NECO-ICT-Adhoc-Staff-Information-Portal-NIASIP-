package com.neco.niasip.bank;

import com.neco.niasip.common.BaseEntity;
import com.neco.niasip.staff.Staff;
import jakarta.persistence.*;
import lombok.*;

import java.sql.Timestamp;

@Entity
@Table(name = "bank_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankDetails extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false, unique = true)
    private Staff staff;

    @Column(name = "bank_name", length = 200)
    private String bankName;

    @Column(name = "account_name", length = 200)
    private String accountName;

    @Column(name = "account_number", length = 10)
    private String accountNumber;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "submission_status", length = 20)
    private SubmissionStatus submissionStatus = SubmissionStatus.DRAFT;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    @Column(name = "submitted_at")
    private Timestamp submittedAt;

    @Column(name = "approved_at")
    private Timestamp approvedAt;

    public enum SubmissionStatus {
        DRAFT, SUBMITTED, APPROVED, REJECTED
    }
}
