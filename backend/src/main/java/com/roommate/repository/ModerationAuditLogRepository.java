package com.roommate.repository;

import com.roommate.entity.ModerationAuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ModerationAuditLogRepository extends JpaRepository<ModerationAuditLog, Long> {
    Page<ModerationAuditLog> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
