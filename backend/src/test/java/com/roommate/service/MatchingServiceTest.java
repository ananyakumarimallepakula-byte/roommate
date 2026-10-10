package com.roommate.service;

import com.roommate.dto.matching.MatchFactorDetail;
import com.roommate.dto.matching.RoommateMatchDto;
import com.roommate.entity.RoommatePreference;
import com.roommate.entity.StudentProfile;
import com.roommate.entity.User;
import com.roommate.enums.*;
import com.roommate.repository.RoommatePreferenceRepository;
import com.roommate.repository.RoommateRequestRepository;
import com.roommate.repository.StudentProfileRepository;
import com.roommate.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @Mock
    private RoommatePreferenceRepository preferenceRepository;

    @Mock
    private StudentProfileRepository profileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoommateRequestRepository requestRepository;

    @InjectMocks
    private MatchingService matchingService;

    private User user1;
    private User user2;
    private RoommatePreference pref1;
    private RoommatePreference pref2;

    @BeforeEach
    void setUp() {
        user1 = new User(1L, "student1@example.com", "hash", "Student One", "9876543210", Role.STUDENT, UserStatus.ACTIVE, null);
        user2 = new User(2L, "student2@example.com", "hash", "Student Two", "9876543211", Role.STUDENT, UserStatus.ACTIVE, null);

        pref1 = new RoommatePreference(user1);
        pref1.setPreferredCity("New Delhi");
        pref1.setPreferredLocality("Hauz Khas");
        pref1.setMinBudget(new BigDecimal("10000"));
        pref1.setMaxBudget(new BigDecimal("15000"));
        pref1.setRoomType(RoomType.PRIVATE);
        pref1.setSleepSchedule(SleepSchedule.NIGHT_OWL);
        pref1.setStudyHabit(StudyHabit.SILENT_STUDY);
        pref1.setCleanlinessLevel(CleanlinessLevel.VERY_CLEAN);
        pref1.setSmokingPreference(SmokingPreference.NON_SMOKER);
        pref1.setPetPreference(PetPreference.PET_FRIENDLY);
        pref1.setFoodPreference(FoodPreference.VEGETARIAN);
        pref1.setInterests("Coding,Gaming,Gym");
        pref1.setTargetMoveInDate(LocalDate.now().plusDays(15));

        pref2 = new RoommatePreference(user2);
        pref2.setPreferredCity("New Delhi");
        pref2.setPreferredLocality("Hauz Khas");
        pref2.setMinBudget(new BigDecimal("11000"));
        pref2.setMaxBudget(new BigDecimal("16000"));
        pref2.setRoomType(RoomType.PRIVATE);
        pref2.setSleepSchedule(SleepSchedule.NIGHT_OWL);
        pref2.setStudyHabit(StudyHabit.SILENT_STUDY);
        pref2.setCleanlinessLevel(CleanlinessLevel.VERY_CLEAN);
        pref2.setSmokingPreference(SmokingPreference.NON_SMOKER);
        pref2.setPetPreference(PetPreference.PET_FRIENDLY);
        pref2.setFoodPreference(FoodPreference.VEGETARIAN);
        pref2.setInterests("Coding,Gaming,Music");
        pref2.setTargetMoveInDate(LocalDate.now().plusDays(20));
    }

    @Test
    @DisplayName("High compatibility students should receive an EXCELLENT score")
    void testHighCompatibilityCalculation() {
        StudentProfile profile1 = new StudentProfile(user1);
        StudentProfile profile2 = new StudentProfile(user2);

        RoommateMatchDto match = matchingService.calculateMatch(pref1, profile1, pref2, profile2, user2, 1L);

        assertNotNull(match);
        assertTrue(match.getOverallScore() >= 80, "Expected score >= 80 but got: " + match.getOverallScore());
        assertEquals("EXCELLENT", match.getMatchTier());
        assertEquals(6, match.getFactors().size(), "Must evaluate all 6 weighted dimensions");

        // Verify budget factor
        MatchFactorDetail budgetFactor = match.getFactors().stream()
                .filter(f -> f.getFactorName().contains("Budget"))
                .findFirst().orElseThrow();
        assertEquals(25.0, budgetFactor.getWeightPercentage());
        assertTrue(budgetFactor.isMatched());

        // Verify location factor
        MatchFactorDetail locationFactor = match.getFactors().stream()
                .filter(f -> f.getFactorName().contains("Location"))
                .findFirst().orElseThrow();
        assertEquals(20.0, locationFactor.getWeightPercentage());
        assertTrue(locationFactor.isMatched());
    }

    @Test
    @DisplayName("Conflicting lifestyle and budget should result in low compatibility score")
    void testLowCompatibilityCalculation() {
        pref2.setPreferredCity("Mumbai");
        pref2.setPreferredLocality("Andheri");
        pref2.setMinBudget(new BigDecimal("25000"));
        pref2.setMaxBudget(new BigDecimal("35000"));
        pref2.setSleepSchedule(SleepSchedule.EARLY_BIRD);
        pref2.setSmokingPreference(SmokingPreference.SMOKER);
        pref2.setFoodPreference(FoodPreference.NON_VEGETARIAN);

        RoommateMatchDto match = matchingService.calculateMatch(pref1, null, pref2, null, user2, 1L);

        assertNotNull(match);
        assertTrue(match.getOverallScore() < 55, "Expected score < 55 for conflicting preferences but got: " + match.getOverallScore());
        assertEquals("MODERATE", match.getMatchTier());
    }
}
