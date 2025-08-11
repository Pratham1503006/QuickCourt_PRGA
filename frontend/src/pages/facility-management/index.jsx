import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import VenueForm from './components/VenueForm';
import VenueList from './components/VenueList';
import ImageUpload from './components/ImageUpload';

const FacilityManagement = () => {
  const navigate = useNavigate();
  const { venueId } = useParams();
  const [activeTab, setActiveTab] = useState(venueId ? 'edit' : 'list');
  const [loading, setLoading] = useState(false);
  const [venues, setVenues] = useState([
    {
      id: 'venue_001',
      name: 'Downtown Sports Complex',
      description: 'Modern sports complex featuring state-of-the-art facilities with professional-grade courts and comprehensive amenities.',
      address: {
        street: '123 Sports Avenue',
        city: 'Downtown',
        state: 'California',
        zipCode: '90210',
        country: 'United States'
      },
      location: 'Downtown, City Center',
      coordinates: { lat: 34.0522, lng: -118.2437 },
      sportTypes: ['Basketball', 'Tennis', 'Badminton'],
      amenities: ['Parking', 'Locker Rooms', 'Cafeteria', 'WiFi', 'AC', 'Pro Shop'],
      images: [
        'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop'
      ],
      operatingHours: {
        monday: { isOpen: true, open: '06:00', close: '22:00' },
        tuesday: { isOpen: true, open: '06:00', close: '22:00' },
        wednesday: { isOpen: true, open: '06:00', close: '22:00' },
        thursday: { isOpen: true, open: '06:00', close: '22:00' },
        friday: { isOpen: true, open: '06:00', close: '23:00' },
        saturday: { isOpen: true, open: '07:00', close: '23:00' },
        sunday: { isOpen: true, open: '07:00', close: '21:00' }
      },
      contactInfo: {
        phone: '(555) 123-4567',
        email: 'info@downtownsports.com',
        website: 'www.downtownsports.com'
      },
      status: 'active',
      approvalStatus: 'approved',
      totalCourts: 6,
      activeCourts: 6,
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2025-01-10T00:00:00Z'
    },
    {
      id: 'venue_002',
      name: 'Elite Tennis Club',
      description: 'Premium tennis facility with clay and hard courts, offering professional coaching services and equipment rental.',
      address: {
        street: '456 Tennis Road',
        city: 'Uptown',
        state: 'California',
        zipCode: '90211',
        country: 'United States'
      },
      location: 'Uptown District',
      coordinates: { lat: 34.0622, lng: -118.2537 },
      sportTypes: ['Tennis', 'Pickleball'],
      amenities: ['Parking', 'Pro Shop', 'Coaching', 'Equipment Rental', 'Cafeteria'],
      images: [
        'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800&h=600&fit=crop',
        'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop'
      ],
      operatingHours: {
        monday: { isOpen: true, open: '07:00', close: '22:00' },
        tuesday: { isOpen: true, open: '07:00', close: '22:00' },
        wednesday: { isOpen: true, open: '07:00', close: '22:00' },
        thursday: { isOpen: true, open: '07:00', close: '22:00' },
        friday: { isOpen: true, open: '07:00', close: '22:00' },
        saturday: { isOpen: true, open: '07:00', close: '22:00' },
        sunday: { isOpen: true, open: '08:00', close: '20:00' }
      },
      contactInfo: {
        phone: '(555) 987-6543',
        email: 'contact@elitetennisclub.com',
        website: 'www.elitetennisclub.com'
      },
      status: 'active',
      approvalStatus: 'approved',
      totalCourts: 4,
      activeCourts: 4,
      createdAt: '2024-02-20T00:00:00Z',
      updatedAt: '2025-01-08T00:00:00Z'
    }
  ]);

  const [selectedVenue, setSelectedVenue] = useState(null);
  const [isFormDirty, setIsFormDirty] = useState(false);

  const sportsOptions = [
    { value: 'basketball', label: 'Basketball' },
    { value: 'tennis', label: 'Tennis' },
    { value: 'badminton', label: 'Badminton' },
    { value: 'volleyball', label: 'Volleyball' },
    { value: 'pickleball', label: 'Pickleball' },
    { value: 'squash', label: 'Squash' },
    { value: 'table_tennis', label: 'Table Tennis' },
    { value: 'futsal', label: 'Futsal' }
  ];

  const amenitiesOptions = [
    { value: 'parking', label: 'Parking' },
    { value: 'locker_rooms', label: 'Locker Rooms' },
    { value: 'cafeteria', label: 'Cafeteria' },
    { value: 'wifi', label: 'WiFi' },
    { value: 'ac', label: 'Air Conditioning' },
    { value: 'pro_shop', label: 'Pro Shop' },
    { value: 'equipment_rental', label: 'Equipment Rental' },
    { value: 'coaching', label: 'Coaching' },
    { value: 'first_aid', label: 'First Aid' },
    { value: 'spectator_area', label: 'Spectator Area' },
    { value: 'water_station', label: 'Water Station' },
    { value: 'showers', label: 'Showers' }
  ];

  useEffect(() => {
    if (venueId && venues.length > 0) {
      const venue = venues.find(v => v.id === venueId);
      if (venue) {
        setSelectedVenue(venue);
        setActiveTab('edit');
      } else {
        // Venue not found, redirect to list
        navigate('/facility-management');
      }
    }
  }, [venueId, venues, navigate]);

  const handleCreateVenue = async (venueData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newVenue = {
        id: `venue_${Date.now()}`,
        ...venueData,
        status: 'active',
        approvalStatus: 'pending',
        totalCourts: 0,
        activeCourts: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setVenues(prev => [...prev, newVenue]);
      setActiveTab('list');
      setIsFormDirty(false);
      
      // Show success message
      alert('Venue created successfully! It will be reviewed by admin for approval.');
    } catch (error) {
      console.error('Error creating venue:', error);
      alert('Failed to create venue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateVenue = async (venueId, venueData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setVenues(prev => prev.map(venue => 
        venue.id === venueId 
          ? { ...venue, ...venueData, updatedAt: new Date().toISOString() }
          : venue
      ));

      setSelectedVenue(null);
      setActiveTab('list');
      setIsFormDirty(false);
      
      // Show success message
      alert('Venue updated successfully!');
    } catch (error) {
      console.error('Error updating venue:', error);
      alert('Failed to update venue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVenue = async (venueId) => {
    if (!window.confirm('Are you sure you want to delete this venue? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setVenues(prev => prev.filter(venue => venue.id !== venueId));
      
      if (selectedVenue?.id === venueId) {
        setSelectedVenue(null);
        setActiveTab('list');
        navigate('/facility-management');
      }
      
      alert('Venue deleted successfully!');
    } catch (error) {
      console.error('Error deleting venue:', error);
      alert('Failed to delete venue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVenue = (venue) => {
    setSelectedVenue(venue);
    setActiveTab('edit');
    navigate(`/facility-management/${venue.id}`);
  };

  const handleManageCourts = (venueId) => {
    navigate(`/court-management/${venueId}`);
  };

  const handleViewBookings = (venueId) => {
    navigate(`/booking-overview?venue=${venueId}`);
  };

  const tabs = [
    { id: 'list', label: 'My Venues', icon: 'Building' },
    { id: 'create', label: 'Add New Venue', icon: 'Plus' },
    { id: 'edit', label: 'Edit Venue', icon: 'Edit', hidden: !selectedVenue }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <button 
                onClick={() => navigate('/facility-owner-dashboard')} 
                className="hover:text-foreground transition-colors"
              >
                Dashboard
              </button>
              <Icon name="ChevronRight" size={16} />
              <span>Facility Management</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Facility Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your sports venues and facilities
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/facility-owner-dashboard')}
                >
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Back to Dashboard
                </Button>
                
                <Button 
                  variant="default" 
                  onClick={() => setActiveTab('create')}
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Add New Venue
                </Button>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border mb-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.filter(tab => !tab.hidden).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-card rounded-lg p-6 flex items-center space-x-3">
                <LoadingSpinner size="sm" />
                <span className="text-card-foreground">Processing...</span>
              </div>
            </div>
          )}

          {/* Tab Content */}
          <div className="min-h-[600px]">
            {activeTab === 'list' && (
              <VenueList
                venues={venues}
                onEdit={handleEditVenue}
                onDelete={handleDeleteVenue}
                onManageCourts={handleManageCourts}
                onViewBookings={handleViewBookings}
              />
            )}

            {activeTab === 'create' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Add New Venue</h2>
                  <p className="text-muted-foreground">
                    Create a new sports venue. Your venue will be reviewed by our admin team before going live.
                  </p>
                </div>
                <VenueForm
                  onSubmit={handleCreateVenue}
                  sportsOptions={sportsOptions}
                  amenitiesOptions={amenitiesOptions}
                  isFormDirty={isFormDirty}
                  setIsFormDirty={setIsFormDirty}
                />
              </div>
            )}

            {activeTab === 'edit' && selectedVenue && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Edit Venue</h2>
                  <p className="text-muted-foreground">
                    Update your venue information. Changes will be reviewed if they affect core venue details.
                  </p>
                </div>
                <VenueForm
                  venue={selectedVenue}
                  onSubmit={(data) => handleUpdateVenue(selectedVenue.id, data)}
                  sportsOptions={sportsOptions}
                  amenitiesOptions={amenitiesOptions}
                  isFormDirty={isFormDirty}
                  setIsFormDirty={setIsFormDirty}
                  isEdit={true}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacilityManagement;
