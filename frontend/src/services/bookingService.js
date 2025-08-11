// Booking service for managing reservations and availability
import { db } from './database';

// Always use mock mode since we removed Supabase
const isMockMode = () => true;

class BookingService {
  constructor() {
    this.mockMode = isMockMode();
  }

  // Create a new booking
  async createBooking(bookingData) {
    try {
      // Validate booking data
      this.validateBookingData(bookingData);

      // Check venue availability
      const isAvailable = await this.checkAvailability(
        bookingData.venueId,
        bookingData.bookingDate,
        bookingData.startTime,
        bookingData.endTime
      );

      if (!isAvailable) {
        throw new Error('Selected time slot is not available');
      }

      // Calculate pricing
      const pricing = await this.calculatePricing(bookingData);
      
      const bookingWithPricing = {
        ...bookingData,
        baseAmount: pricing.baseAmount,
        additionalCharges: pricing.additionalCharges,
        discountAmount: pricing.discountAmount,
        totalAmount: pricing.totalAmount,
        durationHours: this.calculateDuration(bookingData.startTime, bookingData.endTime)
      };

      // Create the booking
      const booking = await db.createBooking(bookingWithPricing);
      
      // Send confirmation notification (in real app)
      await this.sendBookingNotification(booking, 'created');

      return { booking, error: null };
    } catch (error) {
      console.error('Error creating booking:', error);
      return { booking: null, error };
    }
  }

  // Get user's bookings with optional filters
  async getUserBookings(userId, filters = {}) {
    try {
      const bookings = await db.getUserBookings(userId, filters);
      return { bookings, error: null };
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      return { bookings: [], error };
    }
  }

