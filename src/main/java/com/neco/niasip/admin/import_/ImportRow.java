package com.neco.niasip.admin.import_;

import lombok.Data;

@Data
public class ImportRow {

    private int rowNumber;
    private String staffId;
    private String fullName;
    private String designation;
    private String department;
    private String division;
    private String role;
    private String phoneNumber;
    private String email;
    private boolean duplicate;
    private boolean valid;
    private java.util.List<String> errors;
}
