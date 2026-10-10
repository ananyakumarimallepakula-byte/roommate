package com.roommate.repository;

import com.roommate.entity.PropertyEnquiry;
import com.roommate.enums.EnquiryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PropertyEnquiryRepository extends JpaRepository<PropertyEnquiry, Long> {
    Page<PropertyEnquiry> findByStudentId(Long studentId, Pageable pageable);

    @Query("SELECT pe FROM PropertyEnquiry pe WHERE pe.accommodation.owner.id = :ownerId")
    Page<PropertyEnquiry> findByOwnerId(@Param("ownerId") Long ownerId, Pageable pageable);

    @Query("SELECT pe FROM PropertyEnquiry pe WHERE pe.accommodation.owner.id = :ownerId AND pe.status = :status")
    Page<PropertyEnquiry> findByOwnerIdAndStatus(@Param("ownerId") Long ownerId, @Param("status") EnquiryStatus status, Pageable pageable);

    long countByAccommodationOwnerId(Long ownerId);
    long countByAccommodationOwnerIdAndStatus(Long ownerId, EnquiryStatus status);

    Optional<PropertyEnquiry> findByAccommodationIdAndStudentId(Long accommodationId, Long studentId);
}
