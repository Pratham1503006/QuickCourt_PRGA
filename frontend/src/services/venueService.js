// Venue service for managing sports facilities
import { db } from './database';

// Always use mock mode since we removed Supabase
const isMockMode = () => true;

class VenueService {
  constructor() {
    this.mockMode = isMockMode();
  }

  // Get all venues with filters
  async getVenues(filters = {}) {
    try {
      const venues = await db.getVenues(filters);
      return { venues, error: null };
    } catch (error) {
      console.error('Error fetching venues:', error);
      return { venues: [], error };
    }
  }

  // Get single venue with full details
  async getVenueById(venueId) {
    try {
      const venue = await db.getVenueById(venueId);
      if (!venue) {
        throw new Error('Venue not found');
      }

      // Get additional venue data
      const [reviews, stats] = await Promise.all([
        this.getVenueReviews(venueId),
        this.getVenueStats(venueId)
      ]);

      return {
        venue: {
          ...venue,
          reviews: reviews.reviews || [],
          stats: stats.stats || {}
        },
        error: null
      };
    } catch (error) {
      console.error('Error fetching venue details:', error);
      return { venue: null, error };
    }
  }

  // Search venues with advanced filters
  async searchVenues(searchParams) {
    try {
      const {
        query,
        sport,
        location,
        sportTypes,
        venueTypes,
        amenities,
        priceRange,
        minRating,
        sortBy,
        page = 1,
        limit = 20
      } = searchParams;

      const filters = {
        query,
        sport,
        location,
        sportTypes,
        venueTypes,
        amenities,
        priceRange,
        minRating,
        sortBy,
        page,
        limit
      };

      // Get all venues first (without pagination) to get total count
      const allVenues = await db.getVenues({ ...filters, limit: 1000, page: 1 });
      const totalCount = allVenues.length;

      // Get paginated venues
      const venues = await db.getVenues(filters);
      
      return { 
        success: true,
        data: {
          venues, 
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit)
        },
        error: null 
      };
    } catch (error) {
      console.error('Error searching venues:', error);
      return { 
        success: false, 
        data: { 
          venues: [], 
          total: 0, 
          page: 1, 
          limit, 
          totalPages: 0 
        }, 
        error 
      };
    }
  }

  // Get venues near a location
  async getVenuesNearby(latitude, longitude, radius = 10) {
    try {
      if (this.mockMode) {
        // Return all venues for mock mode
        const { venues } = await this.getVenues();
        return { venues, error: null };
      }

      // In real app, use PostGIS to find nearby venues
      const sql = `
        SELECT v.*, 
               ST_Distance(v.location, ST_MakePoint($2, $1)::geography) / 1000 as distance_km
        FROM venues v
        WHERE ST_DWithin(v.location, ST_MakePoint($2, $1)::geography, $3 * 1000)
        AND v.status = 'approved'
        ORDER BY distance_km
      `;
      
      const venues = await db.query(sql, [latitude, longitude, radius]);
      return { venues: venues.rows, error: null };
    } catch (error) {
      console.error('Error finding nearby venues:', error);
      return { venues: [], error };
    }
  }

  // Get venue reviews
  async getVenueReviews(venueId) {
    try {
      const reviews = await db.getVenueReviews(venueId);
      return { reviews, error: null };
    } catch (error) {
      console.error('Error fetching venue reviews:', error);
      return { reviews: [], error };
    }
  }

  // Add venue to favorites
  async addToFavorites(userId, venueId) {
    try {
      const favorite = await db.addFavorite(userId, venueId);
      return { favorite, error: null };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { favorite: null, error };
    }
  }

  // Remove venue from favorites
  async removeFromFavorites(userId, venueId) {
    try {
      await db.removeFavorite(userId, venueId);
      return { error: null };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return { error };
    }
  }

  // Get user's favorite venues
  async getUserFavorites(userId) {
    try {
      const favorites = await db.getUserFavorites(userId);
      return { favorites, error: null };
    } catch (error) {
      console.error('Error fetching user favorites:', error);
      return { favorites: [], error };
    }
  }

  // Check if venue is favorited by user
  async isVenueFavorited(userId, venueId) {
    try {
      const { favorites } = await this.getUserFavorites(userId);
      const isFavorited = favorites.some(fav => fav.id === venueId);
      return { isFavorited, error: null };
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return { isFavorited: false, error };
    }
  }

  // Toggle venue favorite status
  async toggleFavorite(userId, venueId, isFavorited) {
    try {
      if (isFavorited) {
        const result = await this.removeFromFavorites(userId, venueId);
        return { success: !result.error, error: result.error };
      } else {
        const result = await this.addToFavorites(userId, venueId);
        return { success: !result.error, error: result.error };
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { success: false, error };
    }
  }

  // Get venue statistics
  async getVenueStats(venueId) {
    try {
      if (this.mockMode) {
        // Return mock stats
        return {
          stats: {
            totalBookings: 156,
            averageRating: 4.6,
            completionRate: 0.95,
            responseTime: '2 hours'
          },
          error: null
        };
      }

      // In real app, calculate from database
      const sql = `
        SELECT 
          COUNT(b.id) as total_bookings,
          AVG(r.overall_rating) as average_rating,
          COUNT(CASE WHEN b.status = 'completed' THEN 1 END)::float / 
          NULLIF(COUNT(CASE WHEN b.status IN ('completed', 'cancelled') THEN 1 END), 0) as completion_rate
        FROM venues v
        LEFT JOIN bookings b ON v.id = b.venue_id
        LEFT JOIN reviews r ON v.id = r.venue_id
        WHERE v.id = $1
        GROUP BY v.id
      `;

      const result = await db.query(sql, [venueId]);
      const stats = result.rows[0] || {};

      return { stats, error: null };
    } catch (error) {
      console.error('Error fetching venue stats:', error);
      return { stats: {}, error };
    }
  }

  // Get popular venues (trending)
  async getPopularVenues(limit = 10) {
    try {
      const venues = await db.getVenues({
        sortBy: 'rating',
        limit
      });

      return { venues, error: null };
    } catch (error) {
      console.error('Error fetching popular venues:', error);
      return { venues: [], error };
    }
  }

  // Get recently added venues
  async getRecentVenues(limit = 10) {
    try {
      const venues = await db.getVenues({
        sortBy: 'newest',
        limit
      });

      return { venues, error: null };
    } catch (error) {
      console.error('Error fetching recent venues:', error);
      return { venues: [], error };
    }
  }

  // Get featured venues (manually curated)
  async getFeaturedVenues(limit = 6) {
    try {
      // In real app, this would have a 'featured' flag in database
      const venues = await db.getVenues({
        sortBy: 'rating',
        limit
      });

      return { venues, error: null };
    } catch (error) {
      console.error('Error fetching featured venues:', error);
      return { venues: [], error };
    }
  }

  // Get venues by sport type
  async getVenuesBySport(sportName, limit = 20) {
    try {
      const venues = await db.getVenues({
        sport: sportName,
        limit,
        sortBy: 'rating'
      });

      return { venues, error: null };
    } catch (error) {
      console.error('Error fetching venues by sport:', error);
      return { venues: [], error };
    }
  }

  // Get available sports
  async getAvailableSports() {
    try {
      const sports = await db.getSports();
      return { sports, error: null };
    } catch (error) {
      console.error('Error fetching sports:', error);
      return { sports: [], error };
    }
  }

  // Get available amenities
  async getAvailableAmenities() {
    try {
      const amenities = await db.getAmenities();
      return { amenities, error: null };
    } catch (error) {
      console.error('Error fetching amenities:', error);
      return { amenities: [], error };
    }
  }

  // Get venue availability for a date range
  async getVenueAvailability(venueId, startDate, endDate) {
    try {
      const availability = [];
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check each day in the range
      for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
        const dateStr = date.toISOString().split('T')[0];
        
        // Get available slots for this date
        const slots = await this.getAvailableTimeSlots(venueId, dateStr);
        
        availability.push({
          date: dateStr,
          slots: slots.slots || []
        });
      }

      return { availability, error: null };
    } catch (error) {
      console.error('Error fetching venue availability:', error);
      return { availability: [], error };
    }
  }

  // Get available time slots for a specific date
  async getAvailableTimeSlots(venueId, date) {
    try {
      // Import bookingService here to avoid circular dependency
      const { bookingService } = await import('./bookingService');
      return await bookingService.getAvailableSlots(venueId, date);
    } catch (error) {
      console.error('Error fetching available time slots:', error);
      return { slots: [], error };
    }
  }

  // Get venue pricing information
  async getVenuePricing(venueId, sportId = null) {
    try {
      const venue = await db.getVenueById(venueId);
      if (!venue) {
        throw new Error('Venue not found');
      }

      let pricing = {
        basePrice: venue.pricePerHour,
        currency: 'USD', // In real app, this would be configurable
        sportSpecificPricing: {}
      };

      // Get sport-specific pricing if available
      if (this.mockMode) {
        pricing.sportSpecificPricing = {
          'Basketball': 45.00,
          'Tennis': 50.00,
          'Badminton': 40.00
        };
      } else {
        // In real app, query venue_sports table
        const sql = `
          SELECT s.name, vs.price_per_hour
          FROM venue_sports vs
          JOIN sports s ON vs.sport_id = s.id
          WHERE vs.venue_id = $1
        `;
        const result = await db.query(sql, [venueId]);
        
        result.rows.forEach(row => {
          pricing.sportSpecificPricing[row.name] = row.price_per_hour;
        });
      }

      return { pricing, error: null };
    } catch (error) {
      console.error('Error fetching venue pricing:', error);
      return { pricing: null, error };
    }
  }

  // Helper method to format venue data for display
  formatVenueForDisplay(venue) {
    return {
      ...venue,
      formattedPrice: `$${venue.pricePerHour}/hour`,
      formattedRating: venue.averageRating?.toFixed(1) || 'No rating',
      formattedAddress: this.formatAddress(venue.address),
      displayImage: venue.images?.[0] || '/assets/images/no_image.png'
    };
  }

  // Helper method to format address
  formatAddress(address) {
    if (typeof address === 'string') return address;
    
    const { street, city, state, zip } = address;
    const parts = [street, city, state, zip].filter(Boolean);
    return parts.join(', ');
  }

  // Filter and sort venues
  applyFiltersAndSorting(venues, filters) {
    let filtered = [...venues];

    // Apply filters
    if (filters.priceRange) {
      const [min, max] = this.parsePriceRange(filters.priceRange);
      filtered = filtered.filter(venue => 
        venue.pricePerHour >= min && venue.pricePerHour <= max
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(venue => 
        venue.averageRating >= parseInt(filters.rating)
      );
    }

    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(venue =>
        filters.amenities.every(amenity =>
          venue.amenitiesAvailable?.includes(amenity)
        )
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.pricePerHour - a.pricePerHour);
          break;
        case 'rating':
          filtered.sort((a, b) => b.averageRating - a.averageRating);
          break;
        case 'newest':
          filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          // Keep original order for relevance
          break;
      }
    }

    return filtered;
  }

  // Helper method to parse price range
  parsePriceRange(priceRange) {
    const ranges = {
      'under-20': [0, 20],
      '20-40': [20, 40],
      '40-60': [40, 60],
      'over-60': [60, 1000]
    };
    return ranges[priceRange] || [0, 1000];
  }
}

// Export singleton instance
export const venueService = new VenueService();
export default venueService;
