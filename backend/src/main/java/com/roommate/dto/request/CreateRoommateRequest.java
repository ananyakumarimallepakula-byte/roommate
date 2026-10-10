package com.roommate.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateRoommateRequest {
    @NotNull(message = "Receiver user ID is required")
    private Long receiverId;

    @Size(max = 500, message = "Message must not exceed 500 characters")
    private String message;

    public CreateRoommateRequest() {}

    public CreateRoommateRequest(Long receiverId, String message) {
        this.receiverId = receiverId;
        this.message = message;
    }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
