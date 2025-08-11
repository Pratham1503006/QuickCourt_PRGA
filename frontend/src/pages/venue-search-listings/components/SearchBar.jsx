import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';


const SearchBar = ({ 
  onSearch, 
  searchQuery, 
  setSearchQuery, 
  selectedSport, 
  setSelectedSport, 
  selectedLocation, 
  setSelectedLocation,
  filters,
  onFiltersChange 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [advancedFilters, setAdvancedFilters] = useState({
    priceMin: '',
    priceMax: '',
    venueType: '',
    minRating: '',
    ...filters
  });

  const sportOptions = [
    { value: '', label: 'All Sports' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'badminton', label: 'Badminton' },
    { value: 'football', label: 'Football' },
    { value: 'cricket', label: 'Cricket' },
    { value: 'volleyball', label: 'Volleyball' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'gym', label: 'Gym & Fitness' },
    { value: 'squash', label: 'Squash' },
    { value: 'table tennis', label: 'Table Tennis' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'manhattan', label: 'Manhattan' },
    { value: 'brooklyn', label: 'Brooklyn' },
    { value: 'queens', label: 'Queens' },
    { value: 'bronx', label: 'Bronx' },
    { value: 'staten island', label: 'Staten Island' },
    { value: 'new york', label: 'New York' }
  ];

  const handleSearch = (e) => {
    e?.preventDefault();
    onSearch({
      query: searchQuery,
      sport: selectedSport,
      location: selectedLocation
    });
  };

  const handleQuickSearch = (sport) => {
    setSelectedSport(sport);
    onSearch({
      query: searchQuery,
      sport: sport,
      location: selectedLocation
    });
  };

  const handleAdvancedFilterChange = (field, value) => {
    setAdvancedFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyAdvancedFilters = () => {
    const newFilters = {
      sportTypes: advancedFilters.sportTypes || [],
      venueTypes: advancedFilters.venueType ? [advancedFilters.venueType] : [],
      amenities: advancedFilters.amenities || [],
      priceRange: null,
      minRating: advancedFilters.minRating || null
    };

    // Handle price range
    if (advancedFilters.priceMin || advancedFilters.priceMax) {
      const min = parseFloat(advancedFilters.priceMin) || 0;
      const max = parseFloat(advancedFilters.priceMax) || 1000;
      
      if (min >= 0 && min < 20) newFilters.priceRange = 'under-20';
      else if (min >= 20 && max <= 40) newFilters.priceRange = '20-40';
      else if (min >= 40 && max <= 60) newFilters.priceRange = '40-60';
      else if (min >= 60) newFilters.priceRange = 'over-60';
    }

    if (onFiltersChange) {
      onFiltersChange(newFilters);
    }
    
    setIsExpanded(false);
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({
      priceMin: '',
      priceMax: '',
      venueType: '',
      minRating: ''
    });
    
    if (onFiltersChange) {
      onFiltersChange({
        sportTypes: [],
        venueTypes: [],
        amenities: [],
        priceRange: null,
        minRating: null
      });
    }
    
    setIsExpanded(false);
  };

  // Real-time search on query change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery !== undefined) {
        onSearch({
          query: searchQuery,
          sport: selectedSport,
          location: selectedLocation
        });
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  return (
    <div className="bg-surface border-b border-border sticky top-16 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Main Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search venues, facilities, locations, or sports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full"
              />
            </div>

            {/* Sport Filter */}
            <div className="w-full md:w-48">
              <Select
                options={sportOptions}
                value={selectedSport}
                onChange={setSelectedSport}
                placeholder="Select Sport"
              />
            </div>

            {/* Location Filter */}
            <div className="w-full md:w-48">
              <Select
                options={locationOptions}
                value={selectedLocation}
                onChange={setSelectedLocation}
                placeholder="Select Location"
              />
            </div>

            {/* Search Button */}
            <Button
              type="submit"
              variant="default"
              iconName="Search"
              iconPosition="left"
              className="w-full md:w-auto"
            >
              Search
            </Button>

            {/* Advanced Filters Toggle */}
            <Button
              type="button"
              variant="outline"
              iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
              iconPosition="right"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full md:w-auto"
            >
              Filters
            </Button>
          </div>

          {/* Quick Sport Filters */}
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-text-secondary font-medium py-2">Quick filters:</span>
            {['basketball', 'tennis', 'badminton', 'football', 'swimming', 'gym']?.map((sport) => (
              <Button
                key={sport}
                type="button"
                variant={selectedSport === sport ? "default" : "outline"}
                size="sm"
                onClick={() => handleQuickSearch(sport)}
                className="capitalize"
              >
                {sport === 'gym' ? 'Gym' : sport}
              </Button>
            ))}
          </div>
        </form>

        {/* Advanced Filters Panel */}
        {isExpanded && (
          <div className="mt-4 p-4 bg-muted rounded-lg border border-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Price Range (per hour)
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    placeholder="Min ($)"
                    value={advancedFilters.priceMin}
                    onChange={(e) => handleAdvancedFilterChange('priceMin', e.target.value)}
                    className="w-full"
                    min="0"
                    step="5"
                  />
                  <span className="text-text-secondary">-</span>
                  <Input
                    type="number"
                    placeholder="Max ($)"
                    value={advancedFilters.priceMax}
                    onChange={(e) => handleAdvancedFilterChange('priceMax', e.target.value)}
                    className="w-full"
                    min="0"
                    step="5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Venue Type
                </label>
                <Select
                  options={[
                    { value: '', label: 'All Types' },
                    { value: 'indoor', label: 'Indoor' },
                    { value: 'outdoor', label: 'Outdoor' },
                    { value: 'covered', label: 'Covered' }
                  ]}
                  value={advancedFilters.venueType}
                  onChange={(value) => handleAdvancedFilterChange('venueType', value)}
                  placeholder="Select Type"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-primary mb-2">
                  Minimum Rating
                </label>
                <Select
                  options={[
                    { value: '', label: 'Any Rating' },
                    { value: '4.5', label: '4.5+ Stars' },
                    { value: '4', label: '4+ Stars' },
                    { value: '3.5', label: '3.5+ Stars' },
                    { value: '3', label: '3+ Stars' }
                  ]}
                  value={advancedFilters.minRating}
                  onChange={(value) => handleAdvancedFilterChange('minRating', value)}
                  placeholder="Select Rating"
                />
              </div>
            </div>

            {/* Amenities Filter */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Required Amenities
              </label>
              <div className="flex flex-wrap gap-2">
                {[
                  'Parking', 'Changing Rooms', 'Equipment Rental', 'Refreshments', 
                  'WiFi', 'Air Conditioning', 'Shower', 'Lockers'
                ].map((amenity) => (
                  <Button
                    key={amenity}
                    type="button"
                    variant={advancedFilters.amenities?.includes(amenity) ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      const currentAmenities = advancedFilters.amenities || [];
                      const newAmenities = currentAmenities.includes(amenity)
                        ? currentAmenities.filter(a => a !== amenity)
                        : [...currentAmenities, amenity];
                      handleAdvancedFilterChange('amenities', newAmenities);
                    }}
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4 space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={clearAdvancedFilters}
              >
                Clear Filters
              </Button>
              <Button
                type="button"
                variant="default"
                onClick={applyAdvancedFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;