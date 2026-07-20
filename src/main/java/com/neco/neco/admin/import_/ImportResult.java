package com.neco.neco.admin.import_;

import lombok.Data;

import java.util.List;

@Data
public class ImportResult {

    private int totalRows;
    private int importedCount;
    private int skippedCount;
    private List<String> errors;
}
