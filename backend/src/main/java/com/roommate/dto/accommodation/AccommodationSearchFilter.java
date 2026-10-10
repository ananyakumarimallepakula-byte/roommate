package com.roommate.dto.accommodation;

import com.roommate.enums.FurnishingStatus;
import com.roommate.enums.GenderPreference;
import com.roommate.enums.RoomType;

import java.math.BigDecimal;
import java.util.List;

public class AccommodationSearchFilter {
    private String query;
    private String city;
    private String locality;
    private BigDecimal minRent;
    private BigDecimal maxRent;
    private RoomType roomType;
    private FurnishingStatus furnishingStatus;
    private GenderPreference genderPreference;
    private List<Long> amenityIds;
    private String sortBy = "newest"; // "newest", "price_asc", "price_desc"
    private int page = 0;
    private int size = 12;

    public AccommodationSearchFilter() {}

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getLocality() { return locality; }
    public void setLocality(String locality) { this.locality = locality; }

    public BigDecimal getMinRent() { return minRent; }
    public void setMinRent(BigDecimal minRent) { this.minRent = minRent; }

    public BigDecimal getMaxRent() { return maxRent; }
    public void setMaxRent(BigDecimal maxRent) { this.maxRent = maxRent; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }

    public FurnishingStatus getFurnishingStatus() { return furnishingStatus; }
    public void setFurnishingStatus(FurnishingStatus furnishingStatus) { this.furnishingStatus = furnishingStatus; }

    public GenderPreference getGenderPreference() { return genderPreference; }
    public void setGenderPreference(GenderPreference genderPreference) { this.genderPreference = genderPreference; }

    public List<Long> getAmenityIds() { return amenityIds; }
    public void setAmenityIds(List<Long> amenityIds) { this.amenityIds = amenityIds; }

    public String getSortBy() { return sortBy; }
    public void setSortBy(String sortBy) { this.sortBy = sortBy; }

    public int getPage() { return page; }
    public void setPage(int page) { this.page = page; }

    public int getSize() { return size; }
    public void setSize(int size) { this.size = size; }
}
