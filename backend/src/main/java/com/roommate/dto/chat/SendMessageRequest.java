package com.roommate.dto.chat;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class SendMessageRequest {
    @NotNull(message = "Recipient user ID is required")
    private Long recipientId;

    @NotBlank(message = "Message text cannot be empty")
    @Size(max = 2000, message = "Message must not exceed 2000 characters")
    private String content;

    public SendMessageRequest() {}

    public SendMessageRequest(Long recipientId, String content) {
        this.recipientId = recipientId;
        this.content = content;
    }

    public Long getRecipientId() { return recipientId; }
    public void setRecipientId(Long recipientId) { this.recipientId = recipientId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
