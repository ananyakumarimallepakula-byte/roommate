package com.roommate.service;

import com.roommate.dto.common.PagedResponse;
import com.roommate.dto.report.CreateReportRequest;
import com.roommate.dto.report.ReportDto;
import com.roommate.dto.report.ResolveReportRequest;
import com.roommate.entity.Report;
import com.roommate.entity.User;
import com.roommate.enums.ReportStatus;
import com.roommate.exception.ResourceNotFoundException;
import com.roommate.repository.ReportRepository;
import com.roommate.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    public ReportService(ReportRepository reportRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ReportDto createReport(Long reporterId, CreateReportRequest request) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new ResourceNotFoundException("Reporter not found: " + reporterId));

        Report report = new Report(
                reporter,
                request.getTargetType(),
                request.getTargetId(),
                request.getReason().trim(),
                request.getDescription() != null ? request.getDescription().trim() : null
        );

        Report saved = reportRepository.save(report);
        return ReportDto.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public PagedResponse<ReportDto> getReports(ReportStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Report> reports;
        if (status != null) {
            reports = reportRepository.findByStatus(status, pageable);
        } else {
            reports = reportRepository.findAll(pageable);
        }
        return PagedResponse.of(reports.map(ReportDto::fromEntity));
    }

    @Transactional
    public ReportDto resolveReport(Long reportId, Long adminId, ResolveReportRequest request) {
        Report report = reportRepository.findById(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found: " + reportId));
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin not found: " + adminId));

        report.setStatus(request.getStatus());
        report.setAdminNotes(request.getAdminNotes());
        report.setResolvedByAdmin(admin);

        Report updated = reportRepository.save(report);
        return ReportDto.fromEntity(updated);
    }
}
