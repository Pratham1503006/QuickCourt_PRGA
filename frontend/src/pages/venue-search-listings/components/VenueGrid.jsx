import React from 'react';
import VenueCard from './VenueCard';
import Button from '../../../components/ui/Button';

const VenueGrid = ({ venues, loading, onFavoriteToggle, onQuickBook, viewMode, searchQuery, onClearFilters, onBrowseAll }) => {
  if (loading) {
    return (
      <div className={`grid gap-6 ${
        viewMode === 'grid' ?'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :'grid-cols-1'
      }`}>
        {Array.from({ length: 9 })?.map((_, index) => (
          <div key={index} className="bg-card border border-border rounded-lg overflow-hidden">
            <div className="h-48 bg-muted animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-muted rounded animate-pulse" />
              <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
              <div className="flex space-x-2">
                <div className="h-6 bg-muted rounded-full w-16 animate-pulse" />
                <div className="h-6 bg-muted rounded-full w-20 animate-pulse" />
              </div>
              <div className="flex space-x-2 pt-2">
                <div className="h-8 bg-muted rounded flex-1 animate-pulse" />
                <div className="h-8 bg-muted rounded flex-1 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (venues?.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
          <svg className="w-12 h-12 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          {searchQuery ? `No venues found for "${searchQuery}"` : 'No venues found'}
        </h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          {searchQuery 
            ? `We couldn't find any venues matching your search. Try adjusting your search terms or filters.`
            : 'Try adjusting your search criteria or filters to find venues in your area.'
          }
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {onClearFilters && (
            <Button
              variant="default"
              onClick={onClearFilters}
              className="px-6 py-2"
            >
              Clear All Filters
            </Button>
          )}
          {onBrowseAll && (
            <Button
              variant="outline"
              onClick={onBrowseAll}
              className="px-6 py-2"
            >
              Browse All Venues
            </Button>
          )}
        </div>
        
        {/* Search suggestions */}
        {searchQuery && (
          <div className="mt-8 p-4 bg-muted rounded-lg max-w-md mx-auto">
            <h4 className="font-medium text-text-primary mb-2">Search suggestions:</h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {['Basketball', 'Tennis', 'Swimming', 'Football', 'Gym'].map(sport => (
                <Button
                  key={sport}
                  variant="outline"
                  size="sm"
                  onClick={() => window.location.href = `?sport=${sport.toLowerCase()}`}
                >
                  {sport}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`grid gap-6 ${
      viewMode === 'grid' ?'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :'grid-cols-1'
    }`}>
      {venues?.map((venue) => (
        <VenueCard
          key={venue?.id}
          venue={venue}
          onFavoriteToggle={onFavoriteToggle}
          onQuickBook={onQuickBook}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
};

export default VenueGrid;