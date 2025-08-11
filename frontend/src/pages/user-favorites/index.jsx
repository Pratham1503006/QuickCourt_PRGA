import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { venueService } from '../../services/venueService';
import { notificationService } from '../../services/notificationService';
import Header from '../../components/ui/Header';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import VenueCard from '../venue-search-listings/components/VenueCard';

const UserFavorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadFavorites();
    }
  }, [user?.id]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const { favorites: userFavorites, error } = await venueService.getUserFavorites(user.id);
      
      if (error) {
        throw new Error(error);
      }
      
      setFavorites(userFavorites);
    } catch (err) {
      setError(err.message);
      notificationService.error('Failed to load favorites. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = async (venueId, newFavoriteState) => {
    try {
      const result = await venueService.toggleFavorite(user.id, venueId, !newFavoriteState);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      // Update local state
      if (newFavoriteState) {
        // Remove from favorites
        setFavorites(prev => prev.filter(fav => fav.id !== venueId));
        notificationService.removedFromFavorites('Venue');
      } else {
        // Add to favorites (this would require fetching the full venue data)
        // For simplicity, we'll just reload the favorites
        loadFavorites();
        notificationService.addedToFavorites('Venue');
      }
    } catch (err) {
      notificationService.error('Failed to update favorites');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-grow pt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Favorites</h1>
            <p className="text-muted-foreground">View and manage your favorite venues</p>
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {favorites?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                <VenueCard
                  key={favorite.id}
                  venue={favorite}
                  isFavorited={true}
                  onFavoriteToggle={handleFavoriteToggle}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No favorites yet"
              description="You haven't added any venues to your favorites. Start exploring and save your favorite venues!"
              action={{
                label: "Browse Venues",
                onClick: () => navigate('/venue-search-listings')
              }}
            />
          )}
        </div>
      </main>
      
    </div>
  );
};

export default UserFavorites;
