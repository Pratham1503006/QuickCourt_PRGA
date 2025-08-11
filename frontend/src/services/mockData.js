// Mock data service for development and testing
// This provides realistic sample data when not connected to a real database

export const mockUsers = [
  {
    id: 'user-1',
    email: 'admin@quickcourt.com',
    passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewf3WAoyhfqg8/7q',
    fullName: 'Admin User',
    phone: '+1234567890',
    role: 'admin',
    avatarUrl: null,
    isActive: true,
    emailVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-2',
    email: 'john.smith@example.com',
    passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewf3WAoyhfqg8/7q',
    fullName: 'John Smith',
    phone: '+1234567891',
    role: 'venue_owner',
    avatarUrl: null,
    isActive: true,
    emailVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-3',
    email: 'alice.wilson@example.com',
    passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/Lewf3WAoyhfqg8/7q',
    fullName: 'Alice Wilson',
    phone: '+1234567892',
    role: 'customer',
    avatarUrl: null,
    isActive: true,
    emailVerified: true,
    createdAt: '2025-01-01T00:00:00Z'
  }
];

export const mockVenues = [
  {
    id: 'venue-1',
    ownerId: 'user-2',
    name: 'Elite Sports Complex',
    description: 'Premium multi-sport facility with state-of-the-art equipment and professional-grade courts.',
    address: {
      street: '123 Sports Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA'
    },
    location: { lat: 40.7128, lng: -74.0059 },
    phone: '+1234567890',
    email: 'info@elitesports.com',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop'
    ],
    status: 'approved',
    pricePerHour: 45.00,
    operatingHours: {
      monday: { open: '06:00', close: '23:00' },
      tuesday: { open: '06:00', close: '23:00' },
      wednesday: { open: '06:00', close: '23:00' },
      thursday: { open: '06:00', close: '23:00' },
      friday: { open: '06:00', close: '23:00' },
      saturday: { open: '08:00', close: '22:00' },
      sunday: { open: '08:00', close: '22:00' }
    },
    capacity: 50,
    averageRating: 4.8,
    reviewCount: 124,
    sportsOffered: ['Basketball', 'Tennis', 'Badminton'],
    amenitiesAvailable: ['Parking', 'Changing Rooms', 'Equipment Rental', 'Refreshments', 'Shower', 'WiFi', 'Air Conditioning'],
    ownerName: 'John Smith',
    ownerEmail: 'john.smith@example.com',
    ownerPhone: '+1234567891'
  },
  {
    id: 'venue-2',
    ownerId: 'user-2',
    name: 'Riverside Tennis Club',
    description: 'Scenic tennis courts by the riverside with professional coaching available.',
    address: {
      street: '456 River Road',
      city: 'New York',
      state: 'NY',
      zip: '10002',
      country: 'USA'
    },
    location: { lat: 40.7200, lng: -74.0020 },
    phone: '+1234567891',
    email: 'contact@riversidetennis.com',
    images: [
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=600&fit=crop'
    ],
    status: 'approved',
    pricePerHour: 35.00,
    operatingHours: {
      monday: { open: '07:00', close: '22:00' },
      tuesday: { open: '07:00', close: '22:00' },
      wednesday: { open: '07:00', close: '22:00' },
      thursday: { open: '07:00', close: '22:00' },
      friday: { open: '07:00', close: '22:00' },
      saturday: { open: '08:00', close: '21:00' },
      sunday: { open: '08:00', close: '21:00' }
    },
    capacity: 20,
    averageRating: 4.6,
    reviewCount: 89,
    sportsOffered: ['Tennis', 'Squash'],
    amenitiesAvailable: ['Parking', 'Changing Rooms', 'Refreshments', 'Lockers'],
    ownerName: 'John Smith',
    ownerEmail: 'john.smith@example.com',
    ownerPhone: '+1234567891'
  },
  {
    id: 'venue-3',
    ownerId: 'user-2',
    name: 'Urban Basketball Arena',
    description: 'Indoor basketball courts with professional lighting and sound system.',
    address: {
      street: '789 Urban St',
      city: 'New York',
      state: 'NY',
      zip: '10003',
      country: 'USA'
    },
    location: { lat: 40.7300, lng: -73.9900 },
    phone: '+1234567892',
    email: 'bookings@urbanbasketball.com',
    images: [
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=600&fit=crop'
    ],
    status: 'approved',
    pricePerHour: 30.00,
    operatingHours: {
      monday: { open: '06:00', close: '24:00' },
      tuesday: { open: '06:00', close: '24:00' },
      wednesday: { open: '06:00', close: '24:00' },
      thursday: { open: '06:00', close: '24:00' },
      friday: { open: '06:00', close: '24:00' },
      saturday: { open: '08:00', close: '24:00' },
      sunday: { open: '08:00', close: '22:00' }
    },
    capacity: 30,
    averageRating: 4.4,
    reviewCount: 156,
    sportsOffered: ['Basketball', 'Volleyball'],
    amenitiesAvailable: ['Parking', 'Changing Rooms', 'Equipment Rental', 'Security'],
    ownerName: 'John Smith',
    ownerEmail: 'john.smith@example.com',
    ownerPhone: '+1234567891'
  },
  {
    id: 'venue-4',
    ownerId: 'user-2',
    name: 'AquaFit Swimming Center',
    description: 'State-of-the-art swimming facility with Olympic-sized pool and aqua fitness classes.',
    address: {
      street: '321 Wellness Blvd',
      city: 'New York',
      state: 'NY',
      zip: '10004',
      country: 'USA'
    },
    location: { lat: 40.7180, lng: -74.0050 },
    phone: '+1234567893',
    email: 'info@aquafitcenter.com',
    images: [
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=800&h=600&fit=crop'
    ],
    status: 'approved',
    pricePerHour: 25.00,
    operatingHours: {
      monday: { open: '05:00', close: '22:00' },
      tuesday: { open: '05:00', close: '22:00' },
      wednesday: { open: '05:00', close: '22:00' },
      thursday: { open: '05:00', close: '22:00' },
      friday: { open: '05:00', close: '22:00' },
      saturday: { open: '07:00', close: '21:00' },
      sunday: { open: '07:00', close: '20:00' }
    },
    capacity: 40,
    averageRating: 4.7,
    reviewCount: 203,
    sportsOffered: ['Swimming', 'Water Aerobics'],
    amenitiesAvailable: ['Parking', 'Changing Rooms', 'Shower', 'Lockers', 'Refreshments'],
    ownerName: 'Sarah Johnson',
    ownerEmail: 'sarah@aquafitcenter.com',
    ownerPhone: '+1234567893'
  },
  {
    id: 'venue-5',
    ownerId: 'user-2',
    name: 'Premier Badminton Hall',
    description: 'Professional badminton courts with international-standard facilities.',
    address: {
      street: '555 Sport Center Dr',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11201',
      country: 'USA'
    },
    location: { lat: 40.6892, lng: -73.9442 },
    phone: '+1234567894',
    email: 'contact@premierbadminton.com',
    images: [
      'https://images.unsplash.com/photo-1594736797933-d0d4a7c65d8e?w=800&h=600&fit=crop'
    ],
    status: 'approved',
    pricePerHour: 28.00,
    operatingHours: {
      monday: { open: '06:00', close: '23:00' },
      tuesday: { open: '06:00', close: '23:00' },
      wednesday: { open: '06:00', close: '23:00' },
      thursday: { open: '06:00', close: '23:00' },
      friday: { open: '06:00', close: '23:00' },
      saturday: { open: '08:00', close: '22:00' },
      sunday: { open: '08:00', close: '21:00' }
    },
    capacity: 25,
    averageRating: 4.5,
    reviewCount: 67,
    sportsOffered: ['Badminton', 'Table Tennis'],
    amenitiesAvailable: ['Changing Rooms', 'Equipment Rental', 'Air Conditioning'],
    ownerName: 'Mike Chen',
    ownerEmail: 'mike@premierbadminton.com',
    ownerPhone: '+1234567894'
  },
  {
    id: 'venue-6',
    ownerId: 'user-2',
    name: 'FlexFit Gym & Courts',
    description: 'Multi-purpose fitness facility with gym equipment and sports courts.',
    address: {
      street: '888 Fitness Way',
      city: 'Manhattan',
      state: 'NY',
      zip: '10005',
      country: 'USA'
    },
    location: { lat: 40.7400, lng: -74.0100 },
    phone: '+1234567895',
    email: 'info@flexfitgym.com',
    images: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop'
    ],
    status: 'approved',
    pricePerHour: 40.00,
    operatingHours: {
      monday: { open: '05:00', close: '24:00' },
      tuesday: { open: '05:00', close: '24:00' },
      wednesday: { open: '05:00', close: '24:00' },
      thursday: { open: '05:00', close: '24:00' },
      friday: { open: '05:00', close: '24:00' },
      saturday: { open: '06:00', close: '23:00' },
      sunday: { open: '07:00', close: '22:00' }
    },
    capacity: 60,
    averageRating: 4.3,
    reviewCount: 91,
    sportsOffered: ['Gym', 'Basketball', 'Volleyball'],
    amenitiesAvailable: ['Parking', 'Changing Rooms', 'Equipment Rental', 'Refreshments', 'Shower', 'WiFi'],
    ownerName: 'Alex Rodriguez',
    ownerEmail: 'alex@flexfitgym.com',
    ownerPhone: '+1234567895'
  },
  {
    id: 'venue-7',
    ownerId: 'user-2',
    name: 'Cricket Ground Central',
    description: 'Professional cricket ground with excellent pitch conditions and facilities.',
    address: {
      street: '777 Cricket Lane',
      city: 'Queens',
      state: 'NY',
      zip: '11375',
      country: 'USA'
    },
    location: { lat: 40.7282, lng: -73.7949 },
    phone: '+1234567896',
    email: 'bookings@cricketcentral.com',
    images: [
      'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=800&h=600&fit=crop'
    ],
    status: 'approved',
    pricePerHour: 55.00,
    operatingHours: {
      monday: { open: '08:00', close: '20:00' },
      tuesday: { open: '08:00', close: '20:00' },
      wednesday: { open: '08:00', close: '20:00' },
      thursday: { open: '08:00', close: '20:00' },
      friday: { open: '08:00', close: '20:00' },
      saturday: { open: '07:00', close: '21:00' },
      sunday: { open: '07:00', close: '21:00' }
    },
    capacity: 80,
    averageRating: 4.6,
    reviewCount: 78,
    sportsOffered: ['Cricket', 'Football'],
    amenitiesAvailable: ['Parking', 'Changing Rooms', 'Refreshments', 'Equipment Rental'],
    ownerName: 'Raj Patel',
    ownerEmail: 'raj@cricketcentral.com',
    ownerPhone: '+1234567896'
  },
  {
    id: 'venue-8',
    ownerId: 'user-2',
    name: 'Multi-Sport Arena',
    description: 'Versatile sports facility accommodating multiple sports with modern amenities.',
    address: {
      street: '999 Recreation Rd',
      city: 'Bronx',
      state: 'NY',
      zip: '10451',
      country: 'USA'
    },
    location: { lat: 40.8176, lng: -73.9182 },
    phone: '+1234567897',
    email: 'info@multisportarena.com',
    images: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop'
    ],
    status: 'approved',
    pricePerHour: 38.00,
    operatingHours: {
      monday: { open: '06:00', close: '23:00' },
      tuesday: { open: '06:00', close: '23:00' },
      wednesday: { open: '06:00', close: '23:00' },
      thursday: { open: '06:00', close: '23:00' },
      friday: { open: '06:00', close: '23:00' },
      saturday: { open: '07:00', close: '22:00' },
      sunday: { open: '08:00', close: '21:00' }
    },
    capacity: 45,
    averageRating: 4.7,
    reviewCount: 142,
    sportsOffered: ['Basketball', 'Tennis', 'Badminton', 'Volleyball'],
    amenitiesAvailable: ['Parking', 'Changing Rooms', 'Equipment Rental', 'Refreshments', 'WiFi', 'Security'],
    ownerName: 'Lisa Kim',
    ownerEmail: 'lisa@multisportarena.com',
    ownerPhone: '+1234567897'
  },
  {
    id: 'venue-9',
    ownerId: 'user-2',
    name: 'Outdoor Football Fields',
    description: 'Natural grass football fields with professional markings and lighting.',
    address: {
      street: '111 Sports Park Ave',
      city: 'Staten Island',
      state: 'NY',
      zip: '10314',
      country: 'USA'
    },
    location: { lat: 40.5795, lng: -74.1502 },
    phone: '+1234567898',
    email: 'bookings@footballfields.com',
    images: [
      'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&h=600&fit=crop'
    ],
    status: 'approved',
    pricePerHour: 32.00,
    operatingHours: {
      monday: { open: '07:00', close: '21:00' },
      tuesday: { open: '07:00', close: '21:00' },
      wednesday: { open: '07:00', close: '21:00' },
      thursday: { open: '07:00', close: '21:00' },
      friday: { open: '07:00', close: '21:00' },
      saturday: { open: '06:00', close: '22:00' },
      sunday: { open: '06:00', close: '22:00' }
    },
    capacity: 22,
    averageRating: 4.2,
    reviewCount: 95,
    sportsOffered: ['Football', 'Cricket'],
    amenitiesAvailable: ['Parking', 'First Aid'],
    ownerName: 'Carlos Martinez',
    ownerEmail: 'carlos@footballfields.com',
    ownerPhone: '+1234567898'
  },
  {
    id: 'venue-10',
    ownerId: 'user-2',
    name: 'City Squash Club',
    description: 'Premium squash facility with glass-backed courts and professional coaching.',
    address: {
      street: '222 Squash Ct',
      city: 'Manhattan',
      state: 'NY',
      zip: '10006',
      country: 'USA'
    },
    location: { lat: 40.7089, lng: -74.0131 },
    phone: '+1234567899',
    email: 'info@citysquash.com',
    images: [
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&h=600&fit=crop'
    ],
    status: 'approved',
    pricePerHour: 50.00,
    operatingHours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '08:00', close: '20:00' },
      sunday: { open: '08:00', close: '19:00' }
    },
    capacity: 15,
    averageRating: 4.9,
    reviewCount: 134,
    sportsOffered: ['Squash'],
    amenitiesAvailable: ['Parking', 'Changing Rooms', 'Shower', 'Equipment Rental', 'Refreshments', 'Air Conditioning'],
    ownerName: 'Emma Wilson',
    ownerEmail: 'emma@citysquash.com',
    ownerPhone: '+1234567899'
  },
  {
    id: 'venue-11',
    ownerId: 'user-2',
    name: 'Downtown Volleyball Center',
    description: 'Indoor and outdoor volleyball courts for recreational and competitive play.',
    address: {
      street: '333 Volleyball Dr',
      city: 'Manhattan',
      state: 'NY',
      zip: '10007',
      country: 'USA'
    },
    location: { lat: 40.7150, lng: -74.0090 },
    phone: '+1234567800',
    email: 'play@volleyballcenter.com',
    images: [
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&h=600&fit=crop'
    ],
    status: 'approved',
    pricePerHour: 35.00,
    operatingHours: {
      monday: { open: '07:00', close: '22:00' },
      tuesday: { open: '07:00', close: '22:00' },
      wednesday: { open: '07:00', close: '22:00' },
      thursday: { open: '07:00', close: '22:00' },
      friday: { open: '07:00', close: '22:00' },
      saturday: { open: '08:00', close: '21:00' },
      sunday: { open: '09:00', close: '20:00' }
    },
    capacity: 35,
    averageRating: 4.4,
    reviewCount: 88,
    sportsOffered: ['Volleyball', 'Beach Volleyball'],
    amenitiesAvailable: ['Parking', 'Changing Rooms', 'Equipment Rental', 'Refreshments'],
    ownerName: 'Jake Thompson',
    ownerEmail: 'jake@volleyballcenter.com',
    ownerPhone: '+1234567800'
  },
  {
    id: 'venue-12',
    ownerId: 'user-2',
    name: 'Table Tennis Academy',
    description: 'Professional table tennis facility with tournament-grade tables and coaching.',
    address: {
      street: '444 Ping Pong Way',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11202',
      country: 'USA'
    },
    location: { lat: 40.6944, lng: -73.9865 },
    phone: '+1234567801',
    email: 'academy@tabletennis.com',
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800&h=600&fit=crop'
    ],
    status: 'approved',
    pricePerHour: 22.00,
    operatingHours: {
      monday: { open: '10:00', close: '22:00' },
      tuesday: { open: '10:00', close: '22:00' },
      wednesday: { open: '10:00', close: '22:00' },
      thursday: { open: '10:00', close: '22:00' },
      friday: { open: '10:00', close: '22:00' },
      saturday: { open: '09:00', close: '21:00' },
      sunday: { open: '10:00', close: '20:00' }
    },
    capacity: 20,
    averageRating: 4.6,
    reviewCount: 72,
    sportsOffered: ['Table Tennis'],
    amenitiesAvailable: ['Air Conditioning', 'Equipment Rental', 'Lockers', 'WiFi'],
    ownerName: 'Wei Zhang',
    ownerEmail: 'wei@tabletennis.com',
    ownerPhone: '+1234567801'
  }
];

