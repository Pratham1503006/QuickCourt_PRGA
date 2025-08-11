import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { venueService } from '../../services/venueService';
import { notificationService } from '../../services/notificationService.jsx';
import Header from '../../components/ui/Header';
import SearchBar from './components/SearchBar';
import FilterSidebar from './components/FilterSidebar';
import SortAndView from './components/SortAndView';
import ActiveFilters from './components/ActiveFilters';
import VenueGrid from './components/VenueGrid';
import MapView from './components/MapView';
import Pagination from './components/Pagination';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const VenueSearchListings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('q') || '');
  const [selectedSport, setSelectedSport] = useState(searchParams?.get('sport') || '');
  const [selectedLocation, setSelectedLocation] = useState(searchParams?.get('location') || '');
  const [filters, setFilters] = useState({
    sportTypes: [],
    venueTypes: [],
    amenities: [],
    priceRange: null,
    minRating: null
  });

  // UI state
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [showMap, setShowMap] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [loading, setLoading] = useState(false);

  // Data state
  const [venues, setVenues] = useState([]);
  const [totalVenues, setTotalVenues] = useState(0);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(12);

  // Load venues data
  const loadVenues = async () => {
    try {
      setLoading(true);
      
      const searchCriteria = {
        query: searchQuery,
        sport: selectedSport,
        location: selectedLocation,
        ...filters,
        sortBy,
        page: currentPage,
        limit: resultsPerPage
      };

      const result = await venueService.searchVenues(searchCriteria);
      
      if (result.success) {
        setVenues(result.data.venues);
        setTotalVenues(result.data.total);
      } else {
        notificationService.error('Failed to load venues. Please try again.');
        setVenues([]);
        setTotalVenues(0);
      }
    } catch (error) {
      console.error('Error loading venues:', error);
      notificationService.error('Failed to load venues. Please try again.');
      setVenues([]);
      setTotalVenues(0);
    } finally {
      setLoading(false);
    }
  };

  // Load venues on component mount and when search criteria change
  useEffect(() => {
    loadVenues();
  }, [searchQuery, selectedSport, selectedLocation, filters, sortBy, currentPage]);

  const totalPages = Math.ceil(totalVenues / resultsPerPage);

  // Handlers
  const handleSearch = (searchData) => {
    setSearchQuery(searchData?.query || '');
    setSelectedSport(searchData?.sport || '');
    setSelectedLocation(searchData?.location || '');
    setCurrentPage(1);

    // Update URL params
    const params = new URLSearchParams();
    if (searchData?.query) params?.set('q', searchData?.query);
    if (searchData?.sport) params?.set('sport', searchData?.sport);
    if (searchData?.location) params?.set('location', searchData?.location);
    setSearchParams(params);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleRemoveFilter = (category, value) => {
    const newFilters = { ...filters };
    
    if (category === 'priceRange' || category === 'minRating') {
      newFilters[category] = null;
    } else if (Array.isArray(newFilters?.[category])) {
      newFilters[category] = newFilters?.[category]?.filter(item => item !== value);
    }
    
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearAllFilters = () => {
    setFilters({
      sportTypes: [],
      venueTypes: [],
      amenities: [],
      priceRange: null,
      minRating: null
    });
    setCurrentPage(1);
  };

  const handleFavoriteToggle = async (venueId, isFavorited) => {
    try {
      const result = await venueService.toggleFavorite(user.id, venueId, isFavorited);
      if (result.success) {
        // Update local state
        setVenues(venues.map(venue => 
          venue.id === venueId 
            ? { ...venue, isFavorited } 
            : venue
        ));
        
        notificationService.info(
          isFavorited 
            ? 'Added to favorites' 
            : 'Removed from favorites'
        );
      } else {
        notificationService.error('Failed to update favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      notificationService.error('Failed to update favorites');
    }
  };

  const handleQuickBook = (venue) => {
    navigate(`/venue-details-booking?id=${venue?.id}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initialize from URL params
  useEffect(() => {
    const query = searchParams?.get('q');
    const sport = searchParams?.get('sport');
    const location = searchParams?.get('location');
    
    if (query) setSearchQuery(query);
    if (sport) setSelectedSport(sport);
    if (location) setSelectedLocation(location);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Active Filters */}
        <ActiveFilters
          filters={filters}
          onRemoveFilter={handleRemoveFilter}
          onClearAll={handleClearAllFilters}
        />

        {/* Sort and View Controls */}
        <SortAndView
          sortBy={sortBy}
          setSortBy={setSortBy}
          viewMode={viewMode}
          setViewMode={setViewMode}
          showMap={showMap}
          setShowMap={setShowMap}
          resultsCount={totalVenues}
          onFilterToggle={() => setIsFilterSidebarOpen(true)}
        />

        {/* Search Results Summary */}
        {(searchQuery || selectedSport || selectedLocation || Object.values(filters).some(f => f && (Array.isArray(f) ? f.length > 0 : true))) && (
          <div className="max-w-7xl mx-auto px-4 py-3 bg-muted/50 border-b border-border">
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="text-text-secondary">
                Search results
                {searchQuery && <> for "<span className="font-medium text-text-primary">{searchQuery}</span>"</>}
                {selectedSport && <> in <span className="font-medium text-text-primary capitalize">{selectedSport}</span></>}
                {selectedLocation && <> near <span className="font-medium text-text-primary capitalize">{selectedLocation}</span></>}
              </span>
              
              {(searchQuery || selectedSport || selectedLocation) && (
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSport('');
                    setSelectedLocation('');
                    // Update URL
                    setSearchParams(new URLSearchParams());
                  }}
                  className="h-auto p-0 text-xs"
                >
                  Clear search
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex gap-6">
            {/* Filter Sidebar - Desktop */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <FilterSidebar
                isOpen={true}
                onClose={() => {}}
                filters={filters}
                onFiltersChange={handleFiltersChange}
              />
            </div>

            {/* Filter Sidebar - Mobile */}
            <FilterSidebar
              isOpen={isFilterSidebarOpen}
              onClose={() => setIsFilterSidebarOpen(false)}
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />

            {/* Results Area */}
            <div className="flex-1 min-w-0">
              {showMap ? (
                <div className="h-96 lg:h-[600px] mb-6">
                  <MapView
                    venues={venues}
                    selectedVenue={selectedVenue}
                    onVenueSelect={setSelectedVenue}
                    onClose={() => setShowMap(false)}
                  />
                </div>
              ) : null}

              {/* Venue Grid */}
              <VenueGrid
                venues={venues}
                loading={loading}
                onFavoriteToggle={handleFavoriteToggle}
                onQuickBook={handleQuickBook}
                viewMode={viewMode}
                searchQuery={searchQuery}
                onClearFilters={handleClearAllFilters}
                onBrowseAll={() => {
                  setSearchQuery('');
                  setSelectedSport('');
                  setSelectedLocation('');
                  handleClearAllFilters();
                }}
              />

              {/* Pagination */}
              {!loading && totalVenues > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalResults={totalVenues}
                  resultsPerPage={resultsPerPage}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        </div>

        {/* Floating Action Button - Mobile */}
        <div className="fixed bottom-6 right-6 lg:hidden z-40">
          <Button
            variant="default"
            size="icon"
            onClick={() => setIsFilterSidebarOpen(true)}
            className="w-14 h-14 rounded-full shadow-elevated"
          >
            <Icon name="Filter" size={24} />
          </Button>
        </div>
      </main>
    </div>
  );
};

export default VenueSearchListings;