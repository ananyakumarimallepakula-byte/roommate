package com.roommate.dto.accommodation;

import com.roommate.entity.Amenity;

public class AmenityDto {
    private Long id;
    private String name;
    private String iconName;

    public AmenityDto() {}

    public static AmenityDto fromEntity(Amenity a) {
        if (a == null) return null;
        AmenityDto dto = new AmenityDto();
        dto.setId(a.getId());
        dto.setName(a.getName());
        dto.setIconName(a.getIconName());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }
}
