package com.roommate.controller;

import com.roommate.dto.common.ApiResponse;
import com.roommate.dto.matching.RoommateMatchDto;
import com.roommate.security.CustomUserDetails;
import com.roommate.service.MatchingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/matches")
public class MatchingController {

    private final MatchingService matchingService;

    public MatchingController(MatchingService matchingService) {
        this.matchingService = matchingService;
    }

    @GetMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<RoommateMatchDto>>> getCompatibleRoommates(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<RoommateMatchDto> matches = matchingService.findMatchesForUser(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok("Compatible roommates fetched successfully", matches));
    }
}
