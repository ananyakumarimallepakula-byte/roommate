package com.roommate.dto.enquiry;

import com.roommate.dto.accommodation.AccommodationDto;
import com.roommate.dto.user.UserDto;
import com.roommate.entity.PropertyEnquiry;
import com.roommate.enums.EnquiryStatus;

import java.time.LocalDateTime;

public class PropertyEnquiryDto {
    private Long id;
    private AccommodationDto accommodation;
    private UserDto student;
    private String message;
    private String response;
    private EnquiryStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public PropertyEnquiryDto() {}

    public static PropertyEnquiryDto fromEntity(PropertyEnquiry pe) {
        if (pe == null) return null;
        PropertyEnquiryDto dto = new PropertyEnquiryDto();
        dto.setId(pe.getId());
        dto.setAccommodation(AccommodationDto.fromEntity(pe.getAccommodation()));
        dto.setStudent(UserDto.fromEntity(pe.getStudent()));
        dto.setMessage(pe.getMessage());
        dto.setResponse(pe.getResponse());
        dto.setStatus(pe.getStatus());
        dto.setCreatedAt(pe.getCreatedAt());
        dto.setUpdatedAt(pe.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public AccommodationDto getAccommodation() { return accommodation; }
    public void setAccommodation(AccommodationDto accommodation) { this.accommodation = accommodation; }

    public UserDto getStudent() { return student; }
    public void setStudent(UserDto student) { this.student = student; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }

    public EnquiryStatus getStatus() { return status; }
    public void setStatus(EnquiryStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
