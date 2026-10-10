package com.roommate.dto.report;

import com.roommate.enums.ReportStatus;
import jakarta.validation.constraints.NotNull;

public class ResolveReportRequest {
    @NotNull(message = "Resolution status is required (RESOLVED or DISMISSED)")
    private ReportStatus status;

    private String adminNotes;

    public ResolveReportRequest() {}

    public ResolveReportRequest(ReportStatus status, String adminNotes) {
        this.status = status;
        this.adminNotes = adminNotes;
    }

    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }
}
