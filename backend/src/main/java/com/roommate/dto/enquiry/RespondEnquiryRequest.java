package com.roommate.dto.enquiry;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class RespondEnquiryRequest {
    @NotBlank(message = "Response message cannot be empty")
    @Size(min = 2, max = 1000, message = "Response must be between 2 and 1000 characters")
    private String response;

    public RespondEnquiryRequest() {}

    public RespondEnquiryRequest(String response) {
        this.response = response;
    }

    public String getResponse() { return response; }
    public void setResponse(String response) { this.response = response; }
}
