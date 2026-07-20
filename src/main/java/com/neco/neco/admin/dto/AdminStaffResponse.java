package com.neco.neco.admin.dto;

import lombok.Data;

@Data
public class AdminStaffResponse {

    private Long id;
    private String staffId;
    private String fullName;
    private String designation;
    private String department;
    private String division;
    private String role;
    private String category;
    private String phoneNumber;
    private String email;
    private String accountStatus;
    private boolean hasUserAccount;
    private boolean hasBankDetails;
    private String bankSubmissionStatus;
}
