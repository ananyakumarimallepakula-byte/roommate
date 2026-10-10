package com.roommate.dto.request;

import com.roommate.dto.user.UserDto;
import com.roommate.entity.RoommateRequest;
import com.roommate.enums.RequestStatus;

import java.time.LocalDateTime;

public class RoommateRequestDto {
    private Long id;
    private UserDto sender;
    private UserDto receiver;
    private RequestStatus status;
    private String message;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public RoommateRequestDto() {}

    public static RoommateRequestDto fromEntity(RoommateRequest r) {
        if (r == null) return null;
        RoommateRequestDto dto = new RoommateRequestDto();
        dto.setId(r.getId());
        dto.setSender(UserDto.fromEntity(r.getSender()));
        dto.setReceiver(UserDto.fromEntity(r.getReceiver()));
        dto.setStatus(r.getStatus());
        dto.setMessage(r.getMessage());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setUpdatedAt(r.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getSender() { return sender; }
    public void setSender(UserDto sender) { this.sender = sender; }

    public UserDto getReceiver() { return receiver; }
    public void setReceiver(UserDto receiver) { this.receiver = receiver; }

    public RequestStatus getStatus() { return status; }
    public void setStatus(RequestStatus status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
