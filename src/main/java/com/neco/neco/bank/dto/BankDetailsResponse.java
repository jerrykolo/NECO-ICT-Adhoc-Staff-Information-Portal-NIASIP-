package com.neco.neco.bank.dto;

import lombok.Data;

@Data
public class BankDetailsResponse {

    private Long id;
    private String bankName;
    private String accountName;
    private String accountNumber;
    private String submissionStatus;
    private String rejectionReason;
    private String submittedAt;
    private String approvedAt;
}
