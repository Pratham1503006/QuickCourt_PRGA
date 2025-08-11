import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Checkbox  from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const sportTypes = [
    { id: 'basketball', label: 'Basketball', count: 24 },
    { id: 'tennis', label: 'Tennis', count: 18 },
    { id: 'badminton', label: 'Badminton', count: 32 },
    { id: 'football', label: 'Football', count: 15 },
    { id: 'cricket', label: 'Cricket', count: 12 },
    { id: 'volleyball', label: 'Volleyball', count: 8 },
    { id: 'swimming', label: 'Swimming', count: 6 },
    { id: 'gym', label: 'Gym & Fitness', count: 28 }
  ];

  const venueTypes = [
    { id: 'indoor', label: 'Indoor', count: 45 },
    { id: 'outdoor', label: 'Outdoor', count: 38 },
    { id: 'covered', label: 'Covered', count: 22 }
  ];

  const amenities = [
    { id: 'parking', label: 'Parking Available', count: 67 },
    { id: 'changing-rooms', label: 'Changing Rooms', count: 54 },
    { id: 'equipment-rental', label: 'Equipment Rental', count: 41 },
    { id: 'refreshments', label: 'Refreshments', count: 33 },
    { id: 'air-conditioning', label: 'Air Conditioning', count: 29 },
    { id: 'wifi', label: 'Free WiFi', count: 48 },
    { id: 'first-aid', label: 'First Aid', count: 52 },
    { id: 'coaching', label: 'Coaching Available', count: 19 }
  ];

  const priceRanges = [
    { id: 'under-20', label: 'Under $20/hour', count: 23 },
    { id: '20-40', label: '$20 - $40/hour', count: 34 },
    { id: '40-60', label: '$40 - $60/hour', count: 28 },
    { id: 'over-60', label: 'Over $60/hour', count: 18 }
  ];

  const ratings = [
    { id: '5', label: '5 Stars', count: 12 },
    { id: '4', label: '4+ Stars', count: 45 },
    { id: '3', label: '3+ Stars', count: 78 },
    { id: '2', label: '2+ Stars', count: 95 }
  ];

  const handleFilterChange = (category, value, checked) => {
    setLocalFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...(prev?.[category] || []), value]
        : (prev?.[category] || [])?.filter(item => item !== value)
    }));
  };

  const handlePriceRangeChange = (range, checked) => {
    setLocalFilters(prev => ({
      ...prev,
      priceRange: checked ? range : null
    }));
  };

  const handleRatingChange = (rating, checked) => {
    setLocalFilters(prev => ({
      ...prev,
      minRating: checked ? rating : null
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const clearedFilters = {
      sportTypes: [],
      venueTypes: [],
      amenities: [],
      priceRange: null,
      minRating: null
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    count += localFilters?.sportTypes?.length || 0;
    count += localFilters?.venueTypes?.length || 0;
    count += localFilters?.amenities?.length || 0;
    if (localFilters?.priceRange) count++;
    if (localFilters?.minRating) count++;
    return count;
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-16 left-0 h-screen lg:h-auto w-80 lg:w-full
        bg-surface border-r lg:border-r-0 lg:border border-border
        transform transition-transform duration-300 ease-in-out z-50 lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-text-primary">Filters</h2>
              {getActiveFiltersCount() > 0 && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {getActiveFiltersCount()}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          {/* Sport Types */}
          <div className="mb-6">
            <h3 className="font-medium text-text-primary mb-3">Sport Types</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {sportTypes?.map((sport) => (
                <div key={sport?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={sport?.label}
                    checked={localFilters?.sportTypes?.includes(sport?.id) || false}
                    onChange={(e) => handleFilterChange('sportTypes', sport?.id, e?.target?.checked)}
                  />
                  <span className="text-sm text-text-secondary">({sport?.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Venue Types */}
          <div className="mb-6">
            <h3 className="font-medium text-text-primary mb-3">Venue Types</h3>
            <div className="space-y-2">
              {venueTypes?.map((type) => (
                <div key={type?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={type?.label}
                    checked={localFilters?.venueTypes?.includes(type?.id) || false}
                    onChange={(e) => handleFilterChange('venueTypes', type?.id, e?.target?.checked)}
                  />
                  <span className="text-sm text-text-secondary">({type?.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h3 className="font-medium text-text-primary mb-3">Price Range</h3>
            <div className="space-y-2">
              {priceRanges?.map((range) => (
                <div key={range?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={range?.label}
                    checked={localFilters?.priceRange === range?.id}
                    onChange={(e) => handlePriceRangeChange(range?.id, e?.target?.checked)}
                  />
                  <span className="text-sm text-text-secondary">({range?.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="font-medium text-text-primary mb-3">Minimum Rating</h3>
            <div className="space-y-2">
              {ratings?.map((rating) => (
                <div key={rating?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={rating?.label}
                    checked={localFilters?.minRating === rating?.id}
                    onChange={(e) => handleRatingChange(rating?.id, e?.target?.checked)}
                  />
                  <span className="text-sm text-text-secondary">({rating?.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="font-medium text-text-primary mb-3">Amenities</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {amenities?.map((amenity) => (
                <div key={amenity?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={amenity?.label}
                    checked={localFilters?.amenities?.includes(amenity?.id) || false}
                    onChange={(e) => handleFilterChange('amenities', amenity?.id, e?.target?.checked)}
                  />
                  <span className="text-sm text-text-secondary">({amenity?.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-2 pt-4 border-t border-border">
            <Button
              variant="default"
              fullWidth
              onClick={applyFilters}
            >
              Apply Filters ({getActiveFiltersCount()})
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={clearFilters}
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;