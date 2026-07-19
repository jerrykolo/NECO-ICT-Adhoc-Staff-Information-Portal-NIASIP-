package com.neco.niasip.file;

import com.neco.niasip.common.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileController {

    @Value("${app.upload.passport-dir:./uploads/passports}")
    private String passportDir;

    @PostMapping("/passport/{staffId}")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadPassport(
            @PathVariable String staffId,
            @RequestParam("file") MultipartFile file) throws IOException {

        Path uploadPath = Paths.get(passportDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";

        String filename = staffId + "_" + UUID.randomUUID() + extension;
        Path filePath = uploadPath.resolve(filename);
        file.transferTo(filePath.toFile());

        return ResponseEntity.ok(ApiResponse.success("Passport uploaded",
                Map.of("filename", filename, "path", filePath.toString())));
    }

    @GetMapping("/passport/{staffId}")
    public ResponseEntity<Resource> getPassport(@PathVariable String staffId) {
        Path uploadPath = Paths.get(passportDir);
        try {
            Path[] files = Files.list(uploadPath)
                    .filter(p -> p.getFileName().toString().startsWith(staffId + "_"))
                    .toArray(Path[]::new);

            if (files.length == 0) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new FileSystemResource(files[0]);
            String contentType = Files.probeContentType(files[0]);
            if (contentType == null) {
                contentType = "application/octet-stream";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                    .body(resource);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
