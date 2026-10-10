package com.roommate.dto.profile;

import com.roommate.dto.user.UserDto;
import com.roommate.entity.StudentProfile;
import com.roommate.enums.Gender;

import java.time.LocalDateTime;

public class StudentProfileDto {
    private Long id;
    private UserDto user;
    private Integer age;
    private Gender gender;
    private String college;
    private String course;
    private String studyYear;
    private String bio;
    private Boolean isCompleted;
    private LocalDateTime updatedAt;

    public StudentProfileDto() {}

    public static StudentProfileDto fromEntity(StudentProfile p) {
        if (p == null) return null;
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(p.getId());
        dto.setUser(UserDto.fromEntity(p.getUser()));
        dto.setAge(p.getAge());
        dto.setGender(p.getGender());
        dto.setCollege(p.getCollege());
        dto.setCourse(p.getCourse());
        dto.setStudyYear(p.getStudyYear());
        dto.setBio(p.getBio());
        dto.setIsCompleted(p.getIsCompleted());
        dto.setUpdatedAt(p.getUpdatedAt());
        return dto;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public UserDto getUser() { return user; }
    public void setUser(UserDto user) { this.user = user; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }

    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public String getStudyYear() { return studyYear; }
    public void setStudyYear(String studyYear) { this.studyYear = studyYear; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public Boolean getIsCompleted() { return isCompleted; }
    public void setIsCompleted(Boolean isCompleted) { this.isCompleted = isCompleted; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
