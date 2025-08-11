import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BookingWidget = ({ courts, onBookingSubmit, isSticky = false }) => {
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [playerCount, setPlayerCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Generate next 30 days for date selection
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date?.setDate(today?.getDate() + i);
      dates?.push({
        value: date?.toISOString()?.split('T')?.[0],
        label: date?.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        })
      });
    }
    return dates;
  };

  // Mock time slots with availability
  const timeSlots = [
    { id: '06:00', time: '6:00 AM', available: true },
    { id: '07:00', time: '7:00 AM', available: true },
    { id: '08:00', time: '8:00 AM', available: false },
    { id: '09:00', time: '9:00 AM', available: true },
    { id: '10:00', time: '10:00 AM', available: true },
    { id: '11:00', time: '11:00 AM', available: false },
    { id: '12:00', time: '12:00 PM', available: true },
    { id: '13:00', time: '1:00 PM', available: true },
    { id: '14:00', time: '2:00 PM', available: true },
    { id: '15:00', time: '3:00 PM', available: false },
    { id: '16:00', time: '4:00 PM', available: true },
    { id: '17:00', time: '5:00 PM', available: true },
    { id: '18:00', time: '6:00 PM', available: true },
    { id: '19:00', time: '7:00 PM', available: false },
    { id: '20:00', time: '8:00 PM', available: true },
    { id: '21:00', time: '9:00 PM', available: true }
  ];

  const courtOptions = courts?.map(court => ({
    value: court?.id,
    label: `${court?.name} - $${court?.pricePerHour}/hour`,
    description: court?.surface
  }));

  const playerCountOptions = [
    { value: 1, label: '1 Player' },
    { value: 2, label: '2 Players' },
    { value: 4, label: '4 Players' },
    { value: 6, label: '6 Players' },
    { value: 8, label: '8 Players' },
    { value: 10, label: '10+ Players' }
  ];

  const toggleTimeSlot = (slotId) => {
    setSelectedTimeSlots(prev => {
      if (prev?.includes(slotId)) {
        return prev?.filter(id => id !== slotId);
      } else {
        return [...prev, slotId];
      }
    });
  };

  // Calculate total price
  useEffect(() => {
    if (selectedCourt && selectedTimeSlots?.length > 0) {
      const court = courts?.find(c => c?.id === selectedCourt);
      if (court) {
        const price = court?.pricePerHour * selectedTimeSlots?.length;
        setTotalPrice(price);
      }
    } else {
      setTotalPrice(0);
    }
  }, [selectedCourt, selectedTimeSlots, courts]);

  const handleBooking = async () => {
    if (!selectedCourt || !selectedDate || selectedTimeSlots?.length === 0) {
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const bookingData = {
      courtId: selectedCourt,
      date: selectedDate,
      timeSlots: selectedTimeSlots,
      playerCount,
      specialRequests,
      totalPrice
    };

    onBookingSubmit(bookingData);
    setIsLoading(false);
  };

  const isBookingValid = selectedCourt && selectedDate && selectedTimeSlots?.length > 0;

  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${isSticky ? 'sticky top-20' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-text-primary">Book This Venue</h3>
        <Icon name="Calendar" size={24} className="text-primary" />
      </div>
      <div className="space-y-4">
        {/* Court Selection */}
        <Select
          label="Select Court"
          options={courtOptions}
          value={selectedCourt}
          onChange={setSelectedCourt}
          placeholder="Choose a court"
          required
        />

        {/* Date Selection */}
        <Select
          label="Select Date"
          options={generateDateOptions()}
          value={selectedDate}
          onChange={setSelectedDate}
          placeholder="Choose date"
          required
        />

        {/* Time Slots */}
        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-text-primary mb-3">
              Available Time Slots
            </label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {timeSlots?.map((slot) => (
                <button
                  key={slot?.id}
                  onClick={() => slot?.available && toggleTimeSlot(slot?.id)}
                  disabled={!slot?.available}
                  className={`p-2 text-sm rounded-lg border transition-all ${
                    !slot?.available
                      ? 'bg-muted text-muted-foreground border-border cursor-not-allowed'
                      : selectedTimeSlots?.includes(slot?.id)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-card text-text-primary border-border hover:border-primary'
                  }`}
                >
                  {slot?.time}
                  {!slot?.available && (
                    <div className="text-xs text-destructive mt-1">Booked</div>
                  )}
                </button>
              ))}
            </div>
            {selectedTimeSlots?.length > 0 && (
              <div className="mt-2 text-sm text-text-secondary">
                Selected: {selectedTimeSlots?.length} hour{selectedTimeSlots?.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        )}

        {/* Player Count */}
        <Select
          label="Number of Players"
          options={playerCountOptions}
          value={playerCount}
          onChange={setPlayerCount}
        />

        {/* Special Requests */}
        <Input
          label="Special Requests (Optional)"
          type="text"
          placeholder="Any special requirements..."
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e?.target?.value)}
        />

        {/* Price Summary */}
        {totalPrice > 0 && (
          <div className="bg-muted rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary">Duration:</span>
              <span className="font-medium">{selectedTimeSlots?.length} hour{selectedTimeSlots?.length > 1 ? 's' : ''}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-text-secondary">Rate:</span>
              <span className="font-medium">
                ${courts?.find(c => c?.id === selectedCourt)?.pricePerHour}/hour
              </span>
            </div>
            <hr className="my-2 border-border" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-text-primary">Total:</span>
              <span className="text-lg font-bold text-primary">${totalPrice}</span>
            </div>
          </div>
        )}

        {/* Booking Button */}
        <Button
          variant="default"
          fullWidth
          disabled={!isBookingValid}
          loading={isLoading}
          onClick={handleBooking}
          iconName="CreditCard"
          iconPosition="left"
        >
          {isLoading ? 'Processing...' : `Book Now - $${totalPrice}`}
        </Button>

        {/* Contact Info */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-text-secondary mb-2">Need help with booking?</p>
          <Button variant="ghost" size="sm" iconName="Phone" iconPosition="left">
            Call (555) 123-4567
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingWidget;