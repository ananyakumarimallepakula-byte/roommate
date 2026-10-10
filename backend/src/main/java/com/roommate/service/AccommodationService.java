package com.roommate.service;

import com.roommate.dto.accommodation.*;
import com.roommate.dto.common.PagedResponse;
import com.roommate.entity.*;
import com.roommate.enums.AvailabilityStatus;
import com.roommate.enums.ModerationStatus;
import com.roommate.enums.Role;
import com.roommate.exception.BadRequestException;
import com.roommate.exception.ResourceNotFoundException;
import com.roommate.exception.UnauthorizedException;
import com.roommate.repository.*;
import com.roommate.specification.AccommodationSpecification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AccommodationService {

    private final AccommodationRepository accommodationRepository;
    private final AccommodationImageRepository accommodationImageRepository;
    private final AmenityRepository amenityRepository;
    private final SavedListingRepository savedListingRepository;
    private final UserRepository userRepository;

    public AccommodationService(AccommodationRepository accommodationRepository,
                                AccommodationImageRepository accommodationImageRepository,
                                AmenityRepository amenityRepository,
                                SavedListingRepository savedListingRepository,
                                UserRepository userRepository) {
        this.accommodationRepository = accommodationRepository;
        this.accommodationImageRepository = accommodationImageRepository;
        this.amenityRepository = amenityRepository;
        this.savedListingRepository = savedListingRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public PagedResponse<AccommodationDto> searchAccommodations(AccommodationSearchFilter filter, Long currentUserId) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        if ("price_asc".equalsIgnoreCase(filter.getSortBy())) {
            sort = Sort.by(Sort.Direction.ASC, "rent");
        } else if ("price_desc".equalsIgnoreCase(filter.getSortBy())) {
            sort = Sort.by(Sort.Direction.DESC, "rent");
        }

        Pageable pageable = PageRequest.of(Math.max(0, filter.getPage()), Math.max(1, filter.getSize()), sort);
        Specification<Accommodation> spec = AccommodationSpecification.filter(filter, true);
        Page<Accommodation> page = accommodationRepository.findAll(spec, pageable);

        Set<Long> savedIds = currentUserId != null ? getSavedAccommodationIds(currentUserId) : Collections.emptySet();

        Page<AccommodationDto> dtoPage = page.map(a -> AccommodationDto.fromEntity(a, savedIds.contains(a.getId())));
        return PagedResponse.of(dtoPage);
    }

    @Transactional(readOnly = true)
    public List<AccommodationDto> getFeaturedAccommodations(Long currentUserId) {
        Pageable pageable = PageRequest.of(0, 6, Sort.by(Sort.Direction.DESC, "createdAt"));
        List<Accommodation> list = accommodationRepository.findFeaturedAccommodations(pageable);
        Set<Long> savedIds = currentUserId != null ? getSavedAccommodationIds(currentUserId) : Collections.emptySet();

        return list.stream()
                .map(a -> AccommodationDto.fromEntity(a, savedIds.contains(a.getId())))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AccommodationDto getAccommodationById(Long id, Long currentUserId) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found with id: " + id));

        boolean isSaved = currentUserId != null && savedListingRepository.existsByUserIdAndAccommodationId(currentUserId, id);
        return AccommodationDto.fromEntity(accommodation, isSaved);
    }

    @Transactional
    public AccommodationDto createAccommodation(Long ownerId, CreateAccommodationRequest request) {
        User owner = userRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found: " + ownerId));

        if (owner.getRole() != Role.OWNER && owner.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("Only registered accommodation owners can post listings");
        }

        Accommodation accommodation = new Accommodation();
        accommodation.setOwner(owner);
        accommodation.setTitle(request.getTitle().trim());
        accommodation.setDescription(request.getDescription().trim());
        accommodation.setCity(request.getCity().trim());
        accommodation.setLocality(request.getLocality().trim());
        accommodation.setAddress(request.getAddress().trim());
        accommodation.setRent(request.getRent());
        accommodation.setSecurityDeposit(request.getSecurityDeposit());
        accommodation.setRoomType(request.getRoomType());
        accommodation.setFurnishingStatus(request.getFurnishingStatus());
        accommodation.setGenderPreference(request.getGenderPreference());
        accommodation.setAvailableFrom(request.getAvailableFrom());
        accommodation.setAvailabilityStatus(AvailabilityStatus.AVAILABLE);
        accommodation.setModerationStatus(ModerationStatus.PENDING); // Pending admin review
        accommodation.setHouseRules(request.getHouseRules());

        // Amenities
        if (request.getAmenityIds() != null && !request.getAmenityIds().isEmpty()) {
            List<Amenity> amenities = amenityRepository.findAllById(request.getAmenityIds());
            accommodation.setAmenities(new HashSet<>(amenities));
        }

        Accommodation saved = accommodationRepository.save(accommodation);

        // Images
        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            List<AccommodationImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                String url = request.getImageUrls().get(i);
                AccommodationImage img = new AccommodationImage(saved, url, i == 0);
                images.add(accommodationImageRepository.save(img));
            }
            saved.setImages(images);
        }

        return AccommodationDto.fromEntity(saved, false);
    }

    @Transactional
    public AccommodationDto updateAccommodation(Long id, Long currentUserId, CreateAccommodationRequest request) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found: " + id));

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserId));

        if (!accommodation.getOwner().getId().equals(currentUserId) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You are not authorized to edit this listing");
        }

        accommodation.setTitle(request.getTitle().trim());
        accommodation.setDescription(request.getDescription().trim());
        accommodation.setCity(request.getCity().trim());
        accommodation.setLocality(request.getLocality().trim());
        accommodation.setAddress(request.getAddress().trim());
        accommodation.setRent(request.getRent());
        accommodation.setSecurityDeposit(request.getSecurityDeposit());
        accommodation.setRoomType(request.getRoomType());
        accommodation.setFurnishingStatus(request.getFurnishingStatus());
        accommodation.setGenderPreference(request.getGenderPreference());
        accommodation.setAvailableFrom(request.getAvailableFrom());
        accommodation.setHouseRules(request.getHouseRules());

        // Resubmission sets status to PENDING if it was REJECTED
        if (accommodation.getModerationStatus() == ModerationStatus.REJECTED) {
            accommodation.setModerationStatus(ModerationStatus.PENDING);
            accommodation.setRejectionReason(null);
        }

        if (request.getAmenityIds() != null) {
            List<Amenity> amenities = amenityRepository.findAllById(request.getAmenityIds());
            accommodation.setAmenities(new HashSet<>(amenities));
        }

        if (request.getImageUrls() != null && !request.getImageUrls().isEmpty()) {
            accommodationImageRepository.deleteByAccommodationId(accommodation.getId());
            List<AccommodationImage> images = new ArrayList<>();
            for (int i = 0; i < request.getImageUrls().size(); i++) {
                String url = request.getImageUrls().get(i);
                AccommodationImage img = new AccommodationImage(accommodation, url, i == 0);
                images.add(accommodationImageRepository.save(img));
            }
            accommodation.setImages(images);
        }

        Accommodation updated = accommodationRepository.save(accommodation);
        return AccommodationDto.fromEntity(updated);
    }

    @Transactional
    public void deleteAccommodation(Long id, Long currentUserId) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found: " + id));

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserId));

        if (!accommodation.getOwner().getId().equals(currentUserId) && user.getRole() != Role.ADMIN) {
            throw new UnauthorizedException("You are not authorized to delete this listing");
        }

        accommodationRepository.delete(accommodation);
    }

    @Transactional
    public void updateAvailabilityStatus(Long id, Long ownerId, AvailabilityStatus status) {
        Accommodation accommodation = accommodationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found: " + id));

        if (!accommodation.getOwner().getId().equals(ownerId)) {
            throw new UnauthorizedException("You can only modify availability of your own listings");
        }

        accommodation.setAvailabilityStatus(status);
        accommodationRepository.save(accommodation);
    }

    @Transactional
    public boolean toggleSaveListing(Long userId, Long accommodationId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
        Accommodation accommodation = accommodationRepository.findById(accommodationId)
                .orElseThrow(() -> new ResourceNotFoundException("Accommodation not found: " + accommodationId));

        Optional<SavedListing> existing = savedListingRepository.findByUserIdAndAccommodationId(userId, accommodationId);
        if (existing.isPresent()) {
            savedListingRepository.delete(existing.get());
            return false; // Now unsaved
        } else {
            savedListingRepository.save(new SavedListing(user, accommodation));
            return true; // Now saved
        }
    }

    @Transactional(readOnly = true)
    public PagedResponse<AccommodationDto> getSavedListings(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<SavedListing> savedPage = savedListingRepository.findByUserId(userId, pageable);
        Page<AccommodationDto> dtoPage = savedPage.map(sl -> AccommodationDto.fromEntity(sl.getAccommodation(), true));
        return PagedResponse.of(dtoPage);
    }

    @Transactional(readOnly = true)
    public PagedResponse<AccommodationDto> getOwnerAccommodations(Long ownerId, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Accommodation> ownerPage = accommodationRepository.findByOwnerId(ownerId, pageable);
        return PagedResponse.of(ownerPage.map(AccommodationDto::fromEntity));
    }

    @Transactional(readOnly = true)
    public List<String> getApprovedCities() {
        return accommodationRepository.findDistinctApprovedCities();
    }

    @Transactional(readOnly = true)
    public List<AmenityDto> getAllAmenities() {
        return amenityRepository.findAll().stream()
                .map(AmenityDto::fromEntity)
                .collect(Collectors.toList());
    }

    private Set<Long> getSavedAccommodationIds(Long userId) {
        Page<SavedListing> page = savedListingRepository.findByUserId(userId, PageRequest.of(0, 1000));
        return page.getContent().stream()
                .map(sl -> sl.getAccommodation().getId())
                .collect(Collectors.toSet());
    }
}
