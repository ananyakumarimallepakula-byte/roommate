package com.roommate.dto.admin;

public class DashboardStatsDto {
    private long totalUsers;
    private long totalStudents;
    private long totalOwners;
    private long totalAccommodations;
    private long pendingAccommodations;
    private long approvedAccommodations;
    private long totalPendingReports;
    private long activeUsers;
    private long suspendedUsers;

    public DashboardStatsDto() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getTotalOwners() { return totalOwners; }
    public void setTotalOwners(long totalOwners) { this.totalOwners = totalOwners; }

    public long getTotalAccommodations() { return totalAccommodations; }
    public void setTotalAccommodations(long totalAccommodations) { this.totalAccommodations = totalAccommodations; }

    public long getPendingAccommodations() { return pendingAccommodations; }
    public void setPendingAccommodations(long pendingAccommodations) { this.pendingAccommodations = pendingAccommodations; }

    public long getApprovedAccommodations() { return approvedAccommodations; }
    public void setApprovedAccommodations(long approvedAccommodations) { this.approvedAccommodations = approvedAccommodations; }

    public long getTotalPendingReports() { return totalPendingReports; }
    public void setTotalPendingReports(long totalPendingReports) { this.totalPendingReports = totalPendingReports; }

    public long getActiveUsers() { return activeUsers; }
    public void setActiveUsers(long activeUsers) { this.activeUsers = activeUsers; }

    public long getSuspendedUsers() { return suspendedUsers; }
    public void setSuspendedUsers(long suspendedUsers) { this.suspendedUsers = suspendedUsers; }
}
