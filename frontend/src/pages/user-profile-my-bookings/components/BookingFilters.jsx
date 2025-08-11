import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const BookingFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  bookingCounts 
}) => {
  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'confirmed', label: `Confirmed (${bookingCounts?.confirmed || 0})` },
    { value: 'pending', label: `Pending (${bookingCounts?.pending || 0})` },
    { value: 'completed', label: `Completed (${bookingCounts?.completed || 0})` },
    { value: 'cancelled', label: `Cancelled (${bookingCounts?.cancelled || 0})` }
  ];

  const sportOptions = [
    { value: '', label: 'All Sports' },
    { value: 'basketball', label: 'Basketball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'badminton', label: 'Badminton' },
    { value: 'football', label: 'Football' },
    { value: 'volleyball', label: 'Volleyball' },
    { value: 'swimming', label: 'Swimming' },
    { value: 'cricket', label: 'Cricket' },
    { value: 'table-tennis', label: 'Table Tennis' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'amount-desc', label: 'Highest Amount' },
    { value: 'amount-asc', label: 'Lowest Amount' },
    { value: 'venue-name', label: 'Venue Name A-Z' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const hasActiveFilters = () => {
    return filters?.search || 
           filters?.status || 
           filters?.sport || 
           filters?.dateFrom || 
           filters?.dateTo ||
           filters?.sortBy !== 'date-desc';
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">Filter & Search</h3>
        {hasActiveFilters() && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Search */}
        <div className="lg:col-span-2">
          <Input
            type="search"
            placeholder="Search venues, courts, or booking ID..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
          />
        </div>

        {/* Status Filter */}
        <Select
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          placeholder="Filter by status"
        />

        {/* Sport Filter */}
        <Select
          options={sportOptions}
          value={filters?.sport}
          onChange={(value) => handleFilterChange('sport', value)}
          placeholder="Filter by sport"
        />

        {/* Date From */}
        <Input
          type="date"
          label="From Date"
          value={filters?.dateFrom}
          onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
        />

        {/* Date To */}
        <Input
          type="date"
          label="To Date"
          value={filters?.dateTo}
          onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
        />
      </div>
      {/* Sort and Additional Options */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-4 mb-3 sm:mb-0">
          <Select
            options={sortOptions}
            value={filters?.sortBy}
            onChange={(value) => handleFilterChange('sortBy', value)}
            placeholder="Sort by"
          />
        </div>

        {/* Quick Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filters?.quickFilter === 'upcoming' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('quickFilter', 
              filters?.quickFilter === 'upcoming' ? '' : 'upcoming'
            )}
            iconName="Calendar"
            iconPosition="left"
          >
            Upcoming
          </Button>
          <Button
            variant={filters?.quickFilter === 'this-month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('quickFilter', 
              filters?.quickFilter === 'this-month' ? '' : 'this-month'
            )}
            iconName="CalendarDays"
            iconPosition="left"
          >
            This Month
          </Button>
          <Button
            variant={filters?.quickFilter === 'needs-review' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleFilterChange('quickFilter', 
              filters?.quickFilter === 'needs-review' ? '' : 'needs-review'
            )}
            iconName="Star"
            iconPosition="left"
          >
            Needs Review
          </Button>
        </div>
      </div>
      {/* Active Filters Display */}
      {hasActiveFilters() && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {filters?.search && (
              <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <Icon name="Search" size={14} className="mr-1" />
                Search: "{filters?.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-2 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            {filters?.status && (
              <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                Status: {statusOptions?.find(opt => opt?.value === filters?.status)?.label}
                <button
                  onClick={() => handleFilterChange('status', '')}
                  className="ml-2 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            {filters?.sport && (
              <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                Sport: {sportOptions?.find(opt => opt?.value === filters?.sport)?.label}
                <button
                  onClick={() => handleFilterChange('sport', '')}
                  className="ml-2 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
            {(filters?.dateFrom || filters?.dateTo) && (
              <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <Icon name="Calendar" size={14} className="mr-1" />
                Date Range
                <button
                  onClick={() => {
                    handleFilterChange('dateFrom', '');
                    handleFilterChange('dateTo', '');
                  }}
                  className="ml-2 hover:bg-primary/20 rounded-full p-0.5"
                >
                  <Icon name="X" size={12} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFilters;