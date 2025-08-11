import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';

import ProfileForm from './components/ProfileForm';
import BookingCard from './components/BookingCard';
import BookingFilters from './components/BookingFilters';
import BookingStats from './components/BookingStats';
import EmptyBookings from './components/EmptyBookings';

const UserProfileMyBookings = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: 'user_001',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1992-03-15',
    gender: 'female',
    address: '123 Main Street, Apt 4B',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    emergencyContact: 'Michael Johnson',
    emergencyPhone: '+1 (555) 987-6543',
    preferredSports: ['basketball', 'tennis', 'badminton'],
    notifications: {
      email: true,
      sms: false,
      push: true
    },
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face'
  });

  const [bookings, setBookings] = useState([
    {
      id: 'BK001',
      venue: {
        id: 'venue_001',
        name: 'Downtown Sports Complex',
        location: '456 Sports Ave, San Francisco, CA',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
      },
      court: {
        id: 'court_001',
        name: 'Court A'
      },
      sport: 'Basketball',
      date: '2025-01-15',
      startTime: '18:00',
      endTime: '20:00',
      status: 'Confirmed',
      totalAmount: 85.00,
      bookingDate: '2025-01-08',
      participants: 8,
      specialRequests: 'Please ensure the court is well-lit for evening play',
      reviewed: false
    },
    {
      id: 'BK002',
      venue: {
        id: 'venue_002',
        name: 'Elite Tennis Club',
        location: '789 Tennis Rd, San Francisco, CA',
        image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop'
      },
      court: {
        id: 'court_002',
        name: 'Court 3'
      },
      sport: 'Tennis',
      date: '2025-01-20',
      startTime: '14:00',
      endTime: '16:00',
      status: 'Confirmed',
      totalAmount: 120.00,
      bookingDate: '2025-01-10',
      participants: 2,
      reviewed: false
    },
    {
      id: 'BK003',
      venue: {
        id: 'venue_003',
        name: 'City Badminton Center',
        location: '321 Shuttle St, San Francisco, CA',
        image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop'
      },
      court: {
        id: 'court_003',
        name: 'Court 1'
      },
      sport: 'Badminton',
      date: '2024-12-20',
      startTime: '10:00',
      endTime: '12:00',
      status: 'Completed',
      totalAmount: 45.00,
      bookingDate: '2024-12-15',
      participants: 4,
      reviewed: true
    },
    {
      id: 'BK004',
      venue: {
        id: 'venue_004',
        name: 'Metro Sports Hub',
        location: '654 Athletic Blvd, San Francisco, CA',
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
      },
      court: {
        id: 'court_004',
        name: 'Court B'
      },
      sport: 'Basketball',
      date: '2024-12-10',
      startTime: '16:00',
      endTime: '18:00',
      status: 'Cancelled',
      totalAmount: 75.00,
      bookingDate: '2024-12-05',
      participants: 6,
      reviewed: false
    },
    {
      id: 'BK005',
      venue: {
        id: 'venue_005',
        name: 'Premier Volleyball Arena',
        location: '987 Spike Ave, San Francisco, CA',
        image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&h=300&fit=crop'
      },
      court: {
        id: 'court_005',
        name: 'Court 2'
      },
      sport: 'Volleyball',
      date: '2025-01-12',
      startTime: '19:00',
      endTime: '21:00',
      status: 'Pending',
      totalAmount: 95.00,
      bookingDate: '2025-01-11',
      participants: 12,
      reviewed: false
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    status: '',
    sport: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date-desc',
    quickFilter: ''
  });

  const [filteredBookings, setFilteredBookings] = useState(bookings);
  const [bookingStats, setBookingStats] = useState({
    totalBookings: 0,
    upcomingBookings: 0,
    completedBookings: 0,
    totalSpent: 0
  });

  const [bookingCounts, setBookingCounts] = useState({
    confirmed: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });

  // Calculate stats and counts
  useEffect(() => {
    const now = new Date();
    const stats = {
      totalBookings: bookings?.length,
      upcomingBookings: bookings?.filter(b => 
        new Date(b.date) > now && b?.status?.toLowerCase() === 'confirmed'
      )?.length,
      completedBookings: bookings?.filter(b => 
        b?.status?.toLowerCase() === 'completed'
      )?.length,
      totalSpent: bookings?.reduce((sum, b) => 
        b?.status?.toLowerCase() !== 'cancelled' ? sum + b?.totalAmount : sum, 0
      )
    };

    const counts = {
      confirmed: bookings?.filter(b => b?.status?.toLowerCase() === 'confirmed')?.length,
      pending: bookings?.filter(b => b?.status?.toLowerCase() === 'pending')?.length,
      completed: bookings?.filter(b => b?.status?.toLowerCase() === 'completed')?.length,
      cancelled: bookings?.filter(b => b?.status?.toLowerCase() === 'cancelled')?.length
    };

    setBookingStats(stats);
    setBookingCounts(counts);
  }, [bookings]);

  // Filter bookings
  useEffect(() => {
    let filtered = [...bookings];

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(booking =>
        booking?.venue?.name?.toLowerCase()?.includes(searchTerm) ||
        booking?.court?.name?.toLowerCase()?.includes(searchTerm) ||
        booking?.sport?.toLowerCase()?.includes(searchTerm) ||
        booking?.id?.toLowerCase()?.includes(searchTerm) ||
        booking?.venue?.location?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Status filter
    if (filters?.status) {
      filtered = filtered?.filter(booking =>
        booking?.status?.toLowerCase() === filters?.status?.toLowerCase()
      );
    }

    // Sport filter
    if (filters?.sport) {
      filtered = filtered?.filter(booking =>
        booking?.sport?.toLowerCase() === filters?.sport?.toLowerCase()
      );
    }

    // Date range filter
    if (filters?.dateFrom) {
      filtered = filtered?.filter(booking =>
        new Date(booking.date) >= new Date(filters.dateFrom)
      );
    }

    if (filters?.dateTo) {
      filtered = filtered?.filter(booking =>
        new Date(booking.date) <= new Date(filters.dateTo)
      );
    }

    // Quick filters
    const now = new Date();
    if (filters?.quickFilter === 'upcoming') {
      filtered = filtered?.filter(booking =>
        new Date(booking.date) > now && booking?.status?.toLowerCase() === 'confirmed'
      );
    } else if (filters?.quickFilter === 'this-month') {
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      filtered = filtered?.filter(booking =>
        new Date(booking.date) >= thisMonth && new Date(booking.date) < nextMonth
      );
    } else if (filters?.quickFilter === 'needs-review') {
      filtered = filtered?.filter(booking =>
        booking?.status?.toLowerCase() === 'completed' && !booking?.reviewed
      );
    }

    // Sort bookings
    filtered?.sort((a, b) => {
      switch (filters?.sortBy) {
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'amount-asc':
          return a?.totalAmount - b?.totalAmount;
        case 'amount-desc':
          return b?.totalAmount - a?.totalAmount;
        case 'venue-name':
          return a?.venue?.name?.localeCompare(b?.venue?.name);
        default:
          return new Date(b.date) - new Date(a.date);
      }
    });

    setFilteredBookings(filtered);
  }, [bookings, filters]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      status: '',
      sport: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'date-desc',
      quickFilter: ''
    });
  };

  const handleProfileSave = (updatedUser) => {
    setUser(updatedUser);
    // Show success message or toast
    console.log('Profile updated successfully');
  };

  const handleBookingCancel = (bookingId) => {
    setBookings(prev => prev?.map(booking =>
      booking?.id === bookingId
        ? { ...booking, status: 'Cancelled' }
        : booking
    ));
    // Show success message
    console.log('Booking cancelled successfully');
  };

  const handleBookingModify = (bookingId) => {
    // Navigate to booking modification page
    console.log('Modify booking:', bookingId);
  };

  const handleViewReceipt = (bookingId) => {
    // Generate and download receipt
    console.log('Download receipt for booking:', bookingId);
  };

  const hasActiveFilters = () => {
    return filters?.search || 
           filters?.status || 
           filters?.sport || 
           filters?.dateFrom || 
           filters?.dateTo ||
           filters?.quickFilter ||
           filters?.sortBy !== 'date-desc';
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon name="User" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-text-primary">My Account</h1>
                <p className="text-text-secondary">Manage your profile and bookings</p>
              </div>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <button
              onClick={() => navigate('/venue-search-listings')}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <Icon name="Search" size={20} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-text-primary">Find Venues</h3>
                  <p className="text-sm text-text-secondary">Discover new places</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/user-favorites')}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Icon name="Heart" size={20} className="text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-text-primary">Favorites</h3>
                  <p className="text-sm text-text-secondary">Saved venues</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/user-notifications')}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                  <Icon name="Bell" size={20} className="text-orange-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-text-primary">Notifications</h3>
                  <p className="text-sm text-text-secondary">Stay updated</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => navigate('/homepage-dashboard')}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <Icon name="Home" size={20} className="text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-text-primary">Home</h3>
                  <p className="text-sm text-text-secondary">Back to dashboard</p>
                </div>
              </div>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-8 bg-muted p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-6 py-3 rounded-md font-medium transition-smooth ${
                activeTab === 'bookings' ?'bg-card text-text-primary shadow-soft' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="Calendar" size={18} className="mr-2 inline" />
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-md font-medium transition-smooth ${
                activeTab === 'profile' ?'bg-card text-text-primary shadow-soft' :'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name="Settings" size={18} className="mr-2 inline" />
              Profile Settings
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'bookings' ? (
            <div>
              {/* Booking Stats */}
              <BookingStats stats={bookingStats} />

              {/* Booking Filters */}
              <BookingFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
                bookingCounts={bookingCounts}
              />

              {/* Bookings List */}
              {filteredBookings?.length > 0 ? (
                <div className="space-y-4">
                  {filteredBookings?.map((booking) => (
                    <BookingCard
                      key={booking?.id}
                      booking={booking}
                      onCancel={handleBookingCancel}
                      onModify={handleBookingModify}
                      onViewReceipt={handleViewReceipt}
                    />
                  ))}
                </div>
              ) : (
                <EmptyBookings
                  hasFilters={hasActiveFilters()}
                  onClearFilters={handleClearFilters}
                />
              )}
            </div>
          ) : (
            <ProfileForm
              user={user}
              onSave={handleProfileSave}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default UserProfileMyBookings;