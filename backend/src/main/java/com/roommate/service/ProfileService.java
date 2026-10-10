package com.roommate.service;

import com.roommate.dto.preference.RoommatePreferenceDto;
import com.roommate.dto.profile.OwnerProfileDto;
import com.roommate.dto.profile.StudentProfileDto;
import com.roommate.entity.OwnerProfile;
import com.roommate.entity.RoommatePreference;
import com.roommate.entity.StudentProfile;
import com.roommate.entity.User;
import com.roommate.exception.ResourceNotFoundException;
import com.roommate.repository.OwnerProfileRepository;
import com.roommate.repository.RoommatePreferenceRepository;
import com.roommate.repository.StudentProfileRepository;
import com.roommate.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    private final StudentProfileRepository studentProfileRepository;
    private final OwnerProfileRepository ownerProfileRepository;
    private final RoommatePreferenceRepository roommatePreferenceRepository;
    private final UserRepository userRepository;

    public ProfileService(StudentProfileRepository studentProfileRepository,
                          OwnerProfileRepository ownerProfileRepository,
                          RoommatePreferenceRepository roommatePreferenceRepository,
                          UserRepository userRepository) {
        this.studentProfileRepository = studentProfileRepository;
        this.ownerProfileRepository = ownerProfileRepository;
        this.roommatePreferenceRepository = roommatePreferenceRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public StudentProfileDto getStudentProfile(Long userId) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    return studentProfileRepository.save(new StudentProfile(user));
                });
        return StudentProfileDto.fromEntity(profile);
    }

    @Transactional
    public StudentProfileDto updateStudentProfile(Long userId, StudentProfileDto dto) {
        StudentProfile profile = studentProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    return new StudentProfile(user);
                });

        profile.setAge(dto.getAge());
        profile.setGender(dto.getGender());
        profile.setCollege(dto.getCollege());
        profile.setCourse(dto.getCourse());
        profile.setStudyYear(dto.getStudyYear());
        profile.setBio(dto.getBio());

        StudentProfile updated = studentProfileRepository.save(profile);
        return StudentProfileDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public OwnerProfileDto getOwnerProfile(Long userId) {
        OwnerProfile profile = ownerProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    return ownerProfileRepository.save(new OwnerProfile(user));
                });
        return OwnerProfileDto.fromEntity(profile);
    }

    @Transactional
    public OwnerProfileDto updateOwnerProfile(Long userId, OwnerProfileDto dto) {
        OwnerProfile profile = ownerProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    return new OwnerProfile(user);
                });

        profile.setCompanyName(dto.getCompanyName());
        profile.setAddress(dto.getAddress());

        OwnerProfile updated = ownerProfileRepository.save(profile);
        return OwnerProfileDto.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public RoommatePreferenceDto getPreferences(Long userId) {
        RoommatePreference preference = roommatePreferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    return roommatePreferenceRepository.save(new RoommatePreference(user));
                });
        return RoommatePreferenceDto.fromEntity(preference);
    }

    @Transactional
    public RoommatePreferenceDto updatePreferences(Long userId, RoommatePreferenceDto dto) {
        RoommatePreference pref = roommatePreferenceRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
                    return new RoommatePreference(user);
                });

        pref.setPreferredCity(dto.getPreferredCity());
        pref.setPreferredLocality(dto.getPreferredLocality());
        pref.setMinBudget(dto.getMinBudget());
        pref.setMaxBudget(dto.getMaxBudget());
        if (dto.getRoomType() != null) pref.setRoomType(dto.getRoomType());
        pref.setTargetMoveInDate(dto.getTargetMoveInDate());
        if (dto.getSleepSchedule() != null) pref.setSleepSchedule(dto.getSleepSchedule());
        if (dto.getStudyHabit() != null) pref.setStudyHabit(dto.getStudyHabit());
        if (dto.getCleanlinessLevel() != null) pref.setCleanlinessLevel(dto.getCleanlinessLevel());
        if (dto.getSmokingPreference() != null) pref.setSmokingPreference(dto.getSmokingPreference());
        if (dto.getPetPreference() != null) pref.setPetPreference(dto.getPetPreference());
        if (dto.getFoodPreference() != null) pref.setFoodPreference(dto.getFoodPreference());
        pref.setInterests(dto.getInterests());

        RoommatePreference updated = roommatePreferenceRepository.save(pref);
        return RoommatePreferenceDto.fromEntity(updated);
    }
}
