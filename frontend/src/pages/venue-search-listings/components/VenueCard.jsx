import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const VenueCard = ({ venue, onFavoriteToggle, onQuickBook }) => {
  const [isFavorited, setIsFavorited] = useState(venue?.isFavorited || false);
  const [imageLoading, setImageLoading] = useState(true);
  const navigate = useNavigate();

  const handleFavoriteClick = (e) => {
    e?.stopPropagation();
    const newFavoriteState = !isFavorited;
    setIsFavorited(newFavoriteState);
    onFavoriteToggle(venue?.id, newFavoriteState);
  };

  const handleQuickBook = (e) => {
    e?.stopPropagation();
    onQuickBook(venue);
  };

  const handleCardClick = () => {
    navigate(`/venue-details-booking/${venue?.id}`);
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

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-gray-300" />
      );
    }

    return stars;
  };

  const getAvailabilityColor = (status) => {
    switch (status) {
      case 'available':
        return 'text-success bg-success/10';
      case 'limited':
        return 'text-warning bg-warning/10';
      case 'busy':
        return 'text-error bg-error/10';
      default:
        return 'text-text-secondary bg-muted';
    }
  };

  const getAvailabilityText = (status) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'limited':
        return 'Limited slots';
      case 'busy':
        return 'Busy';
      default:
        return 'Check availability';
    }
  };

  return (
    <div 
      className="bg-card border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-elevated transition-all duration-300 cursor-pointer group"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={venue?.image}
          alt={venue?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onLoad={() => setImageLoading(false)}
        />
        
        {/* Image Loading Skeleton */}
        {imageLoading && (
          <div className="absolute inset-0 bg-muted animate-pulse" />
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Icon 
            name="Heart" 
            size={16} 
            className={isFavorited ? 'text-red-500 fill-current' : 'text-gray-600'} 
          />
        </button>

        {/* Availability Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(venue?.availability)}`}>
          {getAvailabilityText(venue?.availability)}
        </div>

        {/* Price Badge */}
        <div className="absolute bottom-3 left-3 bg-black/70 text-white px-2 py-1 rounded text-sm font-medium">
          ${venue?.pricePerHour}/hour
        </div>
      </div>
      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="mb-2">
          <h3 className="font-semibold text-text-primary text-lg mb-1 line-clamp-1">
            {venue?.name}
          </h3>
          <div className="flex items-center space-x-1 mb-2">
            <Icon name="MapPin" size={14} className="text-text-secondary" />
            <span className="text-sm text-text-secondary line-clamp-1">
              {venue?.location}
            </span>
          </div>
        </div>

        {/* Sports */}
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {venue?.sports?.slice(0, 3)?.map((sport, index) => (
              <span
                key={index}
                className="inline-block bg-muted text-text-secondary text-xs px-2 py-1 rounded-full"
              >
                {sport}
              </span>
            ))}
            {venue?.sports?.length > 3 && (
              <span className="inline-block bg-muted text-text-secondary text-xs px-2 py-1 rounded-full">
                +{venue?.sports?.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-1">
              {renderStars(venue?.rating)}
            </div>
            <span className="text-sm font-medium text-text-primary">
              {venue?.rating}
            </span>
            <span className="text-sm text-text-secondary">
              ({venue?.reviewCount} reviews)
            </span>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-4">
          <div className="flex items-center space-x-3 text-text-secondary">
            {venue?.amenities?.parking && (
              <div className="flex items-center space-x-1">
                <Icon name="Car" size={14} />
                <span className="text-xs">Parking</span>
              </div>
            )}
            {venue?.amenities?.changingRooms && (
              <div className="flex items-center space-x-1">
                <Icon name="Users" size={14} />
                <span className="text-xs">Changing</span>
              </div>
            )}
            {venue?.amenities?.equipment && (
              <div className="flex items-center space-x-1">
                <Icon name="Package" size={14} />
                <span className="text-xs">Equipment</span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            fullWidth
            onClick={handleCardClick}
          >
            View Details
          </Button>
          <Button
            variant="default"
            size="sm"
            fullWidth
            onClick={handleQuickBook}
            disabled={venue?.availability === 'busy'}
          >
            Quick Book
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VenueCard;