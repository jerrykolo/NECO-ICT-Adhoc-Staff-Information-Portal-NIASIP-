package com.neco.niasip.staff.dto;

import lombok.Data;

@Data
public class StaffProfileResponse {

    private Long id;
    private String staffId;
    private String fullName;
    private String designation;
    private String department;
    private String division;
    private String role;
    private String phoneNumber;
    private String email;
    private String passportPhoto;
    private String accountStatus;
    private boolean hasBankDetails;
    private String bankSubmissionStatus;
}
