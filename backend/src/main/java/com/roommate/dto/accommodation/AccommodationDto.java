package com.roommate.dto.accommodation;

import com.roommate.dto.user.UserDto;
import com.roommate.entity.Accommodation;
import com.roommate.enums.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class AccommodationDto {
    private Long id;
    private UserDto owner;
    private String title;
    private String description;
    private String city;
    private String locality;
    private String address;
    private BigDecimal rent;
    private BigDecimal securityDeposit;
    private RoomType roomType;
    private FurnishingStatus furnishingStatus;
    private GenderPreference genderPreference;
    private LocalDate availableFrom;
    private AvailabilityStatus availabilityStatus;
    private ModerationStatus moderationStatus;
    private String rejectionReason;
    private String houseRules;
    private List<AccommodationImageDto> images = new ArrayList<>();
    private List<AmenityDto> amenities = new ArrayList<>();
    private boolean isSaved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AccommodationDto() {}

    public static AccommodationDto fromEntity(Accommodation a) {
        return fromEntity(a, false);
    }

    public static AccommodationDto fromEntity(Accommodation a, boolean isSaved) {
        if (a == null) return null;
        AccommodationDto dto = new AccommodationDto();
        dto.setId(a.getId());
        dto.setOwner(UserDto.fromEntity(a.getOwner()));
        dto.setTitle(a.getTitle());
        dto.setDescription(a.getDescription());
        dto.setCity(a.getCity());
        dto.setLocality(a.getLocality());
        dto.setAddress(a.getAddress());
        dto.setRent(a.getRent());
        dto.setSecurityDeposit(a.getSecurityDeposit());
        dto.setRoomType(a.getRoomType());
        dto.setFurnishingStatus(a.getFurnishingStatus());
        dto.setGenderPreference(a.getGenderPreference());
        dto.setAvailableFrom(a.getAvailableFrom());
        dto.setAvailabilityStatus(a.getAvailabilityStatus());
        dto.setModerationStatus(a.getModerationStatus());
        dto.setRejectionReason(a.getRejectionReason());
        dto.setHouseRules(a.getHouseRules());
        dto.setSaved(isSaved);
        dto.setCreatedAt(a.getCreatedAt());
        dto.setUpdatedAt(a.getUpdatedAt());

        if (a.getImages() != null) {
            dto.setImages(a.getImages().stream().map(AccommodationImageDto::fromEntity).collect(Collectors.toList()));
        }
        if (a.getAmenities() != null) {
            dto.setAmenities(a.getAmenities().stream().map(AmenityDto::fromEntity).collect(Collectors.toList()));
        }
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getOwner() { return owner; }
    public void setOwner(UserDto owner) { this.owner = owner; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public BigDecimal getRent() { return rent; }
    public void setRent(BigDecimal rent) { this.rent = rent; }

    public BigDecimal getSecurityDeposit() { return securityDeposit; }
    public void setSecurityDeposit(BigDecimal securityDeposit) { this.securityDeposit = securityDeposit; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }

    public FurnishingStatus getFurnishingStatus() { return furnishingStatus; }
    public void setFurnishingStatus(FurnishingStatus furnishingStatus) { this.furnishingStatus = furnishingStatus; }

    public GenderPreference getGenderPreference() { return genderPreference; }
    public void setGenderPreference(GenderPreference genderPreference) { this.genderPreference = genderPreference; }

    public LocalDate getAvailableFrom() { return availableFrom; }
    public void setAvailableFrom(LocalDate availableFrom) { this.availableFrom = availableFrom; }

    public AvailabilityStatus getAvailabilityStatus() { return availabilityStatus; }
    public void setAvailabilityStatus(AvailabilityStatus availabilityStatus) { this.availabilityStatus = availabilityStatus; }

    public ModerationStatus getModerationStatus() { return moderationStatus; }
    public void setModerationStatus(ModerationStatus moderationStatus) { this.moderationStatus = moderationStatus; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getHouseRules() { return houseRules; }
    public void setHouseRules(String houseRules) { this.houseRules = houseRules; }

    public List<AccommodationImageDto> getImages() { return images; }
    public void setImages(List<AccommodationImageDto> images) { this.images = images; }

    public List<AmenityDto> getAmenities() { return amenities; }
    public void setAmenities(List<AmenityDto> amenities) { this.amenities = amenities; }

    public boolean isSaved() { return isSaved; }
    public void setSaved(boolean saved) { isSaved = saved; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
