import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/ui/Header';
import NotFound from './pages/NotFound';
import VenueSearchListings from './pages/venue-search-listings';
import LoginRegistration from './pages/login-registration';
import HomepageDashboard from './pages/homepage-dashboard';
import AdminDashboardManagement from './pages/admin-dashboard-management';
import VenueDetailsBooking from './pages/venue-details-booking';
import UserProfileMyBookings from './pages/user-profile-my-bookings';
import DatabaseViewer from './pages/database-viewer';
import UserFavorites from './pages/user-favorites';
import UserNotifications from './pages/user-notifications';
import FacilityOwnerDashboard from './pages/facility-owner-dashboard';
import FacilityManagement from './pages/facility-management';
import CourtManagement from './pages/court-management';
import BookingOverview from './pages/booking-overview';

const Routes = () => {
  const { isAuthenticated, user } = useAuth();

  // Redirect root path based on authentication status and role
  const getDefaultRoute = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login-registration" replace />;
    }

    switch (user?.role) {
      case 'admin':
        return <Navigate to="/admin-dashboard-management" replace />;
      case 'venue_owner':
        return <Navigate to="/facility-owner-dashboard" replace />;
      default:
        return <Navigate to="/homepage-dashboard" replace />;
    }
  };

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ScrollToTop />
        <RouterRoutes>
          {/* Root route - redirect based on auth status */}
          <Route path="/" element={getDefaultRoute()} />
          
          {/* Public routes */}
          <Route path="/login-registration" element={<LoginRegistration />} />
          
          {/* Protected routes for customers */}
          <Route 
            path="/homepage-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <HomepageDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/venue-search-listings" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <VenueSearchListings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user-profile-my-bookings" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <UserProfileMyBookings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user-favorites" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <UserFavorites />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/user-notifications" 
            element={
              <ProtectedRoute allowedRoles={['customer']}>
                <UserNotifications />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected routes for venue owners */}
          <Route 
            path="/facility-owner-dashboard" 
            element={
              <ProtectedRoute allowedRoles={['venue_owner']}>
                <FacilityOwnerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/facility-management" 
            element={
              <ProtectedRoute allowedRoles={['venue_owner']}>
                <FacilityManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/facility-management/:venueId" 
            element={
              <ProtectedRoute allowedRoles={['venue_owner']}>
                <FacilityManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/court-management/:venueId" 
            element={
              <ProtectedRoute allowedRoles={['venue_owner']}>
                <CourtManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/booking-overview" 
            element={
              <ProtectedRoute allowedRoles={['venue_owner']}>
                <BookingOverview />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/venue-details-booking" 
            element={
              <ProtectedRoute allowedRoles={['venue_owner', 'admin']}>
                <VenueDetailsBooking />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/venue-details-booking/:venueId" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'venue_owner', 'admin']}>
                <VenueDetailsBooking />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected routes for admin */}
          <Route 
            path="/admin-dashboard-management" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardManagement />
              </ProtectedRoute>
            } 
          />
          
          {/* Database Viewer - accessible to all authenticated users */}
          <Route 
            path="/database-viewer" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'venue_owner', 'admin']}>
                <DatabaseViewer />
              </ProtectedRoute>
            } 
          />
          
          {/* Settings and Help Pages - placeholders for now */}
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute allowedRoles={['customer', 'venue_owner', 'admin']}>
                <div className="min-h-screen bg-background pt-16">
                  <Header />
                  <div className="max-w-4xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Settings</h1>
                    <p className="text-muted-foreground">Settings page coming soon...</p>
                  </div>
                </div>
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/help" 
            element={
              <div className="min-h-screen bg-background pt-16">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-8">
                  <h1 className="text-3xl font-bold mb-6">Help Center</h1>
                  <p className="text-muted-foreground">Help center coming soon...</p>
                </div>
              </div>
            } 
          />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFound />} />
        </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
