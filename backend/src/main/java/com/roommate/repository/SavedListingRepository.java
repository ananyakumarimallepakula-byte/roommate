package com.roommate.repository;

import com.roommate.entity.SavedListing;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SavedListingRepository extends JpaRepository<SavedListing, Long> {
    Page<SavedListing> findByUserId(Long userId, Pageable pageable);
    Optional<SavedListing> findByUserIdAndAccommodationId(Long userId, Long accommodationId);
    boolean existsByUserIdAndAccommodationId(Long userId, Long accommodationId);
    void deleteByUserIdAndAccommodationId(Long userId, Long accommodationId);
}
