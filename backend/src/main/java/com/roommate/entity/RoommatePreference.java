package com.roommate.entity;

import com.roommate.enums.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "roommate_preferences")
public class RoommatePreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "preferred_city", length = 100)
    private String preferredCity;

    @Column(name = "preferred_locality", length = 100)
    private String preferredLocality;

    @Column(name = "min_budget", precision = 10, scale = 2)
    private BigDecimal minBudget;

    @Column(name = "max_budget", precision = 10, scale = 2)
    private BigDecimal maxBudget;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", length = 50)
    private RoomType roomType = RoomType.ANY;

    @Column(name = "target_move_in_date")
    private LocalDate targetMoveInDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "sleep_schedule", length = 50)
    private SleepSchedule sleepSchedule = SleepSchedule.FLEXIBLE;

    @Enumerated(EnumType.STRING)
    @Column(name = "study_habit", length = 50)
    private StudyHabit studyHabit = StudyHabit.MODERATE;

    @Enumerated(EnumType.STRING)
    @Column(name = "cleanliness_level", length = 50)
    private CleanlinessLevel cleanlinessLevel = CleanlinessLevel.MODERATE;

    @Enumerated(EnumType.STRING)
    @Column(name = "smoking_preference", length = 50)
    private SmokingPreference smokingPreference = SmokingPreference.NON_SMOKER;

    @Enumerated(EnumType.STRING)
    @Column(name = "pet_preference", length = 50)
    private PetPreference petPreference = PetPreference.NO_PREFERENCE;

    @Enumerated(EnumType.STRING)
    @Column(name = "food_preference", length = 50)
    private FoodPreference foodPreference = FoodPreference.ANY;

    @Column(columnDefinition = "TEXT")
    private String interests;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public RoommatePreference() {}

    public RoommatePreference(User user) {
        this.user = user;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
