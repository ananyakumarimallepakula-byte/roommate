package com.roommate.controller;

import com.roommate.dto.accommodation.AccommodationDto;
import com.roommate.dto.admin.DashboardStatsDto;
import com.roommate.dto.admin.ModerationActionRequest;
import com.roommate.dto.admin.UserStatusUpdateRequest;
import com.roommate.dto.common.ApiResponse;
import com.roommate.dto.common.PagedResponse;
import com.roommate.dto.report.ReportDto;
import com.roommate.dto.report.ResolveReportRequest;
import com.roommate.dto.user.UserDto;
import com.roommate.entity.ModerationAuditLog;
import com.roommate.enums.ModerationStatus;
import com.roommate.enums.ReportStatus;
import com.roommate.enums.Role;
import com.roommate.enums.UserStatus;
import com.roommate.security.CustomUserDetails;
import com.roommate.service.AdminService;
import com.roommate.service.ReportService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final ReportService reportService;

    public AdminController(AdminService adminService, ReportService reportService) {
        this.adminService = adminService;
        this.reportService = reportService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStats() {
        DashboardStatsDto stats = adminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.ok(stats));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<PagedResponse<UserDto>>> searchUsers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) Role role,
            @RequestParam(required = false) UserStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        PagedResponse<UserDto> users = adminService.searchUsers(query, role, status, page, size);
        return ResponseEntity.ok(ApiResponse.ok(users));
    }

    @PatchMapping("/users/{id}/status")
    public ResponseEntity<ApiResponse<UserDto>> updateUserStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody UserStatusUpdateRequest request) {
        UserDto updated = adminService.updateUserStatus(id, userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("User status updated to " + request.getStatus(), updated));
    }

    @GetMapping("/accommodations")
    public ResponseEntity<ApiResponse<PagedResponse<AccommodationDto>>> getAccommodations(
            @RequestParam(required = false) ModerationStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        PagedResponse<AccommodationDto> response = adminService.getAccommodationsForModeration(status, page, size);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/accommodations/{id}/moderate")
    public ResponseEntity<ApiResponse<AccommodationDto>> moderateAccommodation(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ModerationActionRequest request) {
        AccommodationDto updated = adminService.moderateAccommodation(id, userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Accommodation moderation saved", updated));
    }

    @GetMapping("/reports")
    public ResponseEntity<ApiResponse<PagedResponse<ReportDto>>> getReports(
            @RequestParam(required = false) ReportStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        PagedResponse<ReportDto> reports = reportService.getReports(status, page, size);
        return ResponseEntity.ok(ApiResponse.ok(reports));
    }

    @PostMapping("/reports/{id}/resolve")
    public ResponseEntity<ApiResponse<ReportDto>> resolveReport(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @Valid @RequestBody ResolveReportRequest request) {
        ReportDto resolved = reportService.resolveReport(id, userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Report resolved", resolved));
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<ApiResponse<PagedResponse<ModerationAuditLog>>> getAuditLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        PagedResponse<ModerationAuditLog> logs = adminService.getAuditLogs(page, size);
        return ResponseEntity.ok(ApiResponse.ok(logs));
    }
}
