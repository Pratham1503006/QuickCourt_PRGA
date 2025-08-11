import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const VenueList = ({ venues, onEdit, onDelete, onManageCourts, onViewBookings }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAndSortedVenues = venues
    .filter(venue => {
      const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           venue.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || venue.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'courts':
          return b.totalCourts - a.totalCourts;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'pending', label: 'Pending' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'created', label: 'Recently Created' },
    { value: 'courts', label: 'Number of Courts' },
    { value: 'status', label: 'Status' }
  ];

  return (
    <div>
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search venues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
          
          <Select
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Filter by status"
          />
          
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
          />
        </div>

        <div className="flex items-center text-sm text-muted-foreground">
          {filteredAndSortedVenues.length} venue{filteredAndSortedVenues.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Venues Grid */}
      {filteredAndSortedVenues.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Building" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No venues match your criteria' : 'No venues yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by adding your first sports venue'}
          </p>
          {(!searchTerm && statusFilter === 'all') && (
            <Button variant="default">
              <Icon name="Plus" size={16} className="mr-2" />
              Add Your First Venue
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAndSortedVenues.map((venue) => (
            <div key={venue.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-md transition-shadow">
              {/* Venue Image */}
              <div className="relative h-48">
                <img
                  src={venue.images[0] || '/api/placeholder/400/300'}
                  alt={venue.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(venue.status)}`}>
                    {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getApprovalStatusColor(venue.approvalStatus)}`}>
                    {venue.approvalStatus.charAt(0).toUpperCase() + venue.approvalStatus.slice(1)}
                  </span>
                </div>
              </div>

              {/* Venue Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">{venue.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Icon name="MapPin" size={14} className="mr-1" />
                    {venue.location}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {venue.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-card-foreground">{venue.totalCourts}</div>
                    <div className="text-xs text-muted-foreground">Courts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-card-foreground">{venue.activeCourts}</div>
                    <div className="text-xs text-muted-foreground">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-card-foreground">{venue.sportTypes.length}</div>
                    <div className="text-xs text-muted-foreground">Sports</div>
                  </div>
                </div>

                {/* Sports Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {venue.sportTypes.slice(0, 3).map((sport, index) => (
                    <span key={index} className="px-2 py-1 bg-muted text-xs rounded-full">
                      {sport}
                    </span>
                  ))}
                  {venue.sportTypes.length > 3 && (
                    <span className="px-2 py-1 bg-muted text-xs rounded-full">
                      +{venue.sportTypes.length - 3} more
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onEdit(venue)}
                  >
                    <Icon name="Edit" size={14} className="mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onManageCourts(venue.id)}
                  >
                    <Icon name="MapPin" size={14} className="mr-1" />
                    Courts
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onViewBookings(venue.id)}
                  >
                    <Icon name="Calendar" size={14} className="mr-1" />
                    Bookings
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(venue.id)}
                  >
                    <Icon name="Trash2" size={14} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VenueList;
