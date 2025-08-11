import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecentBookings = ({ bookings, onBookingAction }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (time) => {
    return time;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No recent bookings</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold text-card-foreground">{booking.customerName}</h4>
                <p className="text-sm text-muted-foreground">{booking.customerPhone}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm mb-3">
              <div>
                <p className="text-muted-foreground">Venue</p>
                <p className="font-medium text-card-foreground">{booking.venue}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Court</p>
                <p className="font-medium text-card-foreground">{booking.court}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Date & Time</p>
                <p className="font-medium text-card-foreground">
                  {formatDate(booking.date)} • {formatTime(booking.time)}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Amount</p>
                <p className="font-medium text-green-600">${booking.amount}</p>
              </div>
            </div>

            {booking.status === 'pending' && (
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => onBookingAction(booking.id, 'approve')}
                >
                  <Icon name="Check" size={14} className="mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => onBookingAction(booking.id, 'cancel')}
                >
                  <Icon name="X" size={14} className="mr-1" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default RecentBookings;
