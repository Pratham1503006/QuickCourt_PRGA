import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MapView = ({ venues, selectedVenue, onVenueSelect, onClose }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // New York City
  const [zoom, setZoom] = useState(12);

  // Mock venue locations for demonstration
  const venueLocations = venues?.map((venue, index) => ({
    ...venue,
    lat: mapCenter?.lat + (Math.random() - 0.5) * 0.1,
    lng: mapCenter?.lng + (Math.random() - 0.5) * 0.1
  }));

  const handleVenueClick = (venue) => {
    onVenueSelect(venue);
    setMapCenter({ lat: venue?.lat, lng: venue?.lng });
    setZoom(15);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 8));
  };

  const handleRecenter = () => {
    setMapCenter({ lat: 40.7128, lng: -74.0060 });
    setZoom(12);
  };

  return (
    <div className="relative h-full bg-muted rounded-lg overflow-hidden">
      {/* Map Container */}
      <div className="w-full h-full">
        <iframe
          width="100%"
          height="100%"
          loading="lazy"
          title="Venues Map"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${mapCenter?.lat},${mapCenter?.lng}&z=${zoom}&output=embed`}
          className="border-0"
        />
      </div>
      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomIn}
          className="bg-white shadow-soft"
          title="Zoom In"
        >
          <Icon name="Plus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleZoomOut}
          className="bg-white shadow-soft"
          title="Zoom Out"
        >
          <Icon name="Minus" size={16} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleRecenter}
          className="bg-white shadow-soft"
          title="Recenter"
        >
          <Icon name="RotateCcw" size={16} />
        </Button>
      </div>
      {/* Close Button (Mobile) */}
      <div className="absolute top-4 left-4 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={onClose}
          className="bg-white shadow-soft"
        >
          <Icon name="X" size={16} />
        </Button>
      </div>
      {/* Venue Markers Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {venueLocations?.map((venue, index) => (
          <div
            key={venue?.id}
            className="absolute pointer-events-auto"
            style={{
              left: `${20 + (index % 5) * 15}%`,
              top: `${20 + Math.floor(index / 5) * 15}%`
            }}
          >
            <button
              onClick={() => handleVenueClick(venue)}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-soft transition-all hover:scale-110 ${
                selectedVenue?.id === venue?.id
                  ? 'bg-primary ring-2 ring-white' :'bg-secondary'
              }`}
              title={venue?.name}
            >
              ${venue?.pricePerHour}
            </button>
          </div>
        ))}
      </div>
      {/* Selected Venue Info */}
      {selectedVenue && (
        <div className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-elevated p-4">
          <div className="flex items-start space-x-3">
            <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={selectedVenue?.image}
                alt={selectedVenue?.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/assets/images/no_image.png';
                }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-text-primary text-sm mb-1 truncate">
                {selectedVenue?.name}
              </h4>
              <p className="text-xs text-text-secondary mb-2 flex items-center">
                <Icon name="MapPin" size={12} className="mr-1" />
                {selectedVenue?.location}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-primary">
                  ${selectedVenue?.pricePerHour}/hour
                </span>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={12} className="text-yellow-400 fill-current" />
                  <span className="text-xs text-text-secondary">
                    {selectedVenue?.rating}
                  </span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onVenueSelect(null)}
              className="w-6 h-6 flex-shrink-0"
            >
              <Icon name="X" size={14} />
            </Button>
          </div>
        </div>
      )}
      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-soft p-3 text-xs">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-4 h-4 bg-secondary rounded-full"></div>
          <span>Available venues</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-primary rounded-full"></div>
          <span>Selected venue</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;