export const mockSports = [
  { id: 'sport-1', name: 'Basketball', category: 'Indoor', description: 'Fast-paced team sport played on a court', iconUrl: 'basketball' },
  { id: 'sport-2', name: 'Tennis', category: 'Indoor/Outdoor', description: 'Racket sport played individually or in pairs', iconUrl: 'tennis' },
  { id: 'sport-3', name: 'Football', category: 'Outdoor', description: 'Popular team sport played on a large field', iconUrl: 'football' },
  { id: 'sport-4', name: 'Swimming', category: 'Indoor/Outdoor', description: 'Water-based sport and exercise', iconUrl: 'swimming' },
  { id: 'sport-5', name: 'Badminton', category: 'Indoor', description: 'Racket sport played with a shuttlecock', iconUrl: 'badminton' },
  { id: 'sport-6', name: 'Cricket', category: 'Outdoor', description: 'Bat and ball sport played between two teams', iconUrl: 'cricket' },
  { id: 'sport-7', name: 'Volleyball', category: 'Indoor/Outdoor', description: 'Team sport played with a net', iconUrl: 'volleyball' },
  { id: 'sport-8', name: 'Table Tennis', category: 'Indoor', description: 'Paddle sport played on a table with a net', iconUrl: 'table-tennis' },
  { id: 'sport-9', name: 'Squash', category: 'Indoor', description: 'Racket sport played in a four-walled court', iconUrl: 'squash' },
  { id: 'sport-10', name: 'Gym', category: 'Indoor', description: 'Fitness and strength training facility', iconUrl: 'gym' }
];

export const mockAmenities = [
  { id: 'amenity-1', name: 'Parking', description: 'Free parking available', icon: 'car' },
  { id: 'amenity-2', name: 'Changing Rooms', description: 'Clean changing facilities', icon: 'shirt' },
  { id: 'amenity-3', name: 'Equipment Rental', description: 'Sports equipment available for rent', icon: 'dumbbell' },
  { id: 'amenity-4', name: 'Refreshments', description: 'Food and drinks available', icon: 'coffee' },
  { id: 'amenity-5', name: 'WiFi', description: 'Free wireless internet', icon: 'wifi' },
  { id: 'amenity-6', name: 'Air Conditioning', description: 'Climate controlled environment', icon: 'snowflake' },
  { id: 'amenity-7', name: 'Lockers', description: 'Secure storage lockers', icon: 'lock' },
  { id: 'amenity-8', name: 'Shower', description: 'Shower facilities available', icon: 'shower' },
  { id: 'amenity-9', name: 'First Aid', description: 'First aid kit and trained staff', icon: 'plus-circle' },
  { id: 'amenity-10', name: 'Security', description: '24/7 security monitoring', icon: 'shield' }
];

export const mockBookings = [
  {
    id: 'booking-1',
    userId: 'user-3',
    venueId: 'venue-1',
    sportId: 'sport-1',
    bookingDate: '2025-08-15',
    startTime: '10:00',
    endTime: '12:00',
    durationHours: 2.0,
    baseAmount: 90.00,
    totalAmount: 90.00,
    status: 'confirmed',
    notes: 'Team practice session',
    venueName: 'Elite Sports Complex',
    venueAddress: { street: '123 Sports Ave', city: 'New York', state: 'NY' },
    sportName: 'Basketball',
    userName: 'Alice Wilson',
    confirmedAt: '2025-08-10T10:00:00Z',
    createdAt: '2025-08-10T09:00:00Z'
  },
  {
    id: 'booking-2',
    userId: 'user-3',
    venueId: 'venue-2',
    sportId: 'sport-2',
    bookingDate: '2025-08-20',
    startTime: '14:00',
    endTime: '16:00',
    durationHours: 2.0,
    baseAmount: 70.00,
    totalAmount: 70.00,
    status: 'pending',
    notes: 'Singles match',
    venueName: 'Riverside Tennis Club',
    venueAddress: { street: '456 River Road', city: 'New York', state: 'NY' },
    sportName: 'Tennis',
    userName: 'Alice Wilson',
    createdAt: '2025-08-11T14:00:00Z'
  }
];

export const mockReviews = [
  {
    id: 'review-1',
    userId: 'user-3',
    venueId: 'venue-1',
    bookingId: 'booking-1',
    overallRating: 5,
    cleanlinessRating: 5,
    facilitiesRating: 5,
    staffRating: 4,
    valueRating: 4,
    comment: 'Excellent facilities and well-maintained courts. Staff was very helpful!',
    userName: 'Alice Wilson',
    userAvatar: null,
    isAnonymous: false,
    createdAt: '2025-08-16T10:00:00Z'
  },
  {
    id: 'review-2',
    userId: 'user-3',
    venueId: 'venue-2',
    bookingId: 'booking-2',
    overallRating: 4,
    cleanlinessRating: 4,
    facilitiesRating: 5,
    staffRating: 5,
    valueRating: 4,
    comment: 'Beautiful location by the river. Great tennis courts and friendly staff.',
    userName: 'Alice Wilson',
    userAvatar: null,
    isAnonymous: false,
    createdAt: '2025-08-21T16:00:00Z'
  }
];

export const mockFavorites = [
  { id: 'favorite-1', userId: 'user-3', venueId: 'venue-1', createdAt: '2025-08-01T00:00:00Z' },
  { id: 'favorite-2', userId: 'user-3', venueId: 'venue-2', createdAt: '2025-08-02T00:00:00Z' }
];

// Helper functions for mock operations
export const createMockUser = (userData) => {
  const newUser = {
    id: `user-${Date.now()}`,
    email: userData.email,
    passwordHash: userData.passwordHash,
    fullName: userData.fullName,
    phone: userData.phone,
    role: userData.role || 'customer',
    avatarUrl: null,
    isActive: true,
    emailVerified: false,
    createdAt: new Date().toISOString()
  };
  
  mockUsers.push(newUser);
  return newUser;
};

export const getMockUserByEmail = (email) => {
  return mockUsers.find(user => user.email === email);
};

export const getMockUserById = (id) => {
  return mockUsers.find(user => user.id === id);
};

export const getMockVenues = (filters = {}) => {
  let venues = [...mockVenues];

  // Apply text search filter (searches name, description, location, and sports)
  if (filters.query && filters.query.trim()) {
    const searchTerm = filters.query.toLowerCase().trim();
    venues = venues.filter(venue => {
      const searchFields = [
        venue.name,
        venue.description,
        venue.address.city,
        venue.address.state,
        ...venue.sportsOffered,
        ...venue.amenitiesAvailable
      ].join(' ').toLowerCase();
      
      return searchFields.includes(searchTerm);
    });
  }

  // Apply sport filter
  if (filters.sport && filters.sport.trim()) {
    venues = venues.filter(venue => 
      venue.sportsOffered.some(sport => 
        sport.toLowerCase().includes(filters.sport.toLowerCase())
      )
    );
  }

  // Apply location filter
  if (filters.location && filters.location.trim()) {
    venues = venues.filter(venue => {
      const locationTerms = [
        venue.address.city,
        venue.address.state,
        venue.address.street
      ].join(' ').toLowerCase();
      
      return locationTerms.includes(filters.location.toLowerCase());
    });
  }

  // Apply price range filter
  if (filters.priceRange) {
    const [min, max] = parsePriceRange(filters.priceRange);
    venues = venues.filter(venue => 
      venue.pricePerHour >= min && venue.pricePerHour <= max
    );
  }

  // Apply sport types filter (from advanced filters)
  if (filters.sportTypes && filters.sportTypes.length > 0) {
    venues = venues.filter(venue => 
      filters.sportTypes.some(sportType =>
        venue.sportsOffered.some(sport =>
          sport.toLowerCase() === sportType.toLowerCase()
        )
      )
    );
  }

  // Apply amenities filter
  if (filters.amenities && filters.amenities.length > 0) {
    venues = venues.filter(venue => 
      filters.amenities.every(amenity =>
        venue.amenitiesAvailable.some(available =>
          available.toLowerCase() === amenity.toLowerCase()
        )
      )
    );
  }

  // Apply minimum rating filter
  if (filters.minRating) {
    venues = venues.filter(venue => 
      venue.averageRating >= parseFloat(filters.minRating)
    );
  }

  // Apply sorting
  if (filters.sortBy) {
    switch (filters.sortBy) {
      case 'price-low':
        venues.sort((a, b) => a.pricePerHour - b.pricePerHour);
        break;
      case 'price-high':
        venues.sort((a, b) => b.pricePerHour - a.pricePerHour);
        break;
      case 'rating':
        venues.sort((a, b) => b.averageRating - a.averageRating);
        break;
      case 'name':
        venues.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        // Simulate newest by mixing up the order
        venues.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'relevance':
      default:
        // For relevance, prioritize exact matches in name/sports
        if (filters.query) {
          const searchTerm = filters.query.toLowerCase();
          venues.sort((a, b) => {
            const aNameMatch = a.name.toLowerCase().includes(searchTerm) ? 1 : 0;
            const bNameMatch = b.name.toLowerCase().includes(searchTerm) ? 1 : 0;
            const aSportMatch = a.sportsOffered.some(sport => 
              sport.toLowerCase().includes(searchTerm)) ? 1 : 0;
            const bSportMatch = b.sportsOffered.some(sport => 
              sport.toLowerCase().includes(searchTerm)) ? 1 : 0;
            
            const aScore = aNameMatch * 3 + aSportMatch * 2 + a.averageRating;
            const bScore = bNameMatch * 3 + bSportMatch * 2 + b.averageRating;
            
            return bScore - aScore;
          });
        }
        break;
    }
  }

  // Apply pagination if limit and offset are provided
  let startIndex = 0;
  let endIndex = venues.length;
  
  if (filters.page && filters.limit) {
    startIndex = (filters.page - 1) * filters.limit;
    endIndex = startIndex + filters.limit;
  } else if (filters.offset !== undefined && filters.limit) {
    startIndex = filters.offset;
    endIndex = startIndex + filters.limit;
  }
  
  const paginatedVenues = venues.slice(startIndex, endIndex);

  // Transform venues to match the format expected by the VenueCard component
  return paginatedVenues.map(venue => ({
    id: venue.id,
    name: venue.name,
    image: venue.images[0], // Use the first image
    location: `${venue.address.city}, ${venue.address.state}`,
    sports: venue.sportsOffered,
    pricePerHour: venue.pricePerHour,
    rating: venue.averageRating,
    reviewCount: venue.reviewCount,
    availability: venue.capacity > 30 ? 'available' : (venue.capacity > 10 ? 'limited' : 'busy'),
    amenities: {
      parking: venue.amenitiesAvailable.includes('Parking'),
      changingRooms: venue.amenitiesAvailable.includes('Changing Rooms'),
      equipment: venue.amenitiesAvailable.includes('Equipment Rental'),
      refreshments: venue.amenitiesAvailable.includes('Refreshments')
    },
    isFavorited: false, // This will be updated by the main component
    // Additional data for detailed view
    description: venue.description,
    phone: venue.phone,
    email: venue.email,
    operatingHours: venue.operatingHours,
    allAmenities: venue.amenitiesAvailable,
    capacity: venue.capacity,
    address: venue.address
  }));
};

