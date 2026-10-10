package com.roommate.dto.matching;

import com.roommate.dto.preference.RoommatePreferenceDto;
import com.roommate.dto.profile.StudentProfileDto;
import com.roommate.dto.user.UserDto;
import com.roommate.enums.RequestStatus;

import java.util.ArrayList;
import java.util.List;

public class RoommateMatchDto {
    private UserDto student;
    private StudentProfileDto profile;
    private RoommatePreferenceDto preferences;
    private int overallScore; // 0 to 100
    private String matchTier; // "EXCELLENT", "GREAT", "GOOD", "MODERATE"
    private List<MatchFactorDetail> factors = new ArrayList<>();
    private RequestStatus connectionStatus; // null if none, or PENDING, ACCEPTED, etc.
    private Long connectionRequestId;

    public RoommateMatchDto() {}

    public UserDto getStudent() { return student; }
    public void setStudent(UserDto student) { this.student = student; }

    public StudentProfileDto getProfile() { return profile; }
    public void setProfile(StudentProfileDto profile) { this.profile = profile; }

    public RoommatePreferenceDto getPreferences() { return preferences; }
    public void setPreferences(RoommatePreferenceDto preferences) { this.preferences = preferences; }

    public int getOverallScore() { return overallScore; }
    public void setOverallScore(int overallScore) { this.overallScore = overallScore; }

    public String getMatchTier() { return matchTier; }
    public void setMatchTier(String matchTier) { this.matchTier = matchTier; }

    public List<MatchFactorDetail> getFactors() { return factors; }
    public void setFactors(List<MatchFactorDetail> factors) { this.factors = factors; }

    public RequestStatus getConnectionStatus() { return connectionStatus; }
    public void setConnectionStatus(RequestStatus connectionStatus) { this.connectionStatus = connectionStatus; }

    public Long getConnectionRequestId() { return connectionRequestId; }
    public void setConnectionRequestId(Long connectionRequestId) { this.connectionRequestId = connectionRequestId; }
}
