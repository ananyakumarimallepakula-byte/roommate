package com.roommate.service;

import com.roommate.dto.matching.MatchFactorDetail;
import com.roommate.dto.matching.RoommateMatchDto;
import com.roommate.dto.preference.RoommatePreferenceDto;
import com.roommate.dto.profile.StudentProfileDto;
import com.roommate.dto.user.UserDto;
import com.roommate.entity.RoommatePreference;
import com.roommate.entity.RoommateRequest;
import com.roommate.entity.StudentProfile;
import com.roommate.entity.User;
import com.roommate.enums.RequestStatus;
import com.roommate.enums.SmokingPreference;
import com.roommate.enums.UserStatus;
import com.roommate.exception.BadRequestException;
import com.roommate.exception.ResourceNotFoundException;
import com.roommate.repository.RoommatePreferenceRepository;
import com.roommate.repository.RoommateRequestRepository;
import com.roommate.repository.StudentProfileRepository;
import com.roommate.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private final RoommatePreferenceRepository preferenceRepository;
    private final StudentProfileRepository profileRepository;
    private final UserRepository userRepository;
    private final RoommateRequestRepository requestRepository;

    public MatchingService(RoommatePreferenceRepository preferenceRepository,
                           StudentProfileRepository profileRepository,
                           UserRepository userRepository,
                           RoommateRequestRepository requestRepository) {
        this.preferenceRepository = preferenceRepository;
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
        this.requestRepository = requestRepository;
    }

    @Transactional(readOnly = true)
    public List<RoommateMatchDto> findMatchesForUser(Long currentUserId) {
        User currentUser = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + currentUserId));

        RoommatePreference myPref = preferenceRepository.findByUserId(currentUserId)
                .orElseThrow(() -> new BadRequestException("Please set your roommate preferences first to view matches"));

        StudentProfile myProfile = profileRepository.findByUserId(currentUserId)
                .orElse(null);

        // Fetch all active other student preferences
        List<RoommatePreference> candidatePrefs = preferenceRepository.findAllActiveStudentPreferences(currentUserId);

        List<RoommateMatchDto> matches = new ArrayList<>();

        for (RoommatePreference candPref : candidatePrefs) {
            User candUser = candPref.getUser();
            if (candUser.getStatus() != UserStatus.ACTIVE) continue;

            StudentProfile candProfile = profileRepository.findByUserId(candUser.getId()).orElse(null);

            RoommateMatchDto match = calculateMatch(myPref, myProfile, candPref, candProfile, candUser, currentUserId);
            matches.add(match);
        }

        // Rank by overall score descending
        matches.sort((a, b) -> Integer.compare(b.getOverallScore(), a.getOverallScore()));
        return matches;
    }

    public RoommateMatchDto calculateMatch(RoommatePreference myPref,
                                           StudentProfile myProfile,
                                           RoommatePreference candPref,
                                           StudentProfile candProfile,
                                           User candUser,
                                           Long currentUserId) {
        List<MatchFactorDetail> factors = new ArrayList<>();

        // 1. Budget Compatibility (25%)
        MatchFactorDetail budgetFactor = calculateBudgetFactor(myPref, candPref);
        factors.add(budgetFactor);

        // 2. Location Compatibility (20%)
        MatchFactorDetail locationFactor = calculateLocationFactor(myPref, candPref);
        factors.add(locationFactor);

        // 3. Lifestyle Compatibility (20%)
        MatchFactorDetail lifestyleFactor = calculateLifestyleFactor(myPref, candPref);
        factors.add(lifestyleFactor);

        // 4. Study & Sleep Habits (20%)
        MatchFactorDetail habitsFactor = calculateHabitsFactor(myPref, candPref);
        factors.add(habitsFactor);

        // 5. Room Type & Move-in Timing (10%)
        MatchFactorDetail roomMoveInFactor = calculateRoomAndMoveInFactor(myPref, candPref);
        factors.add(roomMoveInFactor);

        // 6. Shared Interests (5%)
        MatchFactorDetail interestsFactor = calculateInterestsFactor(myPref, candPref);
        factors.add(interestsFactor);

        // Weighted total sum
        double totalWeightedScore = 0.0;
        for (MatchFactorDetail f : factors) {
            totalWeightedScore += (f.getScore() * (f.getWeightPercentage() / 100.0));
        }

        int normalizedScore = (int) Math.round(Math.max(0, Math.min(100, totalWeightedScore)));

        String tier;
        if (normalizedScore >= 85) tier = "EXCELLENT";
        else if (normalizedScore >= 70) tier = "GREAT";
        else if (normalizedScore >= 55) tier = "GOOD";
        else tier = "MODERATE";

        RoommateMatchDto dto = new RoommateMatchDto();
        dto.setStudent(UserDto.fromEntity(candUser));
        dto.setProfile(StudentProfileDto.fromEntity(candProfile));
        dto.setPreferences(RoommatePreferenceDto.fromEntity(candPref));
        dto.setOverallScore(normalizedScore);
        dto.setMatchTier(tier);
        dto.setFactors(factors);

        // Check if there is an active connection request between current user and candidate
        if (currentUserId != null) {
            Optional<RoommateRequest> reqOpt = requestRepository.findLatestBetweenUsers(currentUserId, candUser.getId());
            if (reqOpt.isPresent()) {
                dto.setConnectionStatus(reqOpt.get().getStatus());
                dto.setConnectionRequestId(reqOpt.get().getId());
            }
        }

        return dto;
    }

    private MatchFactorDetail calculateBudgetFactor(RoommatePreference my, RoommatePreference cand) {
        double weight = 25.0;
        if (my.getMinBudget() == null || my.getMaxBudget() == null ||
            cand.getMinBudget() == null || cand.getMaxBudget() == null) {
            return new MatchFactorDetail("Budget Compatibility", weight, 50.0, "Budget preferences partially specified", false);
        }

        double myMin = my.getMinBudget().doubleValue();
        double myMax = my.getMaxBudget().doubleValue();
        double candMin = cand.getMinBudget().doubleValue();
        double candMax = cand.getMaxBudget().doubleValue();

        double overlapStart = Math.max(myMin, candMin);
        double overlapEnd = Math.min(myMax, candMax);

        if (overlapStart <= overlapEnd) {
            double overlapLen = overlapEnd - overlapStart;
            double myLen = Math.max(1.0, myMax - myMin);
            double candLen = Math.max(1.0, candMax - candMin);
            double ratio = overlapLen / Math.max(myLen, candLen);
            double score = 75.0 + (ratio * 25.0); // 75 - 100
            return new MatchFactorDetail("Budget Compatibility", weight, Math.min(100.0, score),
                    String.format("Overlapping budget window: ₹%.0f - ₹%.0f", overlapStart, overlapEnd), true);
        } else {
            double gap = overlapStart - overlapEnd;
            double score = Math.max(0.0, 60.0 - (gap / 100.0));
            return new MatchFactorDetail("Budget Compatibility", weight, score,
                    String.format("Budgets differ (₹%.0f-₹%.0f vs ₹%.0f-₹%.0f)", myMin, myMax, candMin, candMax), false);
        }
    }

    private MatchFactorDetail calculateLocationFactor(RoommatePreference my, RoommatePreference cand) {
        double weight = 20.0;
        if (my.getPreferredCity() == null || cand.getPreferredCity() == null) {
            return new MatchFactorDetail("Location Compatibility", weight, 40.0, "City preference not specified", false);
        }

        boolean sameCity = my.getPreferredCity().trim().equalsIgnoreCase(cand.getPreferredCity().trim());
        if (!sameCity) {
            return new MatchFactorDetail("Location Compatibility", weight, 10.0,
                    String.format("Different cities (%s vs %s)", my.getPreferredCity(), cand.getPreferredCity()), false);
        }

        if (my.getPreferredLocality() != null && cand.getPreferredLocality() != null) {
            String myLoc = my.getPreferredLocality().trim().toLowerCase();
            String candLoc = cand.getPreferredLocality().trim().toLowerCase();
            if (myLoc.equals(candLoc) || myLoc.contains(candLoc) || candLoc.contains(myLoc)) {
                return new MatchFactorDetail("Location Compatibility", weight, 100.0,
                        String.format("Exact match in %s, %s", my.getPreferredLocality(), my.getPreferredCity()), true);
            }
        }

        return new MatchFactorDetail("Location Compatibility", weight, 75.0,
                String.format("Same city (%s), different localities", my.getPreferredCity()), true);
    }

    private MatchFactorDetail calculateLifestyleFactor(RoommatePreference my, RoommatePreference cand) {
        double weight = 20.0;
        double subScore = 0.0;
        List<String> notes = new ArrayList<>();

        // Cleanliness
        if (my.getCleanlinessLevel() == cand.getCleanlinessLevel()) {
            subScore += 25.0;
            notes.add("Cleanliness matches (" + my.getCleanlinessLevel() + ")");
        } else {
            subScore += 12.0;
        }

        // Smoking
        if (my.getSmokingPreference() == cand.getSmokingPreference() ||
            my.getSmokingPreference() == SmokingPreference.NO_PREFERENCE ||
            cand.getSmokingPreference() == SmokingPreference.NO_PREFERENCE) {
            subScore += 25.0;
            notes.add("Smoking preference compatible");
        } else if (my.getSmokingPreference() == SmokingPreference.NON_SMOKER && cand.getSmokingPreference() == SmokingPreference.SMOKER) {
            subScore += 0.0;
            notes.add("Smoking clash");
        } else {
            subScore += 15.0;
        }

        // Pet
        if (my.getPetPreference() == cand.getPetPreference() ||
            my.getPetPreference() == com.roommate.enums.PetPreference.NO_PREFERENCE ||
            cand.getPetPreference() == com.roommate.enums.PetPreference.NO_PREFERENCE) {
            subScore += 25.0;
            notes.add("Pet preference compatible");
        } else {
            subScore += 10.0;
        }

        // Food
        if (my.getFoodPreference() == cand.getFoodPreference() ||
            my.getFoodPreference() == com.roommate.enums.FoodPreference.ANY ||
            cand.getFoodPreference() == com.roommate.enums.FoodPreference.ANY) {
            subScore += 25.0;
            notes.add("Diet compatible");
        } else {
            subScore += 15.0;
        }

        boolean matched = subScore >= 70.0;
        String desc = String.join(", ", notes);
        return new MatchFactorDetail("Lifestyle Compatibility", weight, subScore, desc, matched);
    }

    private MatchFactorDetail calculateHabitsFactor(RoommatePreference my, RoommatePreference cand) {
        double weight = 20.0;
        double subScore = 0.0;
        List<String> notes = new ArrayList<>();

        // Sleep schedule (50%)
        if (my.getSleepSchedule() == cand.getSleepSchedule()) {
            subScore += 50.0;
            notes.add("Sleep schedule matches (" + my.getSleepSchedule() + ")");
        } else if (my.getSleepSchedule() == com.roommate.enums.SleepSchedule.FLEXIBLE ||
                   cand.getSleepSchedule() == com.roommate.enums.SleepSchedule.FLEXIBLE) {
            subScore += 40.0;
            notes.add("Flexible sleep habits");
        } else {
            subScore += 15.0;
            notes.add("Opposite sleep hours");
        }

        // Study habit (50%)
        if (my.getStudyHabit() == cand.getStudyHabit()) {
            subScore += 50.0;
            notes.add("Study habit matches (" + my.getStudyHabit() + ")");
        } else {
            subScore += 30.0;
        }

        boolean matched = subScore >= 70.0;
        return new MatchFactorDetail("Study & Sleep Habits", weight, subScore, String.join(", ", notes), matched);
    }

    private MatchFactorDetail calculateRoomAndMoveInFactor(RoommatePreference my, RoommatePreference cand) {
        double weight = 10.0;
        double subScore = 0.0;
        List<String> notes = new ArrayList<>();

        // Room type (50%)
        if (my.getRoomType() == cand.getRoomType() ||
            my.getRoomType() == com.roommate.enums.RoomType.ANY ||
            cand.getRoomType() == com.roommate.enums.RoomType.ANY) {
            subScore += 50.0;
            notes.add("Room type aligned");
        } else {
            subScore += 20.0;
        }

        // Move-in date (50%)
        if (my.getTargetMoveInDate() != null && cand.getTargetMoveInDate() != null) {
            long daysDiff = Math.abs(ChronoUnit.DAYS.between(my.getTargetMoveInDate(), cand.getTargetMoveInDate()));
            if (daysDiff <= 15) {
                subScore += 50.0;
                notes.add("Move-in timing within 15 days");
            } else if (daysDiff <= 35) {
                subScore += 35.0;
                notes.add("Move-in within a month");
            } else {
                subScore += 15.0;
            }
        } else {
            subScore += 30.0;
        }

        boolean matched = subScore >= 65.0;
        return new MatchFactorDetail("Room Type & Move-in Timing", weight, subScore, String.join(", ", notes), matched);
    }

    private MatchFactorDetail calculateInterestsFactor(RoommatePreference my, RoommatePreference cand) {
        double weight = 5.0;
        if (my.getInterests() == null || cand.getInterests() == null ||
            my.getInterests().isBlank() || cand.getInterests().isBlank()) {
            return new MatchFactorDetail("Shared Interests", weight, 40.0, "Interests not yet listed", false);
        }

        Set<String> mySet = Arrays.stream(my.getInterests().split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        Set<String> candSet = Arrays.stream(cand.getInterests().split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());

        Set<String> intersection = new HashSet<>(mySet);
        intersection.retainAll(candSet);

        double score;
        if (intersection.size() >= 3) score = 100.0;
        else if (intersection.size() == 2) score = 80.0;
        else if (intersection.size() == 1) score = 55.0;
        else score = 25.0;

        String desc = intersection.isEmpty() ? "No common hobbies" : "Shared hobbies: " + String.join(", ", intersection);
        return new MatchFactorDetail("Shared Interests", weight, score, desc, !intersection.isEmpty());
    }
}
