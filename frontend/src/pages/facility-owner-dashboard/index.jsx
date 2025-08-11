import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StatCard from './components/StatCard';
import BookingChart from './components/BookingChart';
import EarningsChart from './components/EarningsChart';
import RecentBookings from './components/RecentBookings';
import VenueQuickActions from './components/VenueQuickActions';

const FacilityOwnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  // Mock data for facility owner stats
  const [dashboardStats, setDashboardStats] = useState({
    totalBookings: 247,
    activeVenues: 3,
    activeCourts: 12,
    totalEarnings: 18750.50,
    monthlyGrowth: 15.8,
    pendingBookings: 8,
    completedBookings: 239,
    cancelledBookings: 12
  });

  const [bookingTrends, setBookingTrends] = useState([
    { date: '2025-08-01', bookings: 12, earnings: 680 },
    { date: '2025-08-02', bookings: 15, earnings: 890 },
    { date: '2025-08-03', bookings: 8, earnings: 450 },
    { date: '2025-08-04', bookings: 18, earnings: 1020 },
    { date: '2025-08-05', bookings: 22, earnings: 1250 },
    { date: '2025-08-06', bookings: 25, earnings: 1480 },
    { date: '2025-08-07', bookings: 19, earnings: 1150 },
    { date: '2025-08-08', bookings: 16, earnings: 920 },
    { date: '2025-08-09', bookings: 21, earnings: 1320 },
    { date: '2025-08-10', bookings: 17, earnings: 980 },
    { date: '2025-08-11', bookings: 14, earnings: 750 }
  ]);

  const [peakHours, setPeakHours] = useState([
    { hour: '6 AM', bookings: 2 },
    { hour: '7 AM', bookings: 4 },
    { hour: '8 AM', bookings: 8 },
    { hour: '9 AM', bookings: 12 },
    { hour: '10 AM', bookings: 15 },
    { hour: '11 AM', bookings: 18 },
    { hour: '12 PM', bookings: 22 },
    { hour: '1 PM', bookings: 25 },
    { hour: '2 PM', bookings: 20 },
    { hour: '3 PM', bookings: 28 },
    { hour: '4 PM', bookings: 35 },
    { hour: '5 PM', bookings: 42 },
    { hour: '6 PM', bookings: 55 },
    { hour: '7 PM', bookings: 48 },
    { hour: '8 PM', bookings: 38 },
    { hour: '9 PM', bookings: 25 },
    { hour: '10 PM', bookings: 12 }
  ]);

  const [recentBookings, setRecentBookings] = useState([
    {
      id: 'BK2025001',
      customerName: 'John Smith',
      venue: 'Downtown Sports Complex',
      court: 'Basketball Court A',
      sport: 'Basketball',
      date: '2025-08-12',
      time: '18:00 - 20:00',
      status: 'confirmed',
      amount: 85,
      customerPhone: '+1 (555) 123-4567'
    },
    {
      id: 'BK2025002',
      customerName: 'Sarah Johnson',
      venue: 'Elite Tennis Club',
      court: 'Tennis Court 1',
      sport: 'Tennis',
      date: '2025-08-12',
      time: '14:00 - 16:00',
      status: 'pending',
      amount: 120,
      customerPhone: '+1 (555) 987-6543'
    },
    {
      id: 'BK2025003',
      customerName: 'Mike Davis',
      venue: 'Downtown Sports Complex',
      court: 'Badminton Court B',
      sport: 'Badminton',
      date: '2025-08-12',
      time: '19:00 - 21:00',
      status: 'confirmed',
      amount: 45,
      customerPhone: '+1 (555) 246-8101'
    }
  ]);

  const [myVenues, setMyVenues] = useState([
    {
      id: 'venue_001',
      name: 'Downtown Sports Complex',
      location: 'Downtown, City Center',
      totalCourts: 6,
      activeCourts: 6,
      todayBookings: 8,
      monthlyRevenue: 8500,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=300&h=200&fit=crop'
    },
    {
      id: 'venue_002',
      name: 'Elite Tennis Club',
      location: 'Uptown District',
      totalCourts: 4,
      activeCourts: 4,
      todayBookings: 6,
      monthlyRevenue: 6750,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=300&h=200&fit=crop'
    },
    {
      id: 'venue_003',
      name: 'Community Sports Hub',
      location: 'Residential Area',
      totalCourts: 2,
      activeCourts: 1,
      todayBookings: 3,
      monthlyRevenue: 3500,
      status: 'maintenance',
      image: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=300&h=200&fit=crop'
    }
  ]);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleTimeRangeChange = (range) => {
    setSelectedTimeRange(range);
    // In real app, fetch data based on time range
  };

  const handleBookingAction = (bookingId, action) => {
    setRecentBookings(prev => prev.map(booking => 
      booking.id === bookingId 
        ? { ...booking, status: action === 'approve' ? 'confirmed' : 'cancelled' }
        : booking
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Facility Owner Dashboard</h1>
                <p className="text-muted-foreground mt-1">
                  Welcome back, {user?.fullName || 'Facility Owner'}! Here's your business overview.
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <select
                  value={selectedTimeRange}
                  onChange={(e) => handleTimeRangeChange(e.target.value)}
                  className="px-4 py-2 border border-border rounded-lg bg-card text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                
                <Button 
                  variant="default" 
                  onClick={() => navigate('/facility-management')}
                >
                  <Icon name="Building" size={16} className="mr-2" />
                  Manage Facilities
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Bookings"
              value={dashboardStats.totalBookings}
              change="+12.5%"
              changeType="increase"
              icon="Calendar"
              color="primary"
            />
            <StatCard
              title="Active Courts"
              value={dashboardStats.activeCourts}
              change="+2"
              changeType="increase"
              icon="MapPin"
              color="success"
            />
            <StatCard
              title="Total Earnings"
              value={`$${dashboardStats.totalEarnings.toLocaleString()}`}
              change={`+${dashboardStats.monthlyGrowth}%`}
              changeType="increase"
              icon="DollarSign"
              color="warning"
            />
            <StatCard
              title="Pending Bookings"
              value={dashboardStats.pendingBookings}
              change="-3"
              changeType="decrease"
              icon="Clock"
              color="error"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-card-foreground">Booking Trends</h3>
                <Icon name="TrendingUp" size={20} className="text-muted-foreground" />
              </div>
              <BookingChart data={bookingTrends} />
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-card-foreground">Earnings Overview</h3>
                <Icon name="DollarSign" size={20} className="text-muted-foreground" />
              </div>
              <EarningsChart data={bookingTrends} />
            </div>
          </div>

          {/* Peak Hours Chart */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-card-foreground">Peak Booking Hours</h3>
              <Icon name="Clock" size={20} className="text-muted-foreground" />
            </div>
            <div className="h-64">
              <div className="flex items-end justify-between h-full space-x-1">
                {peakHours.map((hour, index) => (
                  <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                    <div 
                      className="bg-primary rounded-t w-full transition-all hover:bg-primary/80"
                      style={{ height: `${(hour.bookings / Math.max(...peakHours.map(h => h.bookings))) * 100}%` }}
                      title={`${hour.hour}: ${hour.bookings} bookings`}
                    ></div>
                    <span className="text-xs text-muted-foreground transform -rotate-45 whitespace-nowrap">
                      {hour.hour}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Bookings */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-card-foreground">Recent Bookings</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/booking-overview')}
                >
                  View All
                </Button>
              </div>
              <RecentBookings 
                bookings={recentBookings} 
                onBookingAction={handleBookingAction}
              />
            </div>

            {/* My Venues */}
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-card-foreground">My Venues</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => navigate('/facility-management')}
                >
                  Manage All
                </Button>
              </div>
              <VenueQuickActions 
                venues={myVenues} 
                onManageVenue={(venueId) => navigate(`/facility-management/${venueId}`)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacilityOwnerDashboard;
