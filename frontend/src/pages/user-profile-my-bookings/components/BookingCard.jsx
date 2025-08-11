import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const BookingCard = ({ booking, onCancel, onModify, onViewReceipt }) => {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-success text-success-foreground';
      case 'pending':
        return 'bg-warning text-warning-foreground';
      case 'cancelled':
        return 'bg-error text-error-foreground';
      case 'completed':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'CheckCircle';
      case 'pending':
        return 'Clock';
      case 'cancelled':
        return 'XCircle';
      case 'completed':
        return 'Check';
      default:
        return 'Clock';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    const time = new Date(`2000-01-01T${timeString}`);
    return time?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const canCancel = () => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);
    return booking?.status?.toLowerCase() === 'confirmed' && hoursDiff > 24;
  };

  const canModify = () => {
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursDiff = (bookingDate - now) / (1000 * 60 * 60);
    return booking?.status?.toLowerCase() === 'confirmed' && hoursDiff > 48;
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      onCancel(booking?.id);
      setShowCancelDialog(false);
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setIsCancelling(false);
    }
  };

  const getCancellationPolicy = () => {
    return `Free cancellation up to 24 hours before your booking. Cancellations within 24 hours may incur a 50% charge.`;
  };

  return (
    <>
      <div className="bg-card rounded-lg border border-border p-6 hover:shadow-elevated transition-smooth">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Venue Info */}
          <div className="flex space-x-4">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={booking?.venue?.image}
                alt={booking?.venue?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-text-primary truncate">
                {booking?.venue?.name}
              </h3>
              <p className="text-text-secondary text-sm mb-1">
                {booking?.court?.name} • {booking?.sport}
              </p>
              <div className="flex items-center text-text-secondary text-sm mb-2">
                <Icon name="MapPin" size={14} className="mr-1" />
                <span className="truncate">{booking?.venue?.location}</span>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center text-text-secondary">
                  <Icon name="Calendar" size={14} className="mr-1" />
                  <span>{formatDate(booking?.date)}</span>
                </div>
                <div className="flex items-center text-text-secondary">
                  <Icon name="Clock" size={14} className="mr-1" />
                  <span>{formatTime(booking?.startTime)} - {formatTime(booking?.endTime)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details */}
          <div className="flex flex-col lg:items-end space-y-2">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking?.status)}`}>
              <Icon name={getStatusIcon(booking?.status)} size={14} className="mr-1" />
              {booking?.status}
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-text-primary">${booking?.totalAmount}</p>
              <p className="text-sm text-text-secondary">Booking #{booking?.id}</p>
            </div>
            <div className="text-right text-sm text-text-secondary">
              <p>Booked on {formatDate(booking?.bookingDate)}</p>
              {booking?.participants && (
                <p>{booking?.participants} participant{booking?.participants > 1 ? 's' : ''}</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewReceipt(booking?.id)}
            iconName="Download"
            iconPosition="left"
          >
            Receipt
          </Button>
          
          {booking?.status?.toLowerCase() === 'confirmed' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/venue-details-booking?venue=${booking?.venue?.id}`, '_blank')}
              iconName="ExternalLink"
              iconPosition="left"
            >
              View Venue
            </Button>
          )}

          {canModify() && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onModify(booking?.id)}
              iconName="Edit"
              iconPosition="left"
            >
              Modify
            </Button>
          )}

          {canCancel() && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowCancelDialog(true)}
              iconName="X"
              iconPosition="left"
            >
              Cancel
            </Button>
          )}

          {booking?.status?.toLowerCase() === 'completed' && !booking?.reviewed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => console.log('Add review for booking:', booking?.id)}
              iconName="Star"
              iconPosition="left"
            >
              Add Review
            </Button>
          )}
        </div>

        {/* Additional Info */}
        {booking?.specialRequests && (
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-text-secondary">
              <span className="font-medium">Special Requests:</span> {booking?.specialRequests}
            </p>
          </div>
        )}
      </div>
      {/* Cancel Confirmation Dialog */}
      {showCancelDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg border border-border p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-error/10 rounded-full flex items-center justify-center mr-3">
                <Icon name="AlertTriangle" size={20} className="text-error" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">Cancel Booking</h3>
            </div>
            
            <p className="text-text-secondary mb-4">
              Are you sure you want to cancel your booking for {booking?.venue?.name} on {formatDate(booking?.date)}?
            </p>
            
            <div className="bg-muted rounded-lg p-3 mb-4">
              <p className="text-sm text-text-secondary">
                <span className="font-medium">Cancellation Policy:</span><br />
                {getCancellationPolicy()}
              </p>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowCancelDialog(false)}
                disabled={isCancelling}
              >
                Keep Booking
              </Button>
              <Button
                variant="destructive"
                fullWidth
                onClick={handleCancel}
                loading={isCancelling}
              >
                Cancel Booking
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BookingCard;