  // Get specific booking details
  async getBookingById(bookingId) {
    try {
      const booking = await db.getBookingById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }
      return { booking, error: null };
    } catch (error) {
      console.error('Error fetching booking:', error);
      return { booking: null, error };
    }
  }

  // Update booking status
  async updateBookingStatus(bookingId, status, userId, reason = null) {
    try {
      const booking = await db.getBookingById(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Check permissions
      if (booking.userId !== userId && booking.venue?.ownerId !== userId) {
        throw new Error('Not authorized to update this booking');
      }

      // Validate status transition
      if (!this.isValidStatusTransition(booking.status, status)) {
        throw new Error(`Cannot change status from ${booking.status} to ${status}`);
      }

      const updateData = {
        status,
        updatedAt: new Date().toISOString()
      };

      if (status === 'cancelled') {
        updateData.cancellationReason = reason;
        updateData.cancelledAt = new Date().toISOString();
      } else if (status === 'confirmed') {
        updateData.confirmedAt = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.completedAt = new Date().toISOString();
      }

      // In a real app, this would update the database
      const updatedBooking = { ...booking, ...updateData };
      
      // Send notification
      await this.sendBookingNotification(updatedBooking, status);

      return { booking: updatedBooking, error: null };
    } catch (error) {
      console.error('Error updating booking status:', error);
      return { booking: null, error };
    }
  }

  // Check availability for a specific venue and time slot
  async checkAvailability(venueId, date, startTime, endTime) {
    try {
      return await db.checkVenueAvailability(venueId, date, startTime, endTime);
    } catch (error) {
      console.error('Error checking availability:', error);
      return false;
    }
  }

  // Get available time slots for a venue on a specific date
  async getAvailableSlots(venueId, date) {
    try {
      const venue = await db.getVenueById(venueId);
      if (!venue) {
        throw new Error('Venue not found');
      }

      // Get the day of week
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
      const operatingHours = venue.operatingHours?.[dayOfWeek];
      
      if (!operatingHours) {
        return { slots: [], error: null };
      }

      // Generate time slots (1-hour intervals)
      const slots = this.generateTimeSlots(operatingHours.open, operatingHours.close);
      
      // Check availability for each slot
      const availableSlots = [];
      for (const slot of slots) {
        const isAvailable = await this.checkAvailability(
          venueId,
          date,
          slot.start,
          slot.end
        );
        
        availableSlots.push({
          ...slot,
          available: isAvailable
        });
      }

      return { slots: availableSlots, error: null };
    } catch (error) {
      console.error('Error getting available slots:', error);
      return { slots: [], error };
    }
  }

  // Calculate booking pricing
  async calculatePricing(bookingData) {
    try {
      const venue = await db.getVenueById(bookingData.venueId);
      if (!venue) {
        throw new Error('Venue not found');
      }

      const duration = this.calculateDuration(bookingData.startTime, bookingData.endTime);
      let baseAmount = venue.pricePerHour * duration;

      // Sport-specific pricing (if available)
      if (bookingData.sportId) {
        // In a real app, get sport-specific pricing from venue_sports table
        // For now, use base venue pricing
      }

      // Calculate additional charges
      let additionalCharges = 0;
      if (bookingData.amenities) {
        // Add charges for paid amenities
        // This would query venue_amenities table in real app
      }

      // Calculate discounts
      let discountAmount = 0;
      if (bookingData.discountCode) {
        // Apply discount codes
        // This would query a discounts table in real app
      }

      const totalAmount = baseAmount + additionalCharges - discountAmount;

      return {
        baseAmount,
        additionalCharges,
        discountAmount,
        totalAmount: Math.max(0, totalAmount) // Ensure non-negative
      };
    } catch (error) {
      console.error('Error calculating pricing:', error);
      throw error;
    }
  }

  // Helper methods
  validateBookingData(data) {
    const required = ['userId', 'venueId', 'bookingDate', 'startTime', 'endTime'];
    for (const field of required) {
      if (!data[field]) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate date is not in the past
    const bookingDate = new Date(data.bookingDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (bookingDate < today) {
      throw new Error('Cannot book dates in the past');
    }

    // Validate time format and logic
    if (data.startTime >= data.endTime) {
      throw new Error('End time must be after start time');
    }

    // Validate minimum booking duration (e.g., 1 hour)
    const duration = this.calculateDuration(data.startTime, data.endTime);
    if (duration < 1) {
      throw new Error('Minimum booking duration is 1 hour');
    }
  }

  calculateDuration(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end - start) / (1000 * 60 * 60); // Convert to hours
  }

  generateTimeSlots(openTime, closeTime, intervalHours = 1) {
    const slots = [];
    const start = new Date(`2000-01-01T${openTime}`);
    const end = new Date(`2000-01-01T${closeTime}`);
    
    let current = new Date(start);
    
    while (current < end) {
      const slotStart = current.toTimeString().substring(0, 5);
      current.setHours(current.getHours() + intervalHours);
      
      if (current <= end) {
        const slotEnd = current.toTimeString().substring(0, 5);
        slots.push({
          start: slotStart,
          end: slotEnd,
          duration: intervalHours
        });
      }
    }
    
    return slots;
  }

  isValidStatusTransition(currentStatus, newStatus) {
    const validTransitions = {
      pending: ['confirmed', 'cancelled'],
      confirmed: ['completed', 'cancelled'],
      cancelled: [], // Cannot change from cancelled
      completed: [] // Cannot change from completed
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  async sendBookingNotification(booking, action) {
    try {
      // In a real app, this would send emails/SMS notifications
      console.log(`Booking notification: ${action}`, booking);
      
      let title, message;
      
      switch (action) {
        case 'created':
          title = 'Booking Created';
          message = `Your booking at ${booking.venueName} is pending confirmation.`;
          break;
        case 'confirmed':
          title = 'Booking Confirmed';
          message = `Your booking at ${booking.venueName} has been confirmed for ${booking.bookingDate}.`;
          break;
        case 'cancelled':
          title = 'Booking Cancelled';
          message = `Your booking at ${booking.venueName} has been cancelled.`;
          break;
        case 'completed':
          title = 'Booking Completed';
          message = `Thanks for visiting ${booking.venueName}! Please leave a review.`;
          break;
        default:
          return;
      }

      // In mock mode, just log the notification
      if (this.mockMode) {
        console.log('Mock notification:', { title, message });
        return;
      }

      // In real app, save to notifications table and send via email/SMS
      // await db.createNotification({
      //   userId: booking.userId,
      //   title,
      //   message,
      //   type: 'booking',
      //   data: { bookingId: booking.id }
      // });

    } catch (error) {
      console.error('Error sending booking notification:', error);
    }
  }

  // Get booking statistics for dashboard
  async getBookingStats(userId, userRole = 'customer') {
    try {
      let stats = {
        total: 0,
        confirmed: 0,
        pending: 0,
        cancelled: 0,
        completed: 0
      };

      if (userRole === 'customer') {
        const { bookings } = await this.getUserBookings(userId);
        stats.total = bookings.length;
        
        bookings.forEach(booking => {
          stats[booking.status] = (stats[booking.status] || 0) + 1;
        });
      }

      return { stats, error: null };
    } catch (error) {
      console.error('Error getting booking stats:', error);
      return { stats: {}, error };
    }
  }
}

// Export singleton instance
export const bookingService = new BookingService();
export default bookingService;
