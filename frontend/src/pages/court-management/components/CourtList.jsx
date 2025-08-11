import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CourtList = ({ courts, onEdit, onDelete, onManageTimeSlots, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sportFilter, setSportFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const uniqueSports = [...new Set(courts.map(court => court.sportType))];

  const filteredAndSortedCourts = courts
    .filter(court => {
      const matchesSearch = court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           court.sportType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           court.surface.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSport = sportFilter === 'all' || court.sportType === sportFilter;
      const matchesStatus = statusFilter === 'all' || court.status === statusFilter;
      return matchesSearch && matchesSport && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'sport':
          return a.sportType.localeCompare(b.sportType);
        case 'price':
          return b.pricePerHour - a.pricePerHour;
        case 'capacity':
          return b.capacity - a.capacity;
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  const sportOptions = [
    { value: 'all', label: 'All Sports' },
    ...uniqueSports.map(sport => ({ value: sport, label: sport }))
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'maintenance', label: 'Maintenance' }
  ];

  const sortOptions = [
    { value: 'name', label: 'Name' },
    { value: 'sport', label: 'Sport Type' },
    { value: 'price', label: 'Price (High to Low)' },
    { value: 'capacity', label: 'Capacity (High to Low)' },
    { value: 'status', label: 'Status' }
  ];

  const handleStatusChange = (courtId, newStatus) => {
    if (window.confirm(`Are you sure you want to change the court status to ${newStatus}?`)) {
      onStatusChange(courtId, newStatus);
    }
  };

  return (
    <div>
      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search courts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon="Search"
            />
          </div>
          
          <Select
            options={sportOptions}
            value={sportFilter}
            onChange={setSportFilter}
            placeholder="Filter by sport"
          />
          
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
          {filteredAndSortedCourts.length} court{filteredAndSortedCourts.length !== 1 ? 's' : ''} found
        </div>
      </div>

      {/* Courts Grid */}
      {filteredAndSortedCourts.length === 0 ? (
        <div className="text-center py-12">
          <Icon name="Grid3X3" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchTerm || sportFilter !== 'all' || statusFilter !== 'all' 
              ? 'No courts match your criteria' 
              : 'No courts yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || sportFilter !== 'all' || statusFilter !== 'all'
              ? 'Try adjusting your search or filters' 
              : 'Get started by adding your first court'}
          </p>
          {(!searchTerm && sportFilter === 'all' && statusFilter === 'all') && (
            <Button variant="default">
              <Icon name="Plus" size={16} className="mr-2" />
              Add Your First Court
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAndSortedCourts.map((court) => (
            <div key={court.id} className="bg-card border border-border rounded-lg overflow-hidden shadow-soft hover:shadow-md transition-shadow">
              {/* Court Image */}
              <div className="relative h-48">
                <img
                  src={court.images[0] || '/api/placeholder/400/300'}
                  alt={court.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(court.status)}`}>
                    {court.status.charAt(0).toUpperCase() + court.status.slice(1)}
                  </span>
                </div>
              </div>

              {/* Court Info */}
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground mb-1">{court.name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                    <span className="flex items-center">
                      <Icon name="Activity" size={14} className="mr-1" />
                      {court.sportType}
                    </span>
                    <span className="flex items-center">
                      <Icon name="Square" size={14} className="mr-1" />
                      {court.surface}
                    </span>
                  </div>
                  {court.dimensions.length && court.dimensions.width && (
                    <p className="text-sm text-muted-foreground">
                      {court.dimensions.length} × {court.dimensions.width} {court.dimensions.unit}
                    </p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-card-foreground">{court.capacity}</div>
                    <div className="text-xs text-muted-foreground">Capacity</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">${court.pricePerHour}</div>
                    <div className="text-xs text-muted-foreground">Per Hour</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-card-foreground">{court.features.length}</div>
                    <div className="text-xs text-muted-foreground">Features</div>
                  </div>
                </div>

                {/* Features (First 3) */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {court.features.slice(0, 3).map((feature, index) => (
                    <span key={index} className="px-2 py-1 bg-muted text-xs rounded-full">
                      {feature}
                    </span>
                  ))}
                  {court.features.length > 3 && (
                    <span className="px-2 py-1 bg-muted text-xs rounded-full">
                      +{court.features.length - 3} more
                    </span>
                  )}
                </div>

                {/* Status Change Buttons */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-card-foreground mb-2">Quick Status Change</label>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant={court.status === 'active' ? 'default' : 'outline'}
                      onClick={() => court.status !== 'active' && handleStatusChange(court.id, 'active')}
                      disabled={court.status === 'active'}
                    >
                      <Icon name="Play" size={12} className="mr-1" />
                      Active
                    </Button>
                    <Button
                      size="sm"
                      variant={court.status === 'maintenance' ? 'secondary' : 'outline'}
                      onClick={() => court.status !== 'maintenance' && handleStatusChange(court.id, 'maintenance')}
                      disabled={court.status === 'maintenance'}
                    >
                      <Icon name="Wrench" size={12} className="mr-1" />
                      Maintenance
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant="default"
                    onClick={() => onEdit(court)}
                  >
                    <Icon name="Edit" size={14} className="mr-1" />
                    Edit
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onManageTimeSlots(court)}
                  >
                    <Icon name="Clock" size={14} className="mr-1" />
                    Time Slots
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`/venue-details-booking/${court.venueId}`, '_blank')}
                  >
                    <Icon name="ExternalLink" size={14} className="mr-1" />
                    Preview
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDelete(court.id)}
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

export default CourtList;
