package com.roommate.repository;

import com.roommate.entity.AccommodationImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AccommodationImageRepository extends JpaRepository<AccommodationImage, Long> {
    List<AccommodationImage> findByAccommodationId(Long accommodationId);
    void deleteByAccommodationId(Long accommodationId);
}
