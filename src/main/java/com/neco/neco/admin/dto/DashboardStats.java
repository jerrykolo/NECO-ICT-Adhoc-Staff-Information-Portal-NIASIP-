package com.neco.neco.admin.dto;

import lombok.Data;

@Data
public class DashboardStats {

    private long totalStaff;
    private long activeStaff;
    private long inactiveStaff;
    private long totalSubmissions;
    private long submittedCount;
    private long approvedCount;
    private long rejectedCount;
    private long draftCount;
    private long totalAnnouncements;
}
