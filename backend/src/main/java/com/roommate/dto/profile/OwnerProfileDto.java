package com.roommate.dto.profile;

import com.roommate.dto.user.UserDto;
import com.roommate.entity.OwnerProfile;

import java.time.LocalDateTime;

public class OwnerProfileDto {
    private Long id;
    private UserDto user;
    private String companyName;
    private String address;
    private Boolean isVerified;
    private LocalDateTime updatedAt;

    public OwnerProfileDto() {}

    public static OwnerProfileDto fromEntity(OwnerProfile p) {
        if (p == null) return null;
        OwnerProfileDto dto = new OwnerProfileDto();
        dto.setId(p.getId());
        dto.setUser(UserDto.fromEntity(p.getUser()));
        dto.setCompanyName(p.getCompanyName());
        dto.setAddress(p.getAddress());
        dto.setIsVerified(p.getIsVerified());
        dto.setUpdatedAt(p.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public Boolean getIsVerified() { return isVerified; }
    public void setIsVerified(Boolean isVerified) { this.isVerified = isVerified; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
