package com.neco.neco.admin.import_;

import lombok.Data;

@Data
public class ImportRow {

    private int rowNumber;
    private String staffId;
    private String fullName;
    private String category;
    private String phoneNumber;
    private String bankName;
    private String accountName;
    private String accountNumber;
    private boolean duplicate;
    private boolean valid;
    private java.util.List<String> errors;
}
