package com.roommate.repository;

import com.roommate.entity.RoommatePreference;
import com.roommate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoommatePreferenceRepository extends JpaRepository<RoommatePreference, Long> {
    Optional<RoommatePreference> findByUser(User user);
    Optional<RoommatePreference> findByUserId(Long userId);

    @Query("SELECT rp FROM RoommatePreference rp " +
           "JOIN rp.user u " +
           "WHERE u.status = 'ACTIVE' " +
           "AND u.role = 'STUDENT' " +
           "AND u.id <> :excludeUserId")
    List<RoommatePreference> findAllActiveStudentPreferences(Long excludeUserId);
}
