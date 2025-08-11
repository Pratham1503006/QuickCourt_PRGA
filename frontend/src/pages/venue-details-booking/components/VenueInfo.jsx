import React from 'react';
import Icon from '../../../components/AppIcon';

const VenueInfo = ({ venue }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={16} className="text-warning fill-current" />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div className="space-y-6">
      {/* Venue Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
          {venue?.name}
        </h1>
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex items-center space-x-1">
            {renderStars(venue?.rating)}
            <span className="text-sm text-text-secondary ml-2">
              {venue?.rating} ({venue?.reviewCount} reviews)
            </span>
          </div>
          <div className="flex items-center text-text-secondary">
            <Icon name="MapPin" size={16} className="mr-1" />
            <span className="text-sm">{venue?.location}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {venue?.sportTypes?.map((sport, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
            >
              {sport}
            </span>
          ))}
        </div>
      </div>
      {/* Description */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-3">About This Venue</h2>
        <p className="text-text-secondary leading-relaxed">{venue?.description}</p>
      </div>
      {/* Amenities */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-3">Amenities</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {venue?.amenities?.map((amenity, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 p-3 bg-muted rounded-lg"
              title={amenity?.description}
            >
              <Icon name={amenity?.icon} size={20} className="text-primary" />
              <span className="text-sm font-medium text-text-primary">{amenity?.name}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Operating Hours */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-3">Operating Hours</h2>
        <div className="bg-muted rounded-lg p-4">
          {venue?.operatingHours?.map((schedule, index) => (
            <div key={index} className="flex justify-between items-center py-2">
              <span className="font-medium text-text-primary">{schedule?.day}</span>
              <span className="text-text-secondary">
                {schedule?.isOpen ? `${schedule?.open} - ${schedule?.close}` : 'Closed'}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Location Map */}
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-3">Location</h2>
        <div className="h-64 bg-muted rounded-lg overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title={venue?.name}
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${venue?.coordinates?.lat},${venue?.coordinates?.lng}&z=14&output=embed`}
            className="border-0"
          />
        </div>
        <div className="mt-2 text-sm text-text-secondary">
          <Icon name="MapPin" size={14} className="inline mr-1" />
          {venue?.fullAddress}
        </div>
      </div>
    </div>
  );
};

export default VenueInfo;