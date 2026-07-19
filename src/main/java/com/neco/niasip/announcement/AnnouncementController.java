package com.neco.niasip.announcement;

import com.neco.niasip.common.ApiResponse;
import com.neco.niasip.common.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.Timestamp;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementRepository announcementRepository;

    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<Announcement>>> getActiveAnnouncements() {
        List<Announcement> announcements = announcementRepository.findByActiveTrueOrderByPublishedAtDesc();
        return ResponseEntity.ok(ApiResponse.success("Announcements retrieved", announcements));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<Announcement>>> getAllAnnouncements() {
        List<Announcement> announcements = announcementRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Announcements retrieved", announcements));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Announcement>> createAnnouncement(
            @RequestBody Map<String, Object> body) {
        Announcement announcement = new Announcement();
        announcement.setTitle((String) body.get("title"));
        announcement.setContent((String) body.get("content"));
        announcement.setPublishedAt(Timestamp.from(Instant.now()));
        announcement.setActive(true);
        announcement = announcementRepository.save(announcement);
        return ResponseEntity.ok(ApiResponse.success("Announcement created", announcement));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Announcement>> updateAnnouncement(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Announcement", "id", id));
        announcement.setTitle((String) body.get("title"));
        announcement.setContent((String) body.get("content"));
        if (body.containsKey("active")) {
            announcement.setActive((Boolean) body.get("active"));
        }
        announcement = announcementRepository.save(announcement);
        return ResponseEntity.ok(ApiResponse.success("Announcement updated", announcement));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAnnouncement(@PathVariable Long id) {
        announcementRepository.deleteById(id);
        return ResponseEntity.ok(ApiResponse.success("Announcement deleted"));
    }
}
