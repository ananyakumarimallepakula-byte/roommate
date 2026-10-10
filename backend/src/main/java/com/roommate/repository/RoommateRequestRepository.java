package com.roommate.repository;

import com.roommate.entity.RoommateRequest;
import com.roommate.enums.RequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoommateRequestRepository extends JpaRepository<RoommateRequest, Long> {
    Page<RoommateRequest> findBySenderId(Long senderId, Pageable pageable);
    Page<RoommateRequest> findByReceiverId(Long receiverId, Pageable pageable);

    @Query("SELECT rr FROM RoommateRequest rr WHERE " +
           "((rr.sender.id = :u1 AND rr.receiver.id = :u2) OR (rr.sender.id = :u2 AND rr.receiver.id = :u1)) " +
           "AND rr.status = :status")
    Optional<RoommateRequest> findPendingBetweenUsers(@Param("u1") Long u1, @Param("u2") Long u2, @Param("status") RequestStatus status);

    @Query("SELECT rr FROM RoommateRequest rr WHERE " +
           "((rr.sender.id = :u1 AND rr.receiver.id = :u2) OR (rr.sender.id = :u2 AND rr.receiver.id = :u1)) " +
           "ORDER BY rr.createdAt DESC")
    Optional<RoommateRequest> findLatestBetweenUsers(@Param("u1") Long u1, @Param("u2") Long u2);
}
