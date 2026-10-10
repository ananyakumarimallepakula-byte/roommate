package com.roommate.service;

import com.roommate.dto.common.PagedResponse;
import com.roommate.dto.enquiry.CreateEnquiryRequest;
import com.roommate.dto.enquiry.PropertyEnquiryDto;
import com.roommate.dto.enquiry.RespondEnquiryRequest;
import com.roommate.entity.Accommodation;
import com.roommate.entity.PropertyEnquiry;
import com.roommate.entity.User;
import com.roommate.enums.EnquiryStatus;
import com.roommate.enums.NotificationType;
import com.roommate.exception.BadRequestException;
import com.roommate.exception.ResourceNotFoundException;
import com.roommate.exception.UnauthorizedException;
import com.roommate.repository.AccommodationRepository;
import com.roommate.repository.PropertyEnquiryRepository;
import com.roommate.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PropertyEnquiryService {

    private final PropertyEnquiryRepository enquiryRepository;
    private final AccommodationRepository accommodationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public PropertyEnquiryService(PropertyEnquiryRepository enquiryRepository,
                                  AccommodationRepository accommodationRepository,
                                  UserRepository userRepository,
                                  NotificationService notificationService) {
        this.enquiryRepository = enquiryRepository;
        this.accommodationRepository = accommodationRepository;
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    @Transactional
    public PropertyEnquiryDto createEnquiry(Long studentId, CreateEnquiryRequest request) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));
        Accommodation accommodation = accommodationRepository.findById(request.getAccommodationId())
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found: " + request.getAccommodationId()));

        if (accommodation.getOwner().getId().equals(studentId)) {
            throw new BadRequestException("You cannot enquire about your own property listing");
        }

        PropertyEnquiry enquiry = new PropertyEnquiry(accommodation, student, request.getMessage().trim());
        PropertyEnquiry saved = enquiryRepository.save(enquiry);

        // Notify property owner
        notificationService.sendNotification(
                accommodation.getOwner(),
                "New Property Enquiry",
                student.getFullName() + " enquired about: " + accommodation.getTitle(),
                NotificationType.ENQUIRY_NEW,
                saved.getId(),
                "PROPERTY_ENQUIRY"
        );

        return PropertyEnquiryDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertyEnquiryDto> getStudentEnquiries(Long studentId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PropertyEnquiry> enquiries = enquiryRepository.findByStudentId(studentId, pageable);
        return PagedResponse.of(enquiries.map(PropertyEnquiryDto::fromEntity));
    }

    @Transactional(readOnly = true)
    public PagedResponse<PropertyEnquiryDto> getOwnerEnquiries(Long ownerId, EnquiryStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<PropertyEnquiry> enquiries;
        if (status != null) {
            enquiries = enquiryRepository.findByOwnerIdAndStatus(ownerId, status, pageable);
        } else {
            enquiries = enquiryRepository.findByOwnerId(ownerId, pageable);
        }
        return PagedResponse.of(enquiries.map(PropertyEnquiryDto::fromEntity));
    }

    @Transactional
    public PropertyEnquiryDto respondToEnquiry(Long enquiryId, Long ownerId, RespondEnquiryRequest request) {
        PropertyEnquiry enquiry = enquiryRepository.findById(enquiryId)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found: " + enquiryId));

        if (!enquiry.getAccommodation().getOwner().getId().equals(ownerId)) {
            throw new UnauthorizedException("You are not authorized to respond to this enquiry");
        }

        enquiry.setResponse(request.getResponse().trim());
        enquiry.setStatus(EnquiryStatus.RESPONDED);
        PropertyEnquiry updated = enquiryRepository.save(enquiry);

        // Notify student
        notificationService.sendNotification(
                enquiry.getStudent(),
                "Owner Responded to Enquiry",
                enquiry.getAccommodation().getOwner().getFullName() + " replied to your enquiry on: " + enquiry.getAccommodation().getTitle(),
                NotificationType.ENQUIRY_REPLY,
                updated.getId(),
                "PROPERTY_ENQUIRY"
        );

        return PropertyEnquiryDto.fromEntity(updated);
    }
}
