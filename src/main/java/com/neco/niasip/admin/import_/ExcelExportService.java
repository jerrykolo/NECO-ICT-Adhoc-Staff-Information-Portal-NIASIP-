package com.neco.niasip.admin.import_;

import com.neco.niasip.bank.BankDetails;
import com.neco.niasip.bank.BankDetailsRepository;
import com.neco.niasip.staff.Staff;
import com.neco.niasip.staff.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class ExcelExportService {

    private final StaffRepository staffRepository;
    private final BankDetailsRepository bankDetailsRepository;

    public byte[] exportAllStaff() throws IOException {
        List<Staff> staffList = staffRepository.findAll();
        return generateStaffWorkbook(staffList);
    }

    @Transactional(readOnly = true)
    public byte[] exportByStatus(String status) throws IOException {
        List<BankDetails.SubmissionStatus> statuses = List.of(
                BankDetails.SubmissionStatus.valueOf(status.toUpperCase()));
        List<BankDetails> bankDetails = bankDetailsRepository.findBySubmissionStatusWithStaff(statuses.get(0));
        return generateSubmissionWorkbook(bankDetails);
    }

    @Transactional(readOnly = true)
    public byte[] exportSubmissions(String status) throws IOException {
        List<BankDetails> bankDetails;
        if (status != null && !status.isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            bankDetails = bankDetailsRepository.findBySubmissionStatusWithStaff(
                    BankDetails.SubmissionStatus.valueOf(status.toUpperCase()));
        } else {
            bankDetails = bankDetailsRepository.findAllWithStaff();
        }
        return generateSubmissionWorkbook(bankDetails);
    }

    private byte[] generateStaffWorkbook(List<Staff> staffList) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Staff Report");

        CellStyle headerStyle = createHeaderStyle(workbook);

        Row header = sheet.createRow(0);
        String[] columns = {"Staff ID", "Full Name", "Designation", "Department",
                "Division", "Role", "Phone", "Email", "Status"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = header.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowNum = 1;
        for (Staff staff : staffList) {
            Row row = sheet.createRow(rowNum++);
            row.createCell(0).setCellValue(staff.getStaffId());
            row.createCell(1).setCellValue(staff.getFullName());
            row.createCell(2).setCellValue(staff.getDesignation() != null ? staff.getDesignation() : "");
            row.createCell(3).setCellValue(staff.getDepartment() != null ? staff.getDepartment() : "");
            row.createCell(4).setCellValue(staff.getDivision() != null ? staff.getDivision() : "");
            row.createCell(5).setCellValue(staff.getRole() != null ? staff.getRole() : "");
            row.createCell(6).setCellValue(staff.getPhoneNumber() != null ? staff.getPhoneNumber() : "");
            row.createCell(7).setCellValue(staff.getEmail() != null ? staff.getEmail() : "");
            row.createCell(8).setCellValue(staff.getAccountStatus().name());
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        return toByteArray(workbook);
    }

    private byte[] generateSubmissionWorkbook(List<BankDetails> submissions) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Bank Submissions");

        CellStyle headerStyle = createHeaderStyle(workbook);

        Row header = sheet.createRow(0);
        String[] columns = {"Staff ID", "Full Name", "Department", "Division",
                "Bank Name", "Account Name", "Account Number", "Status", "Submitted At", "Rejection Reason"};
        for (int i = 0; i < columns.length; i++) {
            Cell cell = header.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        int rowNum = 1;
        for (BankDetails bd : submissions) {
            Row row = sheet.createRow(rowNum++);
            Staff staff = bd.getStaff();
            row.createCell(0).setCellValue(staff != null ? staff.getStaffId() : "");
            row.createCell(1).setCellValue(staff != null ? staff.getFullName() : "");
            row.createCell(2).setCellValue(staff != null && staff.getDepartment() != null ? staff.getDepartment() : "");
            row.createCell(3).setCellValue(staff != null && staff.getDivision() != null ? staff.getDivision() : "");
            row.createCell(4).setCellValue(bd.getBankName() != null ? bd.getBankName() : "");
            row.createCell(5).setCellValue(bd.getAccountName() != null ? bd.getAccountName() : "");
            row.createCell(6).setCellValue(bd.getAccountNumber() != null ? bd.getAccountNumber() : "");
            row.createCell(7).setCellValue(bd.getSubmissionStatus().name());
            row.createCell(8).setCellValue(bd.getSubmittedAt() != null ? bd.getSubmittedAt().toString() : "");
            row.createCell(9).setCellValue(bd.getRejectionReason() != null ? bd.getRejectionReason() : "");
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        return toByteArray(workbook);
    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);
        style.setFillForegroundColor(IndexedColors.LIGHT_CORNFLOWER_BLUE.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        return style;
    }

    private byte[] toByteArray(Workbook workbook) throws IOException {
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        workbook.write(bos);
        workbook.close();
        return bos.toByteArray();
    }
}
