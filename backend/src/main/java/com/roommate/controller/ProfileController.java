package com.roommate.controller;

import com.roommate.dto.common.ApiResponse;
import com.roommate.dto.preference.RoommatePreferenceDto;
import com.roommate.dto.profile.OwnerProfileDto;
import com.roommate.dto.profile.StudentProfileDto;
import com.roommate.security.CustomUserDetails;
import com.roommate.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/profiles")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/student/me")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getMyStudentProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        StudentProfileDto profile = profileService.getStudentProfile(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/student/me")
    public ResponseEntity<ApiResponse<StudentProfileDto>> updateMyStudentProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                                @RequestBody StudentProfileDto dto) {
        StudentProfileDto updated = profileService.updateStudentProfile(userDetails.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Student profile updated successfully", updated));
    }

    @GetMapping("/student/{userId}")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getStudentProfileByUserId(@PathVariable Long userId) {
        StudentProfileDto profile = profileService.getStudentProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @GetMapping("/owner/me")
    public ResponseEntity<ApiResponse<OwnerProfileDto>> getMyOwnerProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        OwnerProfileDto profile = profileService.getOwnerProfile(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/owner/me")
    public ResponseEntity<ApiResponse<OwnerProfileDto>> updateMyOwnerProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                            @RequestBody OwnerProfileDto dto) {
        OwnerProfileDto updated = profileService.updateOwnerProfile(userDetails.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Owner profile updated successfully", updated));
    }

    @GetMapping("/preferences/me")
    public ResponseEntity<ApiResponse<RoommatePreferenceDto>> getMyPreferences(@AuthenticationPrincipal CustomUserDetails userDetails) {
        RoommatePreferenceDto pref = profileService.getPreferences(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(pref));
    }

    @PutMapping("/preferences/me")
    public ResponseEntity<ApiResponse<RoommatePreferenceDto>> updateMyPreferences(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                                 @Valid @RequestBody RoommatePreferenceDto dto) {
        RoommatePreferenceDto updated = profileService.updatePreferences(userDetails.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Roommate preferences updated successfully", updated));
    }
}
