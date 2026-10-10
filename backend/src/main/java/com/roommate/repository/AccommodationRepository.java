package com.roommate.repository;

import com.roommate.entity.Accommodation;
import com.roommate.enums.AvailabilityStatus;
import com.roommate.enums.ModerationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccommodationRepository extends JpaRepository<Accommodation, Long>, JpaSpecificationExecutor<Accommodation> {

    Page<Accommodation> findByOwnerId(Long ownerId, Pageable pageable);

    Page<Accommodation> findByModerationStatus(ModerationStatus status, Pageable pageable);

    @Query("SELECT a FROM Accommodation a WHERE a.moderationStatus = 'APPROVED' AND a.availabilityStatus = 'AVAILABLE'")
    List<Accommodation> findFeaturedAccommodations(Pageable pageable);

    long countByOwnerId(Long ownerId);
    long countByOwnerIdAndModerationStatus(Long ownerId, ModerationStatus moderationStatus);
    long countByOwnerIdAndAvailabilityStatus(Long ownerId, AvailabilityStatus availabilityStatus);

    long countByModerationStatus(ModerationStatus moderationStatus);
    long countByAvailabilityStatus(AvailabilityStatus availabilityStatus);

    @Query("SELECT DISTINCT a.city FROM Accommodation a WHERE a.moderationStatus = 'APPROVED'")
    List<String> findDistinctApprovedCities();
}
