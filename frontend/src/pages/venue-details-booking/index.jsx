import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ImageGallery from './components/ImageGallery';
import VenueInfo from './components/VenueInfo';
import BookingWidget from './components/BookingWidget';
import ReviewsSection from './components/ReviewsSection';
import BookingConfirmationModal from './components/BookingConfirmationModal';
import FacilityOwnerInfo from './components/FacilityOwnerInfo';
import Icon from '../../components/AppIcon';


const VenueDetailsBooking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { venueId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get venue ID from URL params or search params
  const currentVenueId = venueId || searchParams.get('id') || 'venue-001';

  // Mock venue data
  const venue = {
    id: "venue-001",
    name: "Elite Sports Complex",
    rating: 4.8,
    reviewCount: 247,
    location: "Downtown Sports District",
    fullAddress: "123 Sports Avenue, Downtown District, City 12345",
    coordinates: { lat: 40.7128, lng: -74.0060 },
    sportTypes: ["Basketball", "Tennis", "Badminton", "Volleyball"],
    description: `Elite Sports Complex is a premier multi-sport facility featuring state-of-the-art courts and professional-grade equipment. Our facility offers a complete sports experience with modern amenities, expert maintenance, and a welcoming atmosphere for players of all skill levels.\n\nWhether you're looking for a casual game with friends or serious training sessions, our facility provides the perfect environment. We pride ourselves on maintaining the highest standards of cleanliness, safety, and customer service.`,
    images: [
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"
    ],
    amenities: [
      { name: "Parking", icon: "Car", description: "Free parking available" },
      { name: "Locker Rooms", icon: "Lock", description: "Clean changing facilities" },
      { name: "Equipment Rental", icon: "Package", description: "Sports equipment available" },
      { name: "Water Station", icon: "Droplets", description: "Complimentary water" },
      { name: "First Aid", icon: "Heart", description: "Emergency medical kit" },
      { name: "WiFi", icon: "Wifi", description: "Free high-speed internet" },
      { name: "Air Conditioning", icon: "Wind", description: "Climate controlled" },
      { name: "Spectator Area", icon: "Users", description: "Comfortable seating" },
      { name: "Pro Shop", icon: "ShoppingBag", description: "Sports gear and snacks" }
    ],
    operatingHours: [
      { day: "Monday", isOpen: true, open: "6:00 AM", close: "10:00 PM" },
      { day: "Tuesday", isOpen: true, open: "6:00 AM", close: "10:00 PM" },
      { day: "Wednesday", isOpen: true, open: "6:00 AM", close: "10:00 PM" },
      { day: "Thursday", isOpen: true, open: "6:00 AM", close: "10:00 PM" },
      { day: "Friday", isOpen: true, open: "6:00 AM", close: "11:00 PM" },
      { day: "Saturday", isOpen: true, open: "7:00 AM", close: "11:00 PM" },
      { day: "Sunday", isOpen: true, open: "7:00 AM", close: "9:00 PM" }
    ]
  };

  const courts = [
    {
      id: "court-001",
      name: "Basketball Court A",
      surface: "Hardwood",
      pricePerHour: 45,
      capacity: 10,
      features: ["Professional lighting", "Sound system", "Scoreboard"]
    },
    {
      id: "court-002", 
      name: "Tennis Court 1",
      surface: "Hard Court",
      pricePerHour: 35,
      capacity: 4,
      features: ["Net included", "Line marking", "Flood lights"]
    },
    {
      id: "court-003",
      name: "Badminton Court B",
      surface: "Synthetic",
      pricePerHour: 25,
      capacity: 4,
      features: ["Shuttlecocks provided", "Professional nets", "Non-slip surface"]
    },
    {
      id: "court-004",
      name: "Volleyball Court",
      surface: "Indoor Sand",
      pricePerHour: 40,
      capacity: 12,
      features: ["Beach volleyball setup", "Sand court", "Professional net"]
    }
  ];

  const reviews = [
    {
      id: 1,
      userName: "Michael Rodriguez",
      userAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 5,
      date: "2025-01-05",
      comment: `Absolutely fantastic facility! The courts are well-maintained and the staff is incredibly helpful. I've been playing here for months and the experience is consistently excellent. The booking system is easy to use and the amenities are top-notch.`,
      isVerified: true,
      helpfulCount: 12,
      images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=200&h=200&fit=crop"]
    },
    {
      id: 2,
      userName: "Sarah Chen",
      userAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4,
      date: "2025-01-03",
      comment: `Great place for tennis! The courts are in excellent condition and the lighting is perfect for evening games. Only minor complaint is that parking can get crowded during peak hours, but overall highly recommend.`,
      isVerified: true,
      helpfulCount: 8,
      images: []
    },
    {
      id: 3,
      userName: "David Thompson",
      userAvatar: "https://randomuser.me/api/portraits/men/56.jpg",
      rating: 5,
      date: "2024-12-28",
      comment: `Perfect venue for our weekly basketball games. The court quality is professional-grade and the booking process is seamless. The locker rooms are clean and the staff is always friendly and accommodating.`,
      isVerified: false,
      helpfulCount: 15,
      images: []
    },
    {
      id: 4,
      userName: "Emily Johnson",
      userAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 4,
      date: "2024-12-25",
      comment: `Love the badminton courts here! Equipment rental is convenient and reasonably priced. The facility is always clean and well-organized. Would definitely book again for future games.`,
      isVerified: true,
      helpfulCount: 6,
      images: ["https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200&h=200&fit=crop"]
    },
    {
      id: 5,
      userName: "James Wilson",
      userAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
      rating: 5,
      date: "2024-12-20",
      comment: `Outstanding facility with excellent customer service. The volleyball court is amazing and the sand quality is perfect. Highly recommend for both casual and competitive play.`,
      isVerified: true,
      helpfulCount: 9,
      images: []
    }
  ];

  const owner = {
    name: "Robert Martinez",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    rating: 4.9,
    reviewCount: 156,
    memberSince: "2019",
    bio: "Passionate sports facility owner with over 15 years of experience in sports management. Committed to providing the best possible experience for all athletes and sports enthusiasts.",
    emergencyContact: {
      phone: "(555) 123-4567",
      hours: "24/7"
    }
  };

  const policies = {
    cancellation: "Free cancellation up to 2 hours before your booking time. Cancellations within 2 hours will incur a 50% charge. No-shows will be charged the full amount.",
    houseRules: [
      "Proper sports attire and non-marking shoes required",
      "No food or drinks (except water) on the courts",
      "Clean up after use and return equipment to designated areas",
      "Respect other players and maintain appropriate noise levels",
      "Report any equipment damage or safety concerns immediately"
    ],
    safetyGuidelines: [
      "Warm up properly before playing to prevent injuries",
      "Use equipment only as intended and inspect before use",
      "Report any hazards or unsafe conditions to staff",
      "First aid kit available at front desk",
      "Emergency exits are clearly marked throughout the facility"
    ],
    additionalInfo: [
      "Facility is professionally cleaned daily",
      "Equipment sanitized between uses",
      "Security cameras monitor all common areas",
      "Lost and found items held for 30 days",
      "Group discounts available for 8+ players"
    ]
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'reviews', label: 'Reviews', icon: 'Star' },
    { id: 'policies', label: 'Policies', icon: 'Shield' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleBookingSubmit = (booking) => {
    const court = courts?.find(c => c?.id === booking?.courtId);
    const enhancedBooking = {
      ...booking,
      courtName: court?.name || 'Unknown Court',
      pricePerHour: court?.pricePerHour || 0,
      venueName: venue?.name
    };
    setBookingDetails(enhancedBooking);
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirm = () => {
    setIsBookingModalOpen(false);
    // Simulate booking confirmation
    setTimeout(() => {
      navigate('/user-profile-my-bookings', { 
        state: { 
          message: 'Booking confirmed successfully!',
          bookingId: 'BK' + Date.now()
        }
      });
    }, 1000);
  };

  const averageRating = reviews?.reduce((sum, review) => sum + review?.rating, 0) / reviews?.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-text-secondary">Loading venue details...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
            <button 
              onClick={() => navigate('/homepage-dashboard')}
              className="hover:text-primary transition-colors"
            >
              Home
            </button>
            <Icon name="ChevronRight" size={14} />
            <button 
              onClick={() => navigate('/venue-search-listings')}
              className="hover:text-primary transition-colors"
            >
              Venues
            </button>
            <Icon name="ChevronRight" size={14} />
            <span className="text-text-primary">{venue?.name}</span>
          </nav>

          {/* Back Button */}
          <div className="mb-6">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-sm text-text-secondary hover:text-primary transition-colors"
            >
              <Icon name="ArrowLeft" size={16} />
              <span>Back to search results</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8 space-y-8">
              {/* Image Gallery */}
              <ImageGallery images={venue?.images} venueName={venue?.name} />

              {/* Desktop Tabs */}
              <div className="hidden md:block">
                <div className="border-b border-border">
                  <nav className="flex space-x-8">
                    {tabs?.map((tab) => (
                      <button
                        key={tab?.id}
                        onClick={() => setActiveTab(tab?.id)}
                        className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab?.id
                            ? 'border-primary text-primary' :'border-transparent text-text-secondary hover:text-text-primary hover:border-border'
                        }`}
                      >
                        <Icon name={tab?.icon} size={16} />
                        <span>{tab?.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Mobile Tab Selector */}
              <div className="md:hidden">
                <select
                  value={activeTab}
                  onChange={(e) => setActiveTab(e?.target?.value)}
                  className="w-full p-3 border border-border rounded-lg bg-card text-text-primary"
                >
                  {tabs?.map((tab) => (
                    <option key={tab?.id} value={tab?.id}>
                      {tab?.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tab Content */}
              <div className="min-h-[400px]">
                {activeTab === 'overview' && (
                  <VenueInfo venue={venue} />
                )}
                {activeTab === 'reviews' && (
                  <ReviewsSection 
                    reviews={reviews} 
                    averageRating={averageRating}
                    totalReviews={reviews?.length}
                  />
                )}
                {activeTab === 'policies' && (
                  <FacilityOwnerInfo owner={owner} policies={policies} />
                )}
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-4">
              <BookingWidget 
                courts={courts}
                onBookingSubmit={handleBookingSubmit}
                isSticky={true}
              />
            </div>
          </div>

          {/* Mobile Booking Widget */}
          <div className="lg:hidden mt-8">
            <BookingWidget 
              courts={courts}
              onBookingSubmit={handleBookingSubmit}
            />
          </div>
        </div>
      </main>
      {/* Booking Confirmation Modal */}
      <BookingConfirmationModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        bookingDetails={bookingDetails}
        onConfirm={handleBookingConfirm}
      />
    </div>
  );
};

export default VenueDetailsBooking;