// Database service for PostgreSQL operations
// This provides a unified interface for database operations

import * as mockData from './mockData';

// Always use mock mode since we removed Supabase
const isMockMode = () => true;

class DatabaseService {
  constructor() {
    this.mockMode = isMockMode();
  }

  // Generic query method
  async query(sql, params = []) {
    if (this.mockMode) {
      // Mock implementation - return sample data based on query
      console.log('Mock query:', sql, params);
      return { rows: [], rowCount: 0 };
    }

    // In production, this would use a proper PostgreSQL client
    try {
      // This would be replaced with actual database connection
      // For now, returning mock data
      return { rows: [], rowCount: 0 };
    } catch (error) {
      console.error('Database query error:', error);
      throw error;
    }
  }

  // User operations
  async createUser(userData) {
    if (this.mockMode) {
      return mockData.createMockUser(userData);
    }

    const sql = `
      INSERT INTO user_profiles (email, password_hash, full_name, phone, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const result = await this.query(sql, [
      userData.email,
      userData.passwordHash,
      userData.fullName,
      userData.phone,
      userData.role || 'customer'
    ]);

    return result.rows[0];
  }

  async getUserByEmail(email) {
    if (this.mockMode) {
      return mockData.getMockUserByEmail(email);
    }

    const sql = 'SELECT * FROM user_profiles WHERE email = $1';
    const result = await this.query(sql, [email]);
    return result.rows[0];
  }

  async getUserById(id) {
    if (this.mockMode) {
      return mockData.getMockUserById(id);
    }

    const sql = 'SELECT * FROM user_profiles WHERE id = $1';
    const result = await this.query(sql, [id]);
    return result.rows[0];
  }

  // Venue operations
  async getVenues(filters = {}) {
    if (this.mockMode) {
      return mockData.getMockVenues(filters);
    }

    let sql = `
      SELECT 
        v.*,
        u.full_name as owner_name,
        COALESCE(AVG(r.overall_rating), 0) as average_rating,
        COUNT(r.id) as review_count
      FROM venues v
      LEFT JOIN user_profiles u ON v.owner_id = u.id
      LEFT JOIN reviews r ON v.id = r.venue_id
      WHERE v.status = 'approved'
    `;

    const params = [];
    let paramCount = 1;

    // Add filters
    if (filters.sport) {
      sql += ` AND v.id IN (
        SELECT vs.venue_id FROM venue_sports vs
        JOIN sports s ON vs.sport_id = s.id
        WHERE s.name ILIKE $${paramCount}
      )`;
      params.push(`%${filters.sport}%`);
      paramCount++;
    }

    if (filters.location) {
      sql += ` AND (v.address->>'city' ILIKE $${paramCount} OR v.address->>'state' ILIKE $${paramCount})`;
      params.push(`%${filters.location}%`);
      paramCount++;
    }

    if (filters.priceRange) {
      const [min, max] = this.parsePriceRange(filters.priceRange);
      sql += ` AND v.price_per_hour BETWEEN $${paramCount} AND $${paramCount + 1}`;
      params.push(min, max);
      paramCount += 2;
    }

    sql += ' GROUP BY v.id, u.full_name';

    // Add sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          sql += ' ORDER BY v.price_per_hour ASC';
          break;
        case 'price-high':
          sql += ' ORDER BY v.price_per_hour DESC';
          break;
        case 'rating':
          sql += ' ORDER BY average_rating DESC';
          break;
        default:
          sql += ' ORDER BY v.created_at DESC';
      }
    }

    const result = await this.query(sql, params);
    return result.rows;
  }

  async getVenueById(id) {
    if (this.mockMode) {
      return mockData.getMockVenueById(id);
    }

    const sql = `
      SELECT 
        v.*,
        u.full_name as owner_name,
        u.email as owner_email,
        u.phone as owner_phone,
        COALESCE(AVG(r.overall_rating), 0) as average_rating,
        COUNT(r.id) as review_count,
        ARRAY_AGG(DISTINCT s.name) FILTER (WHERE s.name IS NOT NULL) as sports_offered,
        ARRAY_AGG(DISTINCT a.name) FILTER (WHERE a.name IS NOT NULL) as amenities_available
      FROM venues v
      LEFT JOIN user_profiles u ON v.owner_id = u.id
      LEFT JOIN reviews r ON v.id = r.venue_id
      LEFT JOIN venue_sports vs ON v.id = vs.venue_id
      LEFT JOIN sports s ON vs.sport_id = s.id
      LEFT JOIN venue_amenities va ON v.id = va.venue_id
      LEFT JOIN amenities a ON va.amenity_id = a.id
      WHERE v.id = $1
      GROUP BY v.id, u.full_name, u.email, u.phone
    `;

    const result = await this.query(sql, [id]);
    return result.rows[0];
  }

  // Booking operations
  async createBooking(bookingData) {
    if (this.mockMode) {
      return mockData.createMockBooking(bookingData);
    }

    const sql = `
      INSERT INTO bookings (
        user_id, venue_id, sport_id, booking_date, 
        start_time, end_time, duration_hours, base_amount, notes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await this.query(sql, [
      bookingData.userId,
      bookingData.venueId,
      bookingData.sportId,
      bookingData.bookingDate,
      bookingData.startTime,
      bookingData.endTime,
      bookingData.durationHours,
      bookingData.baseAmount,
      bookingData.notes
    ]);

    return result.rows[0];
  }

  async getUserBookings(userId, filters = {}) {
    if (this.mockMode) {
      return mockData.getMockUserBookings(userId, filters);
    }

    let sql = `
      SELECT 
        b.*,
        v.name as venue_name,
        v.address as venue_address,
        s.name as sport_name
      FROM bookings b
      JOIN venues v ON b.venue_id = v.id
      LEFT JOIN sports s ON b.sport_id = s.id
      WHERE b.user_id = $1
    `;

    const params = [userId];
    let paramCount = 2;

    if (filters.status) {
      sql += ` AND b.status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    sql += ' ORDER BY b.booking_date DESC, b.start_time DESC';

    const result = await this.query(sql, params);
    return result.rows;
  }

  async getBookingById(id) {
    if (this.mockMode) {
      return mockData.getMockBookingById(id);
    }

    const sql = `
      SELECT 
        b.*,
        v.name as venue_name,
        v.address as venue_address,
        v.phone as venue_phone,
        s.name as sport_name,
        u.full_name as user_name,
        u.email as user_email
      FROM bookings b
      JOIN venues v ON b.venue_id = v.id
      JOIN user_profiles u ON b.user_id = u.id
      LEFT JOIN sports s ON b.sport_id = s.id
      WHERE b.id = $1
    `;

    const result = await this.query(sql, [id]);
    return result.rows[0];
  }

  // Review operations
  async createReview(reviewData) {
    if (this.mockMode) {
      return mockData.createMockReview(reviewData);
    }

    const sql = `
      INSERT INTO reviews (
        user_id, venue_id, booking_id, overall_rating,
        cleanliness_rating, facilities_rating, staff_rating, value_rating, comment
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const result = await this.query(sql, [
      reviewData.userId,
      reviewData.venueId,
      reviewData.bookingId,
      reviewData.overallRating,
      reviewData.cleanlinessRating,
      reviewData.facilitiesRating,
      reviewData.staffRating,
      reviewData.valueRating,
      reviewData.comment
    ]);

    return result.rows[0];
  }

  async getVenueReviews(venueId) {
    if (this.mockMode) {
      return mockData.getMockVenueReviews(venueId);
    }

    const sql = `
      SELECT 
        r.*,
        u.full_name as user_name,
        CASE WHEN r.is_anonymous THEN NULL ELSE u.avatar_url END as user_avatar
      FROM reviews r
      JOIN user_profiles u ON r.user_id = u.id
      WHERE r.venue_id = $1
      ORDER BY r.created_at DESC
    `;

    const result = await this.query(sql, [venueId]);
    return result.rows;
  }

  // Favorite operations
  async addFavorite(userId, venueId) {
    if (this.mockMode) {
      return mockData.addMockFavorite(userId, venueId);
    }

    // Use backend API instead of direct database query
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001'}/api/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, venueId }),
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to add favorite');
      }
      
      return result.favorite;
    } catch (error) {
      console.error('Error adding favorite:', error);
      throw error;
    }
  }

  async removeFavorite(userId, venueId) {
    if (this.mockMode) {
      return mockData.removeMockFavorite(userId, venueId);
    }

    // Use backend API instead of direct database query
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001'}/api/favorites`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, venueId }),
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to remove favorite');
      }
      
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      throw error;
    }
  }

  async getUserFavorites(userId) {
    if (this.mockMode) {
      return mockData.getMockUserFavorites(userId);
    }

    // Use backend API instead of direct database query
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001'}/api/favorites/${userId}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch favorites');
      }
      
      return result.favorites;
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  }

  // Notification operations
  async createNotification(notificationData) {
    if (this.mockMode) {
      return mockData.createMockNotification(notificationData);
    }

    // Use backend API instead of direct database query
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001'}/api/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to create notification');
      }
      
      return result.notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  async getUserNotifications(userId) {
    if (this.mockMode) {
      return mockData.getMockUserNotifications(userId);
    }

    // Use backend API instead of direct database query
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001'}/api/notifications/${userId}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch notifications');
      }
      
      return result.notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  async markNotificationAsRead(notificationId, userId) {
    if (this.mockMode) {
      return mockData.markMockNotificationAsRead(notificationId, userId);
    }

    // Use backend API instead of direct database query
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001'}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to mark notification as read');
      }
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(userId) {
    if (this.mockMode) {
      return mockData.markAllMockNotificationsAsRead(userId);
    }

    // Use backend API instead of direct database query
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001'}/api/notifications/read-all`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to mark all notifications as read');
      }
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId, userId) {
    if (this.mockMode) {
      return mockData.deleteMockNotification(notificationId, userId);
    }

    // Use backend API instead of direct database query
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:3001'}/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      
      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || 'Failed to delete notification');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Sports operations
  async getSports() {
    if (this.mockMode) {
      return mockData.getMockSports();
    }

    const sql = 'SELECT * FROM sports WHERE is_active = true ORDER BY name';
    const result = await this.query(sql);
    return result.rows;
  }

  // Amenities operations
  async getAmenities() {
    if (this.mockMode) {
      return mockData.getMockAmenities();
    }

    const sql = 'SELECT * FROM amenities WHERE is_active = true ORDER BY name';
    const result = await this.query(sql);
    return result.rows;
  }

  // Helper methods
  parsePriceRange(priceRange) {
    const ranges = {
      'under-20': [0, 20],
      '20-40': [20, 40],
      '40-60': [40, 60],
      'over-60': [60, 1000]
    };
    return ranges[priceRange] || [0, 1000];
  }

  // Utility methods for checking availability
  async checkVenueAvailability(venueId, date, startTime, endTime) {
    if (this.mockMode) {
      return mockData.checkMockAvailability(venueId, date, startTime, endTime);
    }

    const sql = `
      SELECT COUNT(*) as conflicts
      FROM bookings
      WHERE venue_id = $1 
      AND booking_date = $2
      AND status IN ('confirmed', 'pending')
      AND (
        ($3 >= start_time AND $3 < end_time) OR
        ($4 > start_time AND $4 <= end_time) OR
        ($3 <= start_time AND $4 >= end_time)
      )
    `;

    const result = await this.query(sql, [venueId, date, startTime, endTime]);
    return result.rows[0].conflicts === 0;
  }
}

// Export singleton instance
export const db = new DatabaseService();
export default db;
