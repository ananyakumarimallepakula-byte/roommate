package com.roommate.dto.admin;

import com.roommate.enums.UserStatus;
import jakarta.validation.constraints.NotNull;

public class UserStatusUpdateRequest {
    @NotNull(message = "User status is required (ACTIVE, SUSPENDED, PENDING)")
    private UserStatus status;

    public UserStatusUpdateRequest() {}

    public UserStatusUpdateRequest(UserStatus status) {
        this.status = status;
    }

    public UserStatus getStatus() { return status; }
    public void setStatus(UserStatus status) { this.status = status; }
}
