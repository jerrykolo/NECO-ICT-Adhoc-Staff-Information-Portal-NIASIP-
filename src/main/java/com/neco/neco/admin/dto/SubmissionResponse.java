package com.neco.neco.admin.dto;

import lombok.Data;

@Data
public class SubmissionResponse {

    private Long id;
    private String staffId;
    private String fullName;
    private String department;
    private String division;
    private String passportPhoto;
    private String bankName;
    private String accountName;
    private String accountNumber;
    private String submissionStatus;
    private String rejectionReason;
    private String submittedAt;
    private String approvedAt;
}
