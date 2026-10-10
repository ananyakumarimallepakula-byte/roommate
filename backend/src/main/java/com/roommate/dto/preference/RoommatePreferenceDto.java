package com.roommate.dto.preference;

import com.roommate.entity.RoommatePreference;
import com.roommate.enums.*;
import jakarta.validation.constraints.DecimalMin;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RoommatePreferenceDto {
    private Long id;
    private Long userId;
    private String preferredCity;
    private String preferredLocality;

    @DecimalMin(value = "0.0", message = "Min budget must be positive")
    private BigDecimal minBudget;

    @DecimalMin(value = "0.0", message = "Max budget must be positive")
    private BigDecimal maxBudget;

    private RoomType roomType;
    private LocalDate targetMoveInDate;
    private SleepSchedule sleepSchedule;
    private StudyHabit studyHabit;
    private CleanlinessLevel cleanlinessLevel;
    private SmokingPreference smokingPreference;
    private PetPreference petPreference;
    private FoodPreference foodPreference;
    private String interests;

    public RoommatePreferenceDto() {}

    public static RoommatePreferenceDto fromEntity(RoommatePreference p) {
        if (p == null) return null;
        RoommatePreferenceDto dto = new RoommatePreferenceDto();
        dto.setId(p.getId());
        dto.setUserId(p.getUser().getId());
        dto.setPreferredCity(p.getPreferredCity());
        dto.setPreferredLocality(p.getPreferredLocality());
        dto.setMinBudget(p.getMinBudget());
        dto.setMaxBudget(p.getMaxBudget());
        dto.setRoomType(p.getRoomType());
        dto.setTargetMoveInDate(p.getTargetMoveInDate());
        dto.setSleepSchedule(p.getSleepSchedule());
        dto.setStudyHabit(p.getStudyHabit());
        dto.setCleanlinessLevel(p.getCleanlinessLevel());
        dto.setSmokingPreference(p.getSmokingPreference());
        dto.setPetPreference(p.getPetPreference());
        dto.setFoodPreference(p.getFoodPreference());
        dto.setInterests(p.getInterests());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getPreferredCity() { return preferredCity; }
    public void setPreferredCity(String preferredCity) { this.preferredCity = preferredCity; }

    public String getPreferredLocality() { return preferredLocality; }
    public void setPreferredLocality(String preferredLocality) { this.preferredLocality = preferredLocality; }

    public BigDecimal getMinBudget() { return minBudget; }
    public void setMinBudget(BigDecimal minBudget) { this.minBudget = minBudget; }

    public BigDecimal getMaxBudget() { return maxBudget; }
    public void setMaxBudget(BigDecimal maxBudget) { this.maxBudget = maxBudget; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }

    public LocalDate getTargetMoveInDate() { return targetMoveInDate; }
    public void setTargetMoveInDate(LocalDate targetMoveInDate) { this.targetMoveInDate = targetMoveInDate; }

    public SleepSchedule getSleepSchedule() { return sleepSchedule; }
    public void setSleepSchedule(SleepSchedule sleepSchedule) { this.sleepSchedule = sleepSchedule; }

    public StudyHabit getStudyHabit() { return studyHabit; }
    public void setStudyHabit(StudyHabit studyHabit) { this.studyHabit = studyHabit; }

    public CleanlinessLevel getCleanlinessLevel() { return cleanlinessLevel; }
    public void setCleanlinessLevel(CleanlinessLevel cleanlinessLevel) { this.cleanlinessLevel = cleanlinessLevel; }

    public SmokingPreference getSmokingPreference() { return smokingPreference; }
    public void setSmokingPreference(SmokingPreference smokingPreference) { this.smokingPreference = smokingPreference; }

    public PetPreference getPetPreference() { return petPreference; }
    public void setPetPreference(PetPreference petPreference) { this.petPreference = petPreference; }

    public FoodPreference getFoodPreference() { return foodPreference; }
    public void setFoodPreference(FoodPreference foodPreference) { this.foodPreference = foodPreference; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }
}
