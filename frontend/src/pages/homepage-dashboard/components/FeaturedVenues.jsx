import React from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FeaturedVenues = () => {
  const navigate = useNavigate();

  const featuredVenues = [
    {
      id: 1,
      name: "Elite Sports Complex",
      image: "https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      rating: 4.8,
      reviewCount: 124,
      sports: ["Basketball", "Tennis", "Badminton"],
      priceRange: "$25-45",
      distance: "0.8 miles",
      location: "Downtown Sports District",
      amenities: ["Parking", "Locker Rooms", "Cafeteria"],
      isVerified: true,
      quickBookAvailable: true,
      nextAvailable: "Today 6:00 PM"
    },
    {
      id: 2,
      name: "Riverside Tennis Club",
      image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      rating: 4.6,
      reviewCount: 89,
      sports: ["Tennis", "Squash"],
      priceRange: "$30-50",
      distance: "1.2 miles",
      location: "Riverside Park Area",
      amenities: ["Pro Shop", "Coaching", "Equipment Rental"],
      isVerified: true,
      quickBookAvailable: false,
      nextAvailable: "Tomorrow 8:00 AM"
    },
    {
      id: 3,
      name: "Metro Basketball Arena",
      image: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      rating: 4.9,
      reviewCount: 156,
      sports: ["Basketball", "Volleyball"],
      priceRange: "$20-35",
      distance: "2.1 miles",
      location: "Metro Sports Hub",
      amenities: ["Air Conditioning", "Sound System", "Scoreboard"],
      isVerified: true,
      quickBookAvailable: true,
      nextAvailable: "Today 7:30 PM"
    },
    {
      id: 4,
      name: "Aqua Fitness Center",
      image: "https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      rating: 4.7,
      reviewCount: 203,
      sports: ["Swimming", "Water Polo"],
      priceRange: "$35-55",
      distance: "1.8 miles",
      location: "Health & Wellness District",
      amenities: ["Heated Pool", "Sauna", "Towel Service"],
      isVerified: true,
      quickBookAvailable: true,
      nextAvailable: "Today 5:00 PM"
    },
    {
      id: 5,
      name: "Champions Football Ground",
      image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      rating: 4.5,
      reviewCount: 78,
      sports: ["Football", "Cricket"],
      priceRange: "$40-70",
      distance: "3.2 miles",
      location: "Sports Complex North",
      amenities: ["Floodlights", "Changing Rooms", "Spectator Seating"],
      isVerified: false,
      quickBookAvailable: false,
      nextAvailable: "Tomorrow 10:00 AM"
    },
    {
      id: 6,
      name: "Urban Badminton Hub",
      image: "https://images.pexels.com/photos/8007513/pexels-photo-8007513.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
      rating: 4.4,
      reviewCount: 67,
      sports: ["Badminton", "Table Tennis"],
      priceRange: "$18-28",
      distance: "1.5 miles",
      location: "City Center",
      amenities: ["Equipment Rental", "Coaching", "Refreshments"],
      isVerified: true,
      quickBookAvailable: true,
      nextAvailable: "Today 8:00 PM"
    }
  ];

  const handleVenueClick = (venueId) => {
    navigate(`/venue-details-booking/${venueId}`);
  };

  const handleQuickBook = (e, venueId) => {
    e?.stopPropagation();
    navigate(`/venue-details-booking/${venueId}?quickbook=true`);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={14} className="text-yellow-400 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="Star" size={14} className="text-yellow-400 fill-current opacity-50" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-gray-300" />
      );
    }

    return stars;
  };

  return (
    <div className="bg-muted py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Featured Venues
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Discover top-rated sports facilities in your area with premium amenities and flexible booking options
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {featuredVenues?.map((venue) => (
            <div
              key={venue?.id}
              onClick={() => handleVenueClick(venue?.id)}
              className="bg-card border border-border rounded-xl overflow-hidden cursor-pointer transition-smooth hover:shadow-elevated hover:border-primary/20 group"
            >
              {/* Image Container */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={venue?.image}
                  alt={venue?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
                />
                
                {/* Overlay Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  {venue?.isVerified && (
                    <div className="bg-success text-success-foreground px-2 py-1 rounded-md text-xs font-medium flex items-center">
                      <Icon name="CheckCircle" size={12} className="mr-1" />
                      Verified
                    </div>
                  )}
                  {venue?.quickBookAvailable && (
                    <div className="bg-primary text-primary-foreground px-2 py-1 rounded-md text-xs font-medium">
                      Quick Book
                    </div>
                  )}
                </div>

                {/* Distance Badge */}
                <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded-md text-xs">
                  {venue?.distance}
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-smooth line-clamp-1">
                    {venue?.name}
                  </h3>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-text-primary">
                      {venue?.priceRange}
                    </div>
                    <div className="text-xs text-text-secondary">per hour</div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex items-center mr-2">
                    {renderStars(venue?.rating)}
                  </div>
                  <span className="text-sm font-medium text-text-primary mr-1">
                    {venue?.rating}
                  </span>
                  <span className="text-sm text-text-secondary">
                    ({venue?.reviewCount} reviews)
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center text-sm text-text-secondary mb-3">
                  <Icon name="MapPin" size={14} className="mr-1" />
                  {venue?.location}
                </div>

                {/* Sports Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {venue?.sports?.slice(0, 3)?.map((sport, index) => (
                    <span
                      key={index}
                      className="bg-muted text-text-secondary px-2 py-1 rounded-md text-xs"
                    >
                      {sport}
                    </span>
                  ))}
                  {venue?.sports?.length > 3 && (
                    <span className="bg-muted text-text-secondary px-2 py-1 rounded-md text-xs">
                      +{venue?.sports?.length - 3} more
                    </span>
                  )}
                </div>

                {/* Amenities */}
                <div className="flex items-center text-xs text-text-secondary mb-4">
                  <Icon name="Wifi" size={12} className="mr-1" />
                  {venue?.amenities?.slice(0, 2)?.join(', ')}
                  {venue?.amenities?.length > 2 && ` +${venue?.amenities?.length - 2} more`}
                </div>

                {/* Next Available */}
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-text-secondary">Next available:</span>
                  <span className="font-medium text-text-primary">
                    {venue?.nextAvailable}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={(e) => {
                      e?.stopPropagation();
                      handleVenueClick(venue?.id);
                    }}
                  >
                    View Details
                  </Button>
                  {venue?.quickBookAvailable && (
                    <Button
                      variant="default"
                      size="sm"
                      fullWidth
                      onClick={(e) => handleQuickBook(e, venue?.id)}
                    >
                      Quick Book
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate('/venue-search-listings')}
            className="px-8"
          >
            View All Venues
            <Icon name="ArrowRight" size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedVenues;