package com.roommate.dto.report;

import com.roommate.dto.user.UserDto;
import com.roommate.entity.Report;
import com.roommate.enums.ReportStatus;
import com.roommate.enums.ReportTargetType;

import java.time.LocalDateTime;

public class ReportDto {
    private Long id;
    private UserDto reporter;
    private ReportTargetType targetType;
    private Long targetId;
    private String reason;
    private String description;
    private ReportStatus status;
    private String adminNotes;
    private UserDto resolvedByAdmin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public ReportDto() {}

    public static ReportDto fromEntity(Report r) {
        if (r == null) return null;
        ReportDto dto = new ReportDto();
        dto.setId(r.getId());
        dto.setReporter(UserDto.fromEntity(r.getReporter()));
        dto.setTargetType(r.getTargetType());
        dto.setTargetId(r.getTargetId());
        dto.setReason(r.getReason());
        dto.setDescription(r.getDescription());
        dto.setStatus(r.getStatus());
        dto.setAdminNotes(r.getAdminNotes());
        if (r.getResolvedByAdmin() != null) {
            dto.setResolvedByAdmin(UserDto.fromEntity(r.getResolvedByAdmin()));
        }
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getReporter() { return reporter; }
    public void setReporter(UserDto reporter) { this.reporter = reporter; }

    public ReportTargetType getTargetType() { return targetType; }
    public void setTargetType(ReportTargetType targetType) { this.targetType = targetType; }

    public Long getTargetId() { return targetId; }
    public void setTargetId(Long targetId) { this.targetId = targetId; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public ReportStatus getStatus() { return status; }
    public void setStatus(ReportStatus status) { this.status = status; }

    public String getAdminNotes() { return adminNotes; }
    public void setAdminNotes(String adminNotes) { this.adminNotes = adminNotes; }

    public UserDto getResolvedByAdmin() { return resolvedByAdmin; }
    public void setResolvedByAdmin(UserDto resolvedByAdmin) { this.resolvedByAdmin = resolvedByAdmin; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
