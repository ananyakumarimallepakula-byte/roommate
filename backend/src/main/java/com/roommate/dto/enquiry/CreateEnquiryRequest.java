package com.roommate.dto.enquiry;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateEnquiryRequest {
    @NotNull(message = "Accommodation ID is required")
    private Long accommodationId;

    @NotBlank(message = "Enquiry message is required")
    @Size(min = 5, max = 1000, message = "Message must be between 5 and 1000 characters")
    private String message;

    public CreateEnquiryRequest() {}

    public CreateEnquiryRequest(Long accommodationId, String message) {
        this.accommodationId = accommodationId;
        this.message = message;
    }

    public Long getAccommodationId() { return accommodationId; }
    public void setAccommodationId(Long accommodationId) { this.accommodationId = accommodationId; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
