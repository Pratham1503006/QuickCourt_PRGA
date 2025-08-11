import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BookingConfirmationModal = ({ isOpen, onClose, bookingDetails, onConfirm }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeSlots = (slots) => {
    if (slots?.length === 0) return '';
    if (slots?.length === 1) return `${slots?.[0]}:00`;
    
    const sortedSlots = slots?.sort();
    const startTime = sortedSlots?.[0];
    const endTime = parseInt(sortedSlots?.[sortedSlots?.length - 1]) + 1;
    return `${startTime}:00 - ${endTime}:00`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-1050 p-4">
      <div className="bg-card rounded-lg shadow-elevated max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={24} className="text-success" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary">Confirm Booking</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Booking Details */}
        <div className="p-6 space-y-4">
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-text-secondary">Court:</span>
              <span className="font-medium text-text-primary">
                {bookingDetails?.courtName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Date:</span>
              <span className="font-medium text-text-primary">
                {formatDate(bookingDetails?.date)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Time:</span>
              <span className="font-medium text-text-primary">
                {formatTimeSlots(bookingDetails?.timeSlots)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Duration:</span>
              <span className="font-medium text-text-primary">
                {bookingDetails?.timeSlots?.length} hour{bookingDetails?.timeSlots?.length > 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-secondary">Players:</span>
              <span className="font-medium text-text-primary">
                {bookingDetails?.playerCount}
              </span>
            </div>
            {bookingDetails?.specialRequests && (
              <div className="flex justify-between">
                <span className="text-text-secondary">Special Requests:</span>
                <span className="font-medium text-text-primary text-right max-w-48">
                  {bookingDetails?.specialRequests}
                </span>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="bg-primary/5 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary">Rate per hour:</span>
              <span className="font-medium">${bookingDetails?.pricePerHour}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary">Duration:</span>
              <span className="font-medium">{bookingDetails?.timeSlots?.length} hour{bookingDetails?.timeSlots?.length > 1 ? 's' : ''}</span>
            </div>
            <hr className="my-2 border-border" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-text-primary">Total Amount:</span>
              <span className="text-lg font-bold text-primary">${bookingDetails?.totalPrice}</span>
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Icon name="AlertTriangle" size={16} className="text-warning mt-0.5" />
              <div className="text-sm text-text-secondary">
                <p className="font-medium text-text-primary mb-1">Important Notes:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Booking confirmation will be sent to your email</li>
                  <li>• Cancellation allowed up to 2 hours before booking time</li>
                  <li>• Please arrive 10 minutes early for check-in</li>
                  <li>• Bring valid ID and sports equipment</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className="font-medium text-text-primary">Payment Method</h3>
            <div className="flex items-center space-x-3 p-3 border border-border rounded-lg">
              <Icon name="CreditCard" size={20} className="text-primary" />
              <div className="flex-1">
                <div className="font-medium text-text-primary">Credit Card</div>
                <div className="text-sm text-text-secondary">**** **** **** 4242</div>
              </div>
              <Button variant="ghost" size="sm">Change</Button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 p-6 border-t border-border">
          <Button variant="outline" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" fullWidth onClick={onConfirm} iconName="CreditCard" iconPosition="left">
            Confirm & Pay ${bookingDetails?.totalPrice}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationModal;