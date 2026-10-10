package com.roommate.repository;

import com.roommate.entity.OwnerProfile;
import com.roommate.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OwnerProfileRepository extends JpaRepository<OwnerProfile, Long> {
    Optional<OwnerProfile> findByUser(User user);
    Optional<OwnerProfile> findByUserId(Long userId);
}
