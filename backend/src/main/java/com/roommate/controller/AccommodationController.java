package com.roommate.controller;

import com.roommate.dto.accommodation.*;
import com.roommate.dto.common.ApiResponse;
import com.roommate.dto.common.PagedResponse;
import com.roommate.enums.AvailabilityStatus;
import com.roommate.security.CustomUserDetails;
import com.roommate.service.AccommodationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/accommodations")
public class AccommodationController {

    private final AccommodationService accommodationService;

    public AccommodationController(AccommodationService accommodationService) {
        this.accommodationService = accommodationService;
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<AccommodationDto>>> search(
            @ModelAttribute AccommodationSearchFilter filter,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails != null ? userDetails.getId() : null;
        PagedResponse<AccommodationDto> response = accommodationService.searchAccommodations(filter, userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<AccommodationDto>>> getFeatured(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails != null ? userDetails.getId() : null;
        List<AccommodationDto> response = accommodationService.getFeaturedAccommodations(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/cities")
    public ResponseEntity<ApiResponse<List<String>>> getCities() {
        return ResponseEntity.ok(ApiResponse.ok(accommodationService.getApprovedCities()));
    }

    @GetMapping("/amenities")
    public ResponseEntity<ApiResponse<List<AmenityDto>>> getAmenities() {
        return ResponseEntity.ok(ApiResponse.ok(accommodationService.getAllAmenities()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccommodationDto>> getById(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        Long userId = userDetails != null ? userDetails.getId() : null;
        AccommodationDto dto = accommodationService.getAccommodationById(id, userId);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<AccommodationDto>> create(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateAccommodationRequest request) {
        AccommodationDto created = accommodationService.createAccommodation(userDetails.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Accommodation listed successfully. It is pending admin moderation.", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<AccommodationDto>> update(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody CreateAccommodationRequest request) {
        AccommodationDto updated = accommodationService.updateAccommodation(id, userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Accommodation updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        accommodationService.deleteAccommodation(id, userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Accommodation listing deleted successfully", null));
    }

    @PatchMapping("/{id}/availability")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> updateAvailability(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam AvailabilityStatus status) {
        accommodationService.updateAvailabilityStatus(id, userDetails.getId(), status);
        return ResponseEntity.ok(ApiResponse.ok("Availability status updated to " + status, null));
    }

    @PostMapping("/{id}/save")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> toggleSave(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        boolean saved = accommodationService.toggleSaveListing(userDetails.getId(), id);
        return ResponseEntity.ok(ApiResponse.ok(saved ? "Listing saved to favorites" : "Listing removed from favorites", Map.of("isSaved", saved)));
    }

    @GetMapping("/saved")
    public ResponseEntity<ApiResponse<PagedResponse<AccommodationDto>>> getSavedListings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        PagedResponse<AccommodationDto> response = accommodationService.getSavedListings(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/my-listings")
    @PreAuthorize("hasAnyRole('OWNER', 'ADMIN')")
    public ResponseEntity<ApiResponse<PagedResponse<AccommodationDto>>> getMyListings(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        PagedResponse<AccommodationDto> response = accommodationService.getOwnerAccommodations(userDetails.getId(), page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }
}
