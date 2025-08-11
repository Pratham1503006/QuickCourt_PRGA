import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
  const getFilterBadges = () => {
    const badges = [];

    // Sport types
    if (filters?.sportTypes?.length > 0) {
      filters?.sportTypes?.forEach(sport => {
        badges?.push({
          id: `sport-${sport}`,
          label: sport?.charAt(0)?.toUpperCase() + sport?.slice(1),
          category: 'sportTypes',
          value: sport
        });
      });
    }

    // Venue types
    if (filters?.venueTypes?.length > 0) {
      filters?.venueTypes?.forEach(type => {
        badges?.push({
          id: `venue-${type}`,
          label: type?.charAt(0)?.toUpperCase() + type?.slice(1),
          category: 'venueTypes',
          value: type
        });
      });
    }

    // Price range
    if (filters?.priceRange) {
      const priceLabels = {
        'under-20': 'Under $20/hour',
        '20-40': '$20-$40/hour',
        '40-60': '$40-$60/hour',
        'over-60': 'Over $60/hour'
      };
      badges?.push({
        id: 'price-range',
        label: priceLabels?.[filters?.priceRange],
        category: 'priceRange',
        value: filters?.priceRange
      });
    }

    // Rating
    if (filters?.minRating) {
      badges?.push({
        id: 'rating',
        label: `${filters?.minRating}+ Stars`,
        category: 'minRating',
        value: filters?.minRating
      });
    }

    // Amenities
    if (filters?.amenities?.length > 0) {
      filters?.amenities?.forEach(amenity => {
        const amenityLabels = {
          'parking': 'Parking',
          'changing-rooms': 'Changing Rooms',
          'equipment-rental': 'Equipment Rental',
          'refreshments': 'Refreshments',
          'air-conditioning': 'AC',
          'wifi': 'WiFi',
          'first-aid': 'First Aid',
          'coaching': 'Coaching'
        };
        badges?.push({
          id: `amenity-${amenity}`,
          label: amenityLabels?.[amenity] || amenity,
          category: 'amenities',
          value: amenity
        });
      });
    }

    return badges;
  };

  const filterBadges = getFilterBadges();

  if (filterBadges?.length === 0) {
    return null;
  }

  const handleRemoveFilter = (badge) => {
    onRemoveFilter(badge?.category, badge?.value);
  };

  return (
    <div className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <span className="text-sm text-text-secondary font-medium whitespace-nowrap">
              Active filters:
            </span>
            <div className="flex items-center space-x-2 overflow-x-auto scrollbar-hide">
              {filterBadges?.map((badge) => (
                <div
                  key={badge?.id}
                  className="flex items-center space-x-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm whitespace-nowrap"
                >
                  <span>{badge?.label}</span>
                  <button
                    onClick={() => handleRemoveFilter(badge)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="ml-4 whitespace-nowrap"
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActiveFilters;