package com.neco.neco.admin;

import com.neco.neco.admin.import_.ExcelExportService;
import com.neco.neco.admin.import_.ExcelImportService;
import com.neco.neco.admin.import_.ImportResult;
import com.neco.neco.admin.import_.ImportRow;
import com.neco.neco.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ImportExportController {

    private final ExcelImportService importService;
    private final ExcelExportService exportService;

    @PostMapping("/import/preview")
    public ResponseEntity<ApiResponse<List<ImportRow>>> previewImport(
            @RequestParam("file") MultipartFile file) throws IOException {
        List<ImportRow> rows = importService.previewImport(file);
        return ResponseEntity.ok(ApiResponse.success("Preview generated", rows));
    }

    @PostMapping("/import/confirm")
    public ResponseEntity<ApiResponse<ImportResult>> confirmImport(
            @RequestParam("file") MultipartFile file) throws IOException {
        ImportResult result = importService.confirmImport(file);
        return ResponseEntity.ok(ApiResponse.success("Import completed", result));
    }

    @GetMapping("/export/staff")
    public ResponseEntity<byte[]> exportStaff() throws IOException {
        byte[] data = exportService.exportAllStaff();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=staff_report.xlsx")
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }

    @GetMapping("/export/submissions")
    public ResponseEntity<byte[]> exportSubmissions(
            @RequestParam(required = false) String status) throws IOException {
        byte[] data = exportService.exportSubmissions(status);
        String filename = "submissions_" + (status != null ? status.toLowerCase() : "all") + ".xlsx";
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + filename)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(data);
    }
}