export const getMockVenueById = (id) => {
  return mockVenues.find(venue => venue.id === id);
};

export const createMockBooking = (bookingData) => {
  const newBooking = {
    id: `booking-${Date.now()}`,
    ...bookingData,
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  
  mockBookings.push(newBooking);
  return newBooking;
};

export const getMockUserBookings = (userId, filters = {}) => {
  let bookings = mockBookings.filter(booking => booking.userId === userId);
  
  if (filters.status) {
    bookings = bookings.filter(booking => booking.status === filters.status);
  }
  
  return bookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const getMockBookingById = (id) => {
  return mockBookings.find(booking => booking.id === id);
};

export const createMockReview = (reviewData) => {
  const newReview = {
    id: `review-${Date.now()}`,
    ...reviewData,
    createdAt: new Date().toISOString()
  };
  
  mockReviews.push(newReview);
  return newReview;
};

export const getMockVenueReviews = (venueId) => {
  return mockReviews
    .filter(review => review.venueId === venueId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const addMockFavorite = (userId, venueId) => {
  const existing = mockFavorites.find(fav => fav.userId === userId && fav.venueId === venueId);
  if (!existing) {
    const newFavorite = {
      id: `favorite-${Date.now()}`,
      userId,
      venueId,
      createdAt: new Date().toISOString()
    };
    mockFavorites.push(newFavorite);
    return newFavorite;
  }
  return existing;
};

export const removeMockFavorite = (userId, venueId) => {
  const index = mockFavorites.findIndex(fav => fav.userId === userId && fav.venueId === venueId);
  if (index > -1) {
    mockFavorites.splice(index, 1);
    return true;
  }
  return false;
};

export const getMockUserFavorites = (userId) => {
  const userFavorites = mockFavorites.filter(fav => fav.userId === userId);
  return userFavorites.map(fav => {
    const venue = getMockVenueById(fav.venueId);
    // Transform venue to match the format expected by the VenueCard component
    return {
      id: venue.id,
      name: venue.name,
      image: venue.images[0], // Use the first image
      location: `${venue.address.city}, ${venue.address.state}`,
      sports: venue.sportsOffered,
      pricePerHour: venue.pricePerHour,
      rating: venue.averageRating,
      reviewCount: venue.reviewCount,
      availability: venue.capacity > 30 ? 'available' : (venue.capacity > 10 ? 'limited' : 'busy'),
      amenities: {
        parking: venue.amenitiesAvailable.includes('Parking'),
        changingRooms: venue.amenitiesAvailable.includes('Changing Rooms'),
        equipment: venue.amenitiesAvailable.includes('Equipment Rental'),
        refreshments: venue.amenitiesAvailable.includes('Refreshments')
      },
      isFavorited: true,
      favoritedAt: fav.createdAt
    };
  });
};

export const getMockSports = () => {
  return [...mockSports];
};

export const getMockAmenities = () => {
  return [...mockAmenities];
};

export const checkMockAvailability = (venueId, date, startTime, endTime) => {
  // Check if there are any conflicting bookings
  const conflicts = mockBookings.filter(booking => 
    booking.venueId === venueId &&
    booking.bookingDate === date &&
    booking.status !== 'cancelled' &&
    (
      (startTime >= booking.startTime && startTime < booking.endTime) ||
      (endTime > booking.startTime && endTime <= booking.endTime) ||
      (startTime <= booking.startTime && endTime >= booking.endTime)
    )
  );
  
  return conflicts.length === 0;
};

const parsePriceRange = (priceRange) => {
  const ranges = {
    'under-20': [0, 20],
    '20-40': [20, 40],
    '40-60': [40, 60],
    'over-60': [60, 1000]
  };
  return ranges[priceRange] || [0, 1000];
};

// Update user
export const updateMockUser = (id, updates) => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex > -1) {
    mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates, updatedAt: new Date().toISOString() };
    return { ...mockUsers[userIndex] };
  }
  return null;
};

// Delete user
export const deleteMockUser = (id) => {
  const userIndex = mockUsers.findIndex(user => user.id === id);
  if (userIndex > -1) {
    mockUsers.splice(userIndex, 1);
    return true;
  }
  return false;
};

// Create venue
export const createMockVenue = (venueData) => {
  const newVenue = {
    id: `venue-${mockVenues.length + 1}`,
    ...venueData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockVenues.push(newVenue);
  return newVenue;
};

// Update venue
export const updateMockVenue = (id, updates) => {
  const venueIndex = mockVenues.findIndex(venue => venue.id === id);
  if (venueIndex > -1) {
    mockVenues[venueIndex] = { ...mockVenues[venueIndex], ...updates, updatedAt: new Date().toISOString() };
    return { ...mockVenues[venueIndex] };
  }
  return null;
};

// Delete venue
export const deleteMockVenue = (id) => {
  const venueIndex = mockVenues.findIndex(venue => venue.id === id);
  if (venueIndex > -1) {
    mockVenues.splice(venueIndex, 1);
    return true;
  }
  return false;
};

// Get venues by owner
export const getMockVenuesByOwner = (ownerId) => {
  return mockVenues.filter(venue => venue.ownerId === ownerId);
};

// Update booking
export const updateMockBooking = (id, updates) => {
  const bookingIndex = mockBookings.findIndex(booking => booking.id === id);
  if (bookingIndex > -1) {
    mockBookings[bookingIndex] = { ...mockBookings[bookingIndex], ...updates, updatedAt: new Date().toISOString() };
    return { ...mockBookings[bookingIndex] };
  }
  return null;
};

// Delete booking
export const deleteMockBooking = (id) => {
  const bookingIndex = mockBookings.findIndex(booking => booking.id === id);
  if (bookingIndex > -1) {
    mockBookings.splice(bookingIndex, 1);
    return true;
  }
  return false;
};

// Get bookings by venue
export const getMockBookingsByVenue = (venueId) => {
  return mockBookings.filter(booking => booking.venueId === venueId);
};

// Update review
export const updateMockReview = (id, updates) => {
  const reviewIndex = mockReviews.findIndex(review => review.id === id);
  if (reviewIndex > -1) {
    mockReviews[reviewIndex] = { ...mockReviews[reviewIndex], ...updates };
    return { ...mockReviews[reviewIndex] };
  }
  return null;
};

// Delete review
export const deleteMockReview = (id) => {
  const reviewIndex = mockReviews.findIndex(review => review.id === id);
  if (reviewIndex > -1) {
    mockReviews.splice(reviewIndex, 1);
    return true;
  }
  return false;
};

// Get reviews by user
export const getMockReviewsByUser = (userId) => {
  return mockReviews.filter(review => review.userId === userId);
};

// Remove favorite by ID
export const removeMockFavoriteById = (id) => {
  const index = mockFavorites.findIndex(fav => fav.id === id);
  if (index > -1) {
    mockFavorites.splice(index, 1);
    return true;
  }
  return false;
};

// Create sport
export const createMockSport = (sportData) => {
  const newSport = {
    id: `sport-${mockSports.length + 1}`,
    ...sportData
  };
  mockSports.push(newSport);
  return newSport;
};

// Update sport
export const updateMockSport = (id, updates) => {
  const sportIndex = mockSports.findIndex(sport => sport.id === id);
  if (sportIndex > -1) {
    mockSports[sportIndex] = { ...mockSports[sportIndex], ...updates };
    return { ...mockSports[sportIndex] };
  }
  return null;
};

// Delete sport
export const deleteMockSport = (id) => {
  const sportIndex = mockSports.findIndex(sport => sport.id === id);
  if (sportIndex > -1) {
    mockSports.splice(sportIndex, 1);
    return true;
  }
  return false;
};

// Mock notifications data
export const mockNotifications = [
  {
    id: 'notif-1',
    userId: 'user-1',
    title: 'Booking Confirmed',
    message: 'Your booking for Elite Sports Complex on Aug 15, 2025 at 2:00 PM has been confirmed.',
    type: 'success',
    category: 'booking',
    isRead: false,
    createdAt: '2025-08-10T14:30:00Z',
    updatedAt: '2025-08-10T14:30:00Z'
  },
  {
    id: 'notif-2',
    userId: 'user-1',
    title: 'New Review',
    message: 'John Smith left a 5-star review for your booking at Downtown Tennis Center.',
    type: 'info',
    category: 'review',
    isRead: true,
    createdAt: '2025-08-09T10:15:00Z',
    updatedAt: '2025-08-09T10:15:00Z'
  },
  {
    id: 'notif-3',
    userId: 'user-1',
    title: 'Special Offer',
    message: 'Get 20% off your next booking at any premium venue this week!',
    type: 'info',
    category: 'promotion',
    isRead: false,
    createdAt: '2025-08-08T09:00:00Z',
    updatedAt: '2025-08-08T09:00:00Z'
  }
];

// Create notification
export const createMockNotification = (notificationData) => {
  const newNotification = {
    id: `notif-${mockNotifications.length + 1}`,
    ...notificationData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockNotifications.push(newNotification);
  return newNotification;
};

// Get user notifications
export const getMockUserNotifications = (userId) => {
  return mockNotifications.filter(notification => notification.userId === userId);
};

// Mark notification as read
export const markMockNotificationAsRead = (notificationId, userId) => {
  const notificationIndex = mockNotifications.findIndex(
    notification => notification.id === notificationId && notification.userId === userId
  );
  
  if (notificationIndex > -1) {
    mockNotifications[notificationIndex] = {
      ...mockNotifications[notificationIndex],
      isRead: true,
      updatedAt: new Date().toISOString()
    };
    return true;
  }
  return false;
};

// Mark all notifications as read
export const markAllMockNotificationsAsRead = (userId) => {
  let updatedCount = 0;
  
  for (let i = 0; i < mockNotifications.length; i++) {
    if (mockNotifications[i].userId === userId && !mockNotifications[i].isRead) {
      mockNotifications[i] = {
        ...mockNotifications[i],
        isRead: true,
        updatedAt: new Date().toISOString()
      };
      updatedCount++;
    }
  }
  
  return updatedCount;
};

// Delete notification
export const deleteMockNotification = (notificationId, userId) => {
  const notificationIndex = mockNotifications.findIndex(
    notification => notification.id === notificationId && notification.userId === userId
  );
  
  if (notificationIndex > -1) {
    mockNotifications.splice(notificationIndex, 1);
    return true;
  }
  return false;
};
