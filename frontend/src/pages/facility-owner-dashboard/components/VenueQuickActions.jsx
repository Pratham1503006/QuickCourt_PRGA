import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VenueQuickActions = ({ venues, onManageVenue }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {venues.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="Building" size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No venues added yet</p>
          <Button variant="default" size="sm">
            <Icon name="Plus" size={16} className="mr-2" />
            Add Your First Venue
          </Button>
        </div>
      ) : (
        venues.map((venue) => (
          <div key={venue.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex">
              <img 
                src={venue.image} 
                alt={venue.name}
                className="w-20 h-20 object-cover"
              />
              <div className="flex-1 p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-card-foreground">{venue.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(venue.status)}`}>
                    {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                  </span>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">{venue.location}</p>
                
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-muted-foreground">Courts</p>
                    <p className="font-medium text-card-foreground">{venue.activeCourts}/{venue.totalCourts}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Today</p>
                    <p className="font-medium text-card-foreground">{venue.todayBookings} bookings</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Revenue</p>
                    <p className="font-medium text-green-600">${venue.monthlyRevenue}</p>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onManageVenue(venue.id)}
                  >
                    <Icon name="Settings" size={14} className="mr-1" />
                    Manage
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                  >
                    <Icon name="BarChart3" size={14} className="mr-1" />
                    Stats
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default VenueQuickActions;
