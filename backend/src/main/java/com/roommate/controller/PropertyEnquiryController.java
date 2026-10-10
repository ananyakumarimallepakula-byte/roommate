package com.roommate.controller;

import com.roommate.dto.common.ApiResponse;
import com.roommate.dto.common.PagedResponse;
import com.roommate.dto.enquiry.CreateEnquiryRequest;
import com.roommate.dto.enquiry.PropertyEnquiryDto;
import com.roommate.dto.enquiry.RespondEnquiryRequest;
import com.roommate.enums.EnquiryStatus;
import com.roommate.security.CustomUserDetails;
import com.roommate.service.PropertyEnquiryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/enquiries")
public class PropertyEnquiryController {

    private final PropertyEnquiryService enquiryService;

    public PropertyEnquiryController(PropertyEnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PropertyEnquiryDto>> createEnquiry(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateEnquiryRequest request) {
        PropertyEnquiryDto dto = enquiryService.createEnquiry(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Property enquiry sent to owner", dto));
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyEnquiryDto>>> getStudentEnquiries(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<PropertyEnquiryDto> response = enquiryService.getStudentEnquiries(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/owner")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<PropertyEnquiryDto>>> getOwnerEnquiries(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(required = false) EnquiryStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<PropertyEnquiryDto> response = enquiryService.getOwnerEnquiries(userDetails.getId(), status, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/{id}/respond")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<PropertyEnquiryDto>> respondToEnquiry(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody RespondEnquiryRequest request) {
        PropertyEnquiryDto dto = enquiryService.respondToEnquiry(id, userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Response submitted successfully", dto));
    }
}
