package com.roommate.repository;

import com.roommate.entity.Report;
import com.roommate.enums.ReportStatus;
import com.roommate.enums.ReportTargetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    Page<Report> findByStatus(ReportStatus status, Pageable pageable);
    Page<Report> findByTargetType(ReportTargetType targetType, Pageable pageable);
    long countByStatus(ReportStatus status);
}
