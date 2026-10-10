package com.roommate.service;

import com.roommate.dto.common.PagedResponse;
import com.roommate.dto.request.CreateRoommateRequest;
import com.roommate.dto.request.RoommateRequestDto;
import com.roommate.entity.RoommateRequest;
import com.roommate.entity.User;
import com.roommate.enums.NotificationType;
import com.roommate.enums.RequestStatus;
import com.roommate.enums.Role;
import com.roommate.exception.BadRequestException;
import com.roommate.exception.DuplicateResourceException;
import com.roommate.exception.ResourceNotFoundException;
import com.roommate.exception.UnauthorizedException;
import com.roommate.repository.RoommateRequestRepository;
import com.roommate.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class RoommateRequestService {

    private final RoommateRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public RoommateRequestService(RoommateRequestRepository requestRepository,
                                  UserRepository userRepository,
                                  NotificationService notificationService) {
        this.requestRepository = requestRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public RoommateRequestDto sendRequest(Long senderId, CreateRoommateRequest request) {
        if (senderId.equals(request.getReceiverId())) {
            throw new BadRequestException("You cannot send a roommate request to yourself");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found: " + senderId));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new ResourceNotFoundException("Receiver not found: " + request.getReceiverId()));

        if (sender.getRole() != Role.STUDENT || receiver.getRole() != Role.STUDENT) {
            throw new BadRequestException("Roommate connection requests are only between students");
        }

        Optional<RoommateRequest> existingPending = requestRepository.findPendingBetweenUsers(senderId, request.getReceiverId(), RequestStatus.PENDING);
        if (existingPending.isPresent()) {
            throw new DuplicateResourceException("A pending roommate request already exists between you and " + receiver.getFullName());
        }

        RoommateRequest entity = new RoommateRequest(sender, receiver, request.getMessage());
        RoommateRequest saved = requestRepository.save(entity);

        // Send notification to receiver
        notificationService.sendNotification(
                receiver,
                "New Roommate Request",
                sender.getFullName() + " sent you a roommate connection request.",
                NotificationType.ROOMMATE_REQUEST,
                saved.getId(),
                "ROOMMATE_REQUEST"
        );

        return RoommateRequestDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<RoommateRequestDto> getSentRequests(Long senderId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<RoommateRequest> requests = requestRepository.findBySenderId(senderId, pageable);
        return PagedResponse.of(requests.map(RoommateRequestDto::fromEntity));
    }

    @Transactional(readOnly = true)
    public PagedResponse<RoommateRequestDto> getReceivedRequests(Long receiverId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<RoommateRequest> requests = requestRepository.findByReceiverId(receiverId, pageable);
        return PagedResponse.of(requests.map(RoommateRequestDto::fromEntity));
    }

    @Transactional
    public RoommateRequestDto updateStatus(Long requestId, Long currentUserId, RequestStatus newStatus) {
        RoommateRequest request = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Request not found: " + requestId));

        if (newStatus == RequestStatus.ACCEPTED || newStatus == RequestStatus.REJECTED) {
            if (!request.getReceiver().getId().equals(currentUserId)) {
                throw new UnauthorizedException("Only the recipient can accept or reject this request");
            }
        } else if (newStatus == RequestStatus.CANCELLED) {
            if (!request.getSender().getId().equals(currentUserId)) {
                throw new UnauthorizedException("Only the sender can cancel this request");
            }
        }

        request.setStatus(newStatus);
        RoommateRequest updated = requestRepository.save(request);

        // Send notification to the other party
        User notifyTarget = request.getReceiver().getId().equals(currentUserId) ? request.getSender() : request.getReceiver();
        String title = "Roommate Request " + newStatus.name();
        String message = request.getReceiver().getFullName() + " marked your request as " + newStatus.name().toLowerCase() + ".";

        notificationService.sendNotification(
                notifyTarget,
                title,
                message,
                NotificationType.REQUEST_STATUS,
                updated.getId(),
                "ROOMMATE_REQUEST"
        );

        return RoommateRequestDto.fromEntity(updated);
    }
}
