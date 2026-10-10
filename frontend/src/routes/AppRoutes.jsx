import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout
import { MainLayout } from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';
import { AccommodationSearchPage } from '../pages/public/AccommodationSearchPage';
import { AccommodationDetailPage } from '../pages/public/AccommodationDetailPage';
import { AboutPage } from '../pages/public/AboutPage';
import { ContactPage } from '../pages/public/ContactPage';
import { PrivacyPolicyPage } from '../pages/public/PrivacyPolicyPage';
import { TermsPage } from '../pages/public/TermsPage';
import { AccessDeniedPage } from '../pages/public/AccessDeniedPage';
import { NotFoundPage } from '../pages/public/NotFoundPage';

// Student Pages
import { StudentDashboardPage } from '../pages/student/StudentDashboardPage';
import { StudentProfilePage } from '../pages/student/StudentProfilePage';
import { EditPreferencesPage } from '../pages/student/EditPreferencesPage';
import { RoommateMatchesPage } from '../pages/student/RoommateMatchesPage';
import { SavedListingsPage } from '../pages/student/SavedListingsPage';
import { SentRequestsPage } from '../pages/student/SentRequestsPage';
import { ReceivedRequestsPage } from '../pages/student/ReceivedRequestsPage';
import { StudentEnquiriesPage } from '../pages/student/StudentEnquiriesPage';

// Owner Pages
import { OwnerDashboardPage } from '../pages/owner/OwnerDashboardPage';
import { OwnerProfilePage } from '../pages/owner/OwnerProfilePage';
import { AddAccommodationPage } from '../pages/owner/AddAccommodationPage';
import { EditAccommodationPage } from '../pages/owner/EditAccommodationPage';
import { ManageListingsPage } from '../pages/owner/ManageListingsPage';
import { ManageEnquiriesPage } from '../pages/owner/ManageEnquiriesPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { ListingModerationPage } from '../pages/admin/ListingModerationPage';
import { ReportManagementPage } from '../pages/admin/ReportManagementPage';
import { AuditLogsPage } from '../pages/admin/AuditLogsPage';

// Shared Authenticated Pages
import { MessagesPage } from '../pages/shared/MessagesPage';
import { NotificationsPage } from '../pages/shared/NotificationsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/rooms" element={<AccommodationSearchPage />} />
        <Route path="/rooms/:id" element={<AccommodationDetailPage />} />
        <Route path="/accommodations" element={<AccommodationSearchPage />} />
        <Route path="/accommodations/:id" element={<AccommodationDetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/access-denied" element={<AccessDeniedPage />} />

        {/* Protected Student Routes */}
        <Route
          path="/student/dashboard"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/preferences"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <EditPreferencesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/matches"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <RoommateMatchesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/saved"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <SavedListingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/requests/sent"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <SentRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/sent"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <SentRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/requests/received"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <ReceivedRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests/received"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <ReceivedRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/enquiries"
          element={
            <ProtectedRoute allowedRoles={['STUDENT']}>
              <StudentEnquiriesPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Owner Routes */}
        <Route
          path="/owner/dashboard"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <OwnerDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/profile"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <OwnerProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/add-accommodation"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <AddAccommodationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/edit-accommodation/:id"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <EditAccommodationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/listings"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <ManageListingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/owner/enquiries"
          element={
            <ProtectedRoute allowedRoles={['OWNER']}>
              <ManageEnquiriesPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/moderation"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ListingModerationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <ReportManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-logs"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AuditLogsPage />
            </ProtectedRoute>
          }
        />

        {/* Shared Authenticated Routes */}
        <Route
          path="/messages"
          element={
            <ProtectedRoute>
              <MessagesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
