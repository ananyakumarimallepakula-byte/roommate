package com.roommate.service;

import com.roommate.dto.accommodation.AccommodationDto;
import com.roommate.dto.admin.DashboardStatsDto;
import com.roommate.dto.admin.ModerationActionRequest;
import com.roommate.dto.admin.UserStatusUpdateRequest;
import com.roommate.dto.common.PagedResponse;
import com.roommate.dto.user.UserDto;
import com.roommate.entity.Accommodation;
import com.roommate.entity.ModerationAuditLog;
import com.roommate.entity.User;
import com.roommate.enums.*;
import com.roommate.exception.ResourceNotFoundException;
import com.roommate.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final AccommodationRepository accommodationRepository;
    private final ReportRepository reportRepository;
    private final ModerationAuditLogRepository auditLogRepository;
    private final NotificationService notificationService;

    public AdminService(UserRepository userRepository,
                        AccommodationRepository accommodationRepository,
                        ReportRepository reportRepository,
                        ModerationAuditLogRepository auditLogRepository,
                        NotificationService notificationService) {
        this.userRepository = userRepository;
        this.accommodationRepository = accommodationRepository;
        this.reportRepository = reportRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationService = notificationService;
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats() {
        DashboardStatsDto stats = new DashboardStatsDto();
        stats.setTotalUsers(userRepository.count());
        stats.setTotalStudents(userRepository.countByRole(Role.STUDENT));
        stats.setTotalOwners(userRepository.countByRole(Role.OWNER));
        stats.setTotalAccommodations(accommodationRepository.count());
        stats.setPendingAccommodations(accommodationRepository.countByModerationStatus(ModerationStatus.PENDING));
        stats.setApprovedAccommodations(accommodationRepository.countByModerationStatus(ModerationStatus.APPROVED));
        stats.setTotalPendingReports(reportRepository.countByStatus(ReportStatus.PENDING));
        stats.setActiveUsers(userRepository.countByStatus(UserStatus.ACTIVE));
        stats.setSuspendedUsers(userRepository.countByStatus(UserStatus.SUSPENDED));
        return stats;
    }

    @Transactional(readOnly = true)
    public PagedResponse<UserDto> searchUsers(String query, Role role, UserStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<User> userPage = userRepository.searchUsers(
                (query != null && !query.trim().isEmpty()) ? query.trim() : null,
                role,
                status,
                pageable
        );
        return PagedResponse.of(userPage.map(UserDto::fromEntity));
    }

    @Transactional
    public UserDto updateUserStatus(Long userId, Long adminId, UserStatusUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found: " + adminId));

        user.setStatus(request.getStatus());
        User updated = userRepository.save(user);

        // Audit Log
        ModerationAuditLog log = new ModerationAuditLog(
                admin,
                "UPDATE_USER_STATUS",
                "USER",
                user.getId(),
                "Status changed to " + request.getStatus().name() + " for user " + user.getEmail()
        );
        auditLogRepository.save(log);

        return UserDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public PagedResponse<AccommodationDto> getAccommodationsForModeration(ModerationStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Accommodation> accomPage;
        if (status != null) {
            accomPage = accommodationRepository.findByModerationStatus(status, pageable);
        } else {
            accomPage = accommodationRepository.findAll(pageable);
        }
        return PagedResponse.of(accomPage.map(AccommodationDto::fromEntity));
    }

    @Transactional
    public AccommodationDto moderateAccommodation(Long accommodationId, Long adminId, ModerationActionRequest request) {
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found: " + accommodationId));
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found: " + adminId));

        accommodation.setModerationStatus(request.getStatus());
        if (request.getStatus() == ModerationStatus.REJECTED) {
            accommodation.setRejectionReason(request.getRejectionReason());
        } else {
            accommodation.setRejectionReason(null);
        }

        Accommodation updated = accommodationRepository.save(accommodation);

        // Log audit
        ModerationAuditLog log = new ModerationAuditLog(
                admin,
                "MODERATE_LISTING",
                "ACCOMMODATION",
                accommodation.getId(),
                "Listing " + request.getStatus().name() + (request.getRejectionReason() != null ? ". Reason: " + request.getRejectionReason() : "")
        );
        auditLogRepository.save(log);

        // Notify Owner
        String notifTitle = request.getStatus() == ModerationStatus.APPROVED ? "Listing Approved" : "Listing Rejected";
        String notifMsg = request.getStatus() == ModerationStatus.APPROVED
                ? "Your listing \"" + accommodation.getTitle() + "\" has been approved and is now live on ROOMMATE!"
                : "Your listing \"" + accommodation.getTitle() + "\" was rejected. Reason: " + request.getRejectionReason();

        notificationService.sendNotification(
                accommodation.getOwner(),
                notifTitle,
                notifMsg,
                NotificationType.MODERATION,
                accommodation.getId(),
                "ACCOMMODATION"
        );

        return AccommodationDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ModerationAuditLog> getAuditLogs(int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size));
        Page<ModerationAuditLog> logs = auditLogRepository.findAllByOrderByCreatedAtDesc(pageable);
        return PagedResponse.of(logs);
    }
}
