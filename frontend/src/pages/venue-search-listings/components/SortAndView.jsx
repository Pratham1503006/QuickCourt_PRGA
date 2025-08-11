import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';


const SortAndView = ({ 
  sortBy, 
  setSortBy, 
  viewMode, 
  setViewMode, 
  showMap, 
  setShowMap, 
  resultsCount,
  onFilterToggle 
}) => {
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'distance', label: 'Nearest First' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'availability', label: 'Most Available' },
    { value: 'newest', label: 'Newest First' }
  ];

  return (
    <div className="bg-surface border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Results Count and Filter Toggle */}
          <div className="flex items-center justify-between lg:justify-start space-x-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={onFilterToggle}
                iconName="Filter"
                iconPosition="left"
                className="lg:hidden"
              >
                Filters
              </Button>
              <span className="text-sm text-text-secondary">
                {resultsCount} venues found
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between lg:justify-end space-x-4">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary hidden sm:block">Sort by:</span>
              <div className="w-48">
                <Select
                  options={sortOptions}
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort by"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                iconName="Grid3X3"
                className="w-8 h-8 p-0"
                title="Grid View"
              />
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                iconName="List"
                className="w-8 h-8 p-0"
                title="List View"
              />
            </div>

            {/* Map Toggle */}
            <Button
              variant={showMap ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowMap(!showMap)}
              iconName="Map"
              iconPosition="left"
              className="hidden lg:flex"
            >
              {showMap ? 'Hide Map' : 'Show Map'}
            </Button>
          </div>
        </div>

        {/* Mobile Map Toggle */}
        <div className="lg:hidden mt-4">
          <Button
            variant={showMap ? 'default' : 'outline'}
            size="sm"
            onClick={() => setShowMap(!showMap)}
            iconName="Map"
            iconPosition="left"
            fullWidth
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SortAndView;