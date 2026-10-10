package com.roommate.dto.accommodation;

import com.roommate.entity.AccommodationImage;

public class AccommodationImageDto {
    private Long id;
    private String imageUrl;
    private Boolean isPrimary;

    public AccommodationImageDto() {}

    public static AccommodationImageDto fromEntity(AccommodationImage img) {
        if (img == null) return null;
        AccommodationImageDto dto = new AccommodationImageDto();
        dto.setId(img.getId());
        dto.setImageUrl(img.getImageUrl());
        dto.setIsPrimary(img.getIsPrimary());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsPrimary() { return isPrimary; }
    public void setIsPrimary(Boolean isPrimary) { this.isPrimary = isPrimary; }
}
