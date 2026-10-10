package com.roommate.dto.admin;

import com.roommate.enums.ModerationStatus;
import jakarta.validation.constraints.NotNull;

public class ModerationActionRequest {
    @NotNull(message = "Action status is required (APPROVED or REJECTED)")
    private ModerationStatus status;

    private String rejectionReason;

    public ModerationActionRequest() {}

    public ModerationActionRequest(ModerationStatus status, String rejectionReason) {
        this.status = status;
        this.rejectionReason = rejectionReason;
    }

    public ModerationStatus getStatus() { return status; }
    public void setStatus(ModerationStatus status) { this.status = status; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
}
