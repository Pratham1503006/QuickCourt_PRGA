import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyBookings = ({ hasFilters, onClearFilters }) => {
  const navigate = useNavigate();

  if (hasFilters) {
    return (
      <div className="bg-card rounded-lg border border-border p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">No bookings found</h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          We couldn't find any bookings matching your current filters. Try adjusting your search criteria or clearing all filters.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="outline"
            onClick={onClearFilters}
            iconName="X"
            iconPosition="left"
          >
            Clear Filters
          </Button>
          <Button
            variant="default"
            onClick={() => navigate('/venue-search-listings')}
            iconName="Search"
            iconPosition="left"
          >
            Find Venues
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border p-12 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icon name="Calendar" size={40} className="text-primary" />
      </div>
      <h3 className="text-2xl font-bold text-text-primary mb-3">No bookings yet</h3>
      <p className="text-text-secondary mb-8 max-w-lg mx-auto">
        You haven't made any bookings yet. Start exploring our amazing sports facilities and book your first court today!
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="default"
          size="lg"
          onClick={() => navigate('/venue-search-listings')}
          iconName="Search"
          iconPosition="left"
        >
          Browse Venues
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate('/homepage-dashboard')}
          iconName="Home"
          iconPosition="left"
        >
          Go to Homepage
        </Button>
      </div>
      {/* Popular Sports Quick Access */}
      <div className="mt-8 pt-8 border-t border-border">
        <p className="text-sm text-text-secondary mb-4">Popular sports to get you started:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {['Basketball', 'Tennis', 'Badminton', 'Football']?.map((sport) => (
            <Button
              key={sport}
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/venue-search-listings?sport=${sport?.toLowerCase()}`)}
              className="border border-border"
            >
              {sport}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmptyBookings;