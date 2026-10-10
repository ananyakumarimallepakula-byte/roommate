package com.roommate.controller;

import com.roommate.dto.common.ApiResponse;
import com.roommate.dto.common.PagedResponse;
import com.roommate.dto.request.CreateRoommateRequest;
import com.roommate.dto.request.RoommateRequestDto;
import com.roommate.enums.RequestStatus;
import com.roommate.security.CustomUserDetails;
import com.roommate.service.RoommateRequestService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/roommate-requests")
@PreAuthorize("hasRole('STUDENT')")
public class RoommateRequestController {

    private final RoommateRequestService requestService;

    public RoommateRequestController(RoommateRequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<RoommateRequestDto>> sendRequest(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateRoommateRequest request) {
        RoommateRequestDto dto = requestService.sendRequest(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Roommate connection request sent successfully", dto));
    }

    @GetMapping("/sent")
    public ResponseEntity<ApiResponse<PagedResponse<RoommateRequestDto>>> getSentRequests(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<RoommateRequestDto> response = requestService.getSentRequests(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/received")
    public ResponseEntity<ApiResponse<PagedResponse<RoommateRequestDto>>> getReceivedRequests(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PagedResponse<RoommateRequestDto> response = requestService.getReceivedRequests(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<RoommateRequestDto>> updateStatus(
            @PathVariable Long id,
            @RequestParam RequestStatus status,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        RoommateRequestDto dto = requestService.updateStatus(id, userDetails.getId(), status);
        return ResponseEntity.ok(ApiResponse.ok("Request updated to " + status, dto));
    }
}
