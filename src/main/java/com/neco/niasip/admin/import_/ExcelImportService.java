package com.neco.niasip.admin.import_;

import com.neco.niasip.auth.UserAccount;
import com.neco.niasip.auth.UserAccountRepository;
import com.neco.niasip.auth.role.Role;
import com.neco.niasip.common.exception.BadRequestException;
import com.neco.niasip.staff.Staff;
import com.neco.niasip.staff.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelImportService {

    private final StaffRepository staffRepository;
    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public List<ImportRow> previewImport(MultipartFile file) throws IOException {
        List<ImportRow> rows = new ArrayList<>();
        Workbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;

            ImportRow importRow = new ImportRow();
            importRow.setRowNumber(i);
            importRow.setStaffId(getCellStringValue(row.getCell(0)));
            importRow.setFullName(getCellStringValue(row.getCell(1)));
            importRow.setDesignation(getCellStringValue(row.getCell(2)));
            importRow.setDepartment(getCellStringValue(row.getCell(3)));
            importRow.setDivision(getCellStringValue(row.getCell(4)));
            importRow.setRole(getCellStringValue(row.getCell(5)));
            importRow.setPhoneNumber(getCellStringValue(row.getCell(6)));
            importRow.setEmail(getCellStringValue(row.getCell(7)));

            importRow.setDuplicate(staffRepository.existsByStaffId(importRow.getStaffId()));
            importRow.setValid(validateRow(importRow));
            importRow.setErrors(getValidationErrors(importRow));

            rows.add(importRow);
        }

        workbook.close();
        return rows;
    }

    public ImportResult confirmImport(MultipartFile file) throws IOException {
        List<ImportRow> preview = previewImport(file);
        ImportResult result = new ImportResult();
        result.setTotalRows(preview.size());
        result.setImportedCount(0);
        result.setSkippedCount(0);
        result.setErrors(new ArrayList<>());

        for (ImportRow row : preview) {
            if (!row.isValid() || row.isDuplicate()) {
                result.setSkippedCount(result.getSkippedCount() + 1);
                result.getErrors().add("Row " + row.getRowNumber() + ": skipped (duplicate or invalid)");
                continue;
            }

            try {
                Staff staff = Staff.builder()
                        .staffId(row.getStaffId())
                        .fullName(row.getFullName())
                        .designation(row.getDesignation())
                        .department(row.getDepartment())
                        .division(row.getDivision())
                        .role(row.getRole())
                        .phoneNumber(row.getPhoneNumber())
                        .email(row.getEmail())
                        .accountStatus(Staff.AccountStatus.ACTIVE)
                        .build();
                staff = staffRepository.save(staff);

                String defaultPassword = generateDefaultPassword(row);
                UserAccount account = UserAccount.builder()
                        .staff(staff)
                        .username(row.getStaffId())
                        .passwordHash(passwordEncoder.encode(defaultPassword))
                        .active(true)
                        .firstLogin(true)
                        .role(Role.STAFF)
                        .build();
                userAccountRepository.save(account);

                result.setImportedCount(result.getImportedCount() + 1);
            } catch (Exception e) {
                result.setSkippedCount(result.getSkippedCount() + 1);
                result.getErrors().add("Row " + row.getRowNumber() + ": " + e.getMessage());
            }
        }

        return result;
    }

    private String getCellStringValue(Cell cell) {
        if (cell == null) return "";
        cell.setCellType(CellType.STRING);
        return cell.getStringCellValue().trim();
    }

    private boolean validateRow(ImportRow row) {
        return row.getStaffId() != null && !row.getStaffId().isEmpty()
                && row.getFullName() != null && !row.getFullName().isEmpty();
    }

    private List<String> getValidationErrors(ImportRow row) {
        List<String> errors = new ArrayList<>();
        if (row.getStaffId() == null || row.getStaffId().isEmpty()) {
            errors.add("Staff ID is required");
        }
        if (row.getFullName() == null || row.getFullName().isEmpty()) {
            errors.add("Full name is required");
        }
        if (row.isDuplicate()) {
            errors.add("Staff ID already exists");
        }
        return errors;
    }

    private String generateDefaultPassword(ImportRow row) {
        if (row.getPhoneNumber() != null && row.getPhoneNumber().length() >= 6) {
            return row.getPhoneNumber().substring(row.getPhoneNumber().length() - 6);
        }
        return "123456";
    }
}
