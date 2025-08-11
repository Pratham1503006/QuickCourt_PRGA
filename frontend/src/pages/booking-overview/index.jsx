import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const BookingOverview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [venues, setVenues] = useState([]);
  const [filters, setFilters] = useState({
    venue: 'all',
    status: 'all',
    dateRange: 'today',
    searchQuery: ''
  });

  // Mock venues data for the user
  useEffect(() => {
    const mockVenues = [
      { id: 'venue_001', name: 'Downtown Sports Complex' },
      { id: 'venue_002', name: 'Riverside Tennis Center' },
      { id: 'venue_003', name: 'Elite Fitness Courts' }
    ];
    setVenues(mockVenues);
  }, []);

  // Mock bookings data
  useEffect(() => {
    const generateMockBookings = () => {
      const statuses = ['confirmed', 'pending', 'cancelled', 'completed'];
      const courtTypes = ['Basketball Court A', 'Tennis Court 1', 'Badminton Court B', 'Volleyball Court 1', 'Squash Court 2'];
      const customerNames = ['John Doe', 'Sarah Wilson', 'Michael Brown', 'Emily Davis', 'David Johnson', 'Lisa Anderson', 'Chris Taylor'];

      const bookings = [];
      const today = new Date();

      for (let i = 0; i < 50; i++) {
        const bookingDate = new Date(today);
        bookingDate.setDate(today.getDate() + Math.floor(Math.random() * 30) - 15); // ±15 days from today

        const startHour = Math.floor(Math.random() * 12) + 8; // 8 AM to 7 PM
        const startTime = `${startHour.toString().padStart(2, '0')}:${Math.random() > 0.5 ? '00' : '30'}`;
        const endTime = `${(startHour + 1).toString().padStart(2, '0')}:${startTime.split(':')[1]}`;

        bookings.push({
          id: `booking_${i + 1}`,
          bookingId: `BK${(1000 + i).toString()}`,
          venueId: venues[Math.floor(Math.random() * venues.length)]?.id || 'venue_001',
          venueName: venues[Math.floor(Math.random() * venues.length)]?.name || 'Downtown Sports Complex',
          courtName: courtTypes[Math.floor(Math.random() * courtTypes.length)],
          customerName: customerNames[Math.floor(Math.random() * customerNames.length)],
          customerEmail: `customer${i + 1}@example.com`,
          customerPhone: `+1-555-0${(100 + i).toString().slice(-3)}`,
          date: bookingDate.toISOString().split('T')[0],
          startTime,
          endTime,
          duration: 1,
          pricePerHour: 25 + Math.floor(Math.random() * 30),
          totalAmount: 25 + Math.floor(Math.random() * 30),
          status: statuses[Math.floor(Math.random() * statuses.length)],
          paymentStatus: Math.random() > 0.3 ? 'paid' : 'pending',
          notes: Math.random() > 0.7 ? 'Special equipment required' : '',
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date().toISOString()
        });
      }

      return bookings.sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    setBookings(generateMockBookings());
  }, [venues]);

  // Filter bookings based on current filters
  const filteredBookings = bookings.filter(booking => {
    // Venue filter
    if (filters.venue !== 'all' && booking.venueId !== filters.venue) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && booking.status !== filters.status) {
      return false;
    }

    // Date range filter
    const bookingDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (filters.dateRange) {
      case 'today':
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        if (bookingDate < today || bookingDate > todayEnd) return false;
        break;
      case 'week':
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        if (bookingDate < today || bookingDate > weekEnd) return false;
        break;
      case 'month':
        const monthEnd = new Date(today);
        monthEnd.setMonth(today.getMonth() + 1);
        if (bookingDate < today || bookingDate > monthEnd) return false;
        break;
      case 'past':
        if (bookingDate >= today) return false;
        break;
    }

    // Search query filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      if (
        !booking.bookingId.toLowerCase().includes(query) &&
        !booking.customerName.toLowerCase().includes(query) &&
        !booking.customerEmail.toLowerCase().includes(query) &&
        !booking.courtName.toLowerCase().includes(query)
      ) {
        return false;
      }
    }

    return true;
  });

  const handleStatusChange = async (bookingId, newStatus) => {
    if (!window.confirm(`Are you sure you want to change this booking status to ${newStatus}?`)) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: newStatus, updatedAt: new Date().toISOString() }
          : booking
      ));
      
      alert(`Booking status updated to ${newStatus}!`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      alert('Failed to update booking status.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled', updatedAt: new Date().toISOString() }
          : booking
      ));
      
      alert('Booking cancelled successfully!');
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Calculate statistics
  const stats = {
    total: filteredBookings.length,
    confirmed: filteredBookings.filter(b => b.status === 'confirmed').length,
    pending: filteredBookings.filter(b => b.status === 'pending').length,
    revenue: filteredBookings.filter(b => b.paymentStatus === 'paid').reduce((sum, b) => sum + b.totalAmount, 0)
  };

  const venueOptions = [
    { value: 'all', label: 'All Venues' },
    ...venues.map(venue => ({ value: venue.id, label: venue.name }))
  ];

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'pending', label: 'Pending' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'completed', label: 'Completed' }
  ];

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'Next 7 Days' },
    { value: 'month', label: 'Next 30 Days' },
    { value: 'past', label: 'Past Bookings' },
    { value: 'all', label: 'All Time' }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <button 
                onClick={() => navigate('/facility-owner-dashboard')} 
                className="hover:text-foreground transition-colors"
              >
                Dashboard
              </button>
              <Icon name="ChevronRight" size={16} />
              <span>Booking Overview</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Booking Overview</h1>
                <p className="text-muted-foreground mt-1">
                  Manage all bookings across your venues
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/facility-owner-dashboard')}
                >
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Back to Dashboard
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="Calendar" size={20} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Confirmed</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats.confirmed}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-card-foreground">{stats.pending}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" size={20} className="text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Revenue</p>
                  <p className="text-2xl font-bold text-card-foreground">${stats.revenue.toFixed(0)}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={20} className="text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select
                label="Venue"
                options={venueOptions}
                value={filters.venue}
                onChange={(value) => setFilters(prev => ({ ...prev, venue: value }))}
              />

              <Select
                label="Status"
                options={statusOptions}
                value={filters.status}
                onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              />

              <Select
                label="Date Range"
                options={dateRangeOptions}
                value={filters.dateRange}
                onChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
              />

              <Input
                label="Search"
                type="text"
                placeholder="Search bookings..."
                value={filters.searchQuery}
                onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              />
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-card-foreground">
                Bookings ({filteredBookings.length})
              </h3>
            </div>

            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center">
                <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No bookings found matching your filters</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Booking ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Court
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-muted/50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-card-foreground">
                            {booking.bookingId}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-card-foreground">
                            {booking.customerName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {booking.customerEmail}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-card-foreground">
                            {booking.courtName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {booking.venueName}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-card-foreground">
                            {new Date(booking.date).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {booking.startTime} - {booking.endTime}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-card-foreground">
                            ${booking.totalAmount}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ${booking.pricePerHour}/hr
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPaymentStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {booking.status === 'pending' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(booking.id, 'confirmed')}
                              >
                                Confirm
                              </Button>
                            )}
                            {(booking.status === 'confirmed' || booking.status === 'pending') && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleCancelBooking(booking.id)}
                              >
                                Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card rounded-lg p-6 flex items-center space-x-3">
                <LoadingSpinner size="sm" />
                <span className="text-card-foreground">Processing...</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookingOverview;
