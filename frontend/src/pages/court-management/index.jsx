import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import CourtForm from './components/CourtForm';
import CourtList from './components/CourtList';
import TimeSlotManager from './components/TimeSlotManager';

const CourtManagement = () => {
  const navigate = useNavigate();
  const { venueId } = useParams();
  const [activeTab, setActiveTab] = useState('list');
  const [loading, setLoading] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState(null);

  // Mock venue data
  const [venue, setVenue] = useState({
    id: venueId || 'venue_001',
    name: 'Downtown Sports Complex',
    location: 'Downtown, City Center'
  });

  // Mock courts data
  const [courts, setCourts] = useState([
    {
      id: 'court_001',
      venueId: 'venue_001',
      name: 'Basketball Court A',
      sportType: 'Basketball',
      surface: 'Hardwood',
      dimensions: { length: 28, width: 15, unit: 'meters' },
      capacity: 10,
      pricePerHour: 45,
      features: ['Professional lighting', 'Sound system', 'Scoreboard', 'Air conditioning'],
      operatingHours: {
        monday: { isOpen: true, open: '06:00', close: '22:00' },
        tuesday: { isOpen: true, open: '06:00', close: '22:00' },
        wednesday: { isOpen: true, open: '06:00', close: '22:00' },
        thursday: { isOpen: true, open: '06:00', close: '22:00' },
        friday: { isOpen: true, open: '06:00', close: '23:00' },
        saturday: { isOpen: true, open: '07:00', close: '23:00' },
        sunday: { isOpen: true, open: '07:00', close: '21:00' }
      },
      maintenanceSchedule: [
        { day: 'sunday', time: '05:00-06:00', description: 'Deep cleaning' }
      ],
      status: 'active',
      images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'],
      createdAt: '2024-01-15T00:00:00Z',
      updatedAt: '2025-01-10T00:00:00Z'
    },
    {
      id: 'court_002',
      venueId: 'venue_001',
      name: 'Tennis Court 1',
      sportType: 'Tennis',
      surface: 'Hard Court',
      dimensions: { length: 23.77, width: 8.23, unit: 'meters' },
      capacity: 4,
      pricePerHour: 35,
      features: ['Net included', 'Line marking', 'Flood lights', 'Weather protection'],
      operatingHours: {
        monday: { isOpen: true, open: '06:00', close: '22:00' },
        tuesday: { isOpen: true, open: '06:00', close: '22:00' },
        wednesday: { isOpen: true, open: '06:00', close: '22:00' },
        thursday: { isOpen: true, open: '06:00', close: '22:00' },
        friday: { isOpen: true, open: '06:00', close: '23:00' },
        saturday: { isOpen: true, open: '07:00', close: '23:00' },
        sunday: { isOpen: true, open: '07:00', close: '21:00' }
      },
      maintenanceSchedule: [
        { day: 'monday', time: '05:00-06:00', description: 'Court cleaning' }
      ],
      status: 'active',
      images: ['https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop'],
      createdAt: '2024-01-20T00:00:00Z',
      updatedAt: '2025-01-08T00:00:00Z'
    },
    {
      id: 'court_003',
      venueId: 'venue_001',
      name: 'Badminton Court B',
      sportType: 'Badminton',
      surface: 'Synthetic',
      dimensions: { length: 13.4, width: 6.1, unit: 'meters' },
      capacity: 4,
      pricePerHour: 25,
      features: ['Shuttlecocks provided', 'Professional nets', 'Non-slip surface'],
      operatingHours: {
        monday: { isOpen: true, open: '07:00', close: '21:00' },
        tuesday: { isOpen: true, open: '07:00', close: '21:00' },
        wednesday: { isOpen: true, open: '07:00', close: '21:00' },
        thursday: { isOpen: true, open: '07:00', close: '21:00' },
        friday: { isOpen: true, open: '07:00', close: '22:00' },
        saturday: { isOpen: true, open: '08:00', close: '22:00' },
        sunday: { isOpen: false, open: '', close: '' }
      },
      maintenanceSchedule: [
        { day: 'sunday', time: '10:00-14:00', description: 'Deep cleaning and maintenance' }
      ],
      status: 'maintenance',
      images: ['https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop'],
      createdAt: '2024-02-01T00:00:00Z',
      updatedAt: '2025-01-05T00:00:00Z'
    }
  ]);

  const sportsOptions = [
    { value: 'Basketball', label: 'Basketball' },
    { value: 'Tennis', label: 'Tennis' },
    { value: 'Badminton', label: 'Badminton' },
    { value: 'Volleyball', label: 'Volleyball' },
    { value: 'Pickleball', label: 'Pickleball' },
    { value: 'Squash', label: 'Squash' },
    { value: 'Table Tennis', label: 'Table Tennis' },
    { value: 'Futsal', label: 'Futsal' }
  ];

  const surfaceOptions = [
    { value: 'Hardwood', label: 'Hardwood' },
    { value: 'Hard Court', label: 'Hard Court' },
    { value: 'Synthetic', label: 'Synthetic' },
    { value: 'Clay', label: 'Clay' },
    { value: 'Grass', label: 'Grass' },
    { value: 'Rubber', label: 'Rubber' },
    { value: 'Concrete', label: 'Concrete' },
    { value: 'Sand', label: 'Sand' }
  ];

  useEffect(() => {
    if (venueId) {
      // In real app, fetch venue details
      setVenue(prev => ({ ...prev, id: venueId }));
    }
  }, [venueId]);

  const handleCreateCourt = async (courtData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newCourt = {
        id: `court_${Date.now()}`,
        venueId: venue.id,
        ...courtData,
        status: 'active',
        images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setCourts(prev => [...prev, newCourt]);
      setActiveTab('list');
      alert('Court created successfully!');
    } catch (error) {
      console.error('Error creating court:', error);
      alert('Failed to create court. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourt = async (courtId, courtData) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setCourts(prev => prev.map(court => 
        court.id === courtId 
          ? { ...court, ...courtData, updatedAt: new Date().toISOString() }
          : court
      ));

      setSelectedCourt(null);
      setActiveTab('list');
      alert('Court updated successfully!');
    } catch (error) {
      console.error('Error updating court:', error);
      alert('Failed to update court. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourt = async (courtId) => {
    if (!window.confirm('Are you sure you want to delete this court? This will cancel all future bookings.')) {
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCourts(prev => prev.filter(court => court.id !== courtId));
      
      if (selectedCourt?.id === courtId) {
        setSelectedCourt(null);
        setActiveTab('list');
      }
      
      alert('Court deleted successfully!');
    } catch (error) {
      console.error('Error deleting court:', error);
      alert('Failed to delete court. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourt = (court) => {
    setSelectedCourt(court);
    setActiveTab('edit');
  };

  const handleManageTimeSlots = (court) => {
    setSelectedCourt(court);
    setActiveTab('timeslots');
  };

  const handleCourtStatusChange = async (courtId, status) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCourts(prev => prev.map(court => 
        court.id === courtId 
          ? { ...court, status, updatedAt: new Date().toISOString() }
          : court
      ));
      
      alert(`Court status updated to ${status}!`);
    } catch (error) {
      console.error('Error updating court status:', error);
      alert('Failed to update court status.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'list', label: 'Court List', icon: 'Grid3X3' },
    { id: 'create', label: 'Add New Court', icon: 'Plus' },
    { id: 'edit', label: 'Edit Court', icon: 'Edit', hidden: !selectedCourt },
    { id: 'timeslots', label: 'Time Slots', icon: 'Clock', hidden: !selectedCourt }
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
              <button 
                onClick={() => navigate('/facility-management')} 
                className="hover:text-foreground transition-colors"
              >
                Facility Management
              </button>
              <Icon name="ChevronRight" size={16} />
              <span>Court Management</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Court Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage courts for <span className="font-medium">{venue.name}</span>
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/facility-management')}
                >
                  <Icon name="ArrowLeft" size={16} className="mr-2" />
                  Back to Facilities
                </Button>
                
                <Button 
                  variant="default" 
                  onClick={() => setActiveTab('create')}
                >
                  <Icon name="Plus" size={16} className="mr-2" />
                  Add New Court
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Courts</p>
                  <p className="text-2xl font-bold text-card-foreground">{courts.length}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Icon name="Grid3X3" size={20} className="text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Courts</p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {courts.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" size={20} className="text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Maintenance</p>
                  <p className="text-2xl font-bold text-card-foreground">
                    {courts.filter(c => c.status === 'maintenance').length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Icon name="Wrench" size={20} className="text-yellow-600" />
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Price/Hour</p>
                  <p className="text-2xl font-bold text-card-foreground">
                    ${courts.length > 0 ? Math.round(courts.reduce((sum, c) => sum + c.pricePerHour, 0) / courts.length) : 0}
                  </p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon name="DollarSign" size={20} className="text-purple-600" />
                </div>
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
                  {tab.id === 'timeslots' && selectedCourt && (
                    <span className="text-xs text-muted-foreground">({selectedCourt.name})</span>
                  )}
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
              <CourtList
                courts={courts}
                onEdit={handleEditCourt}
                onDelete={handleDeleteCourt}
                onManageTimeSlots={handleManageTimeSlots}
                onStatusChange={handleCourtStatusChange}
              />
            )}

            {activeTab === 'create' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Add New Court</h2>
                  <p className="text-muted-foreground">
                    Create a new court for {venue.name}
                  </p>
                </div>
                <CourtForm
                  onSubmit={handleCreateCourt}
                  sportsOptions={sportsOptions}
                  surfaceOptions={surfaceOptions}
                />
              </div>
            )}

            {activeTab === 'edit' && selectedCourt && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Edit Court</h2>
                  <p className="text-muted-foreground">
                    Update court information for {selectedCourt.name}
                  </p>
                </div>
                <CourtForm
                  court={selectedCourt}
                  onSubmit={(data) => handleUpdateCourt(selectedCourt.id, data)}
                  sportsOptions={sportsOptions}
                  surfaceOptions={surfaceOptions}
                  isEdit={true}
                />
              </div>
            )}

            {activeTab === 'timeslots' && selectedCourt && (
              <div>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-foreground mb-2">Time Slot Management</h2>
                  <p className="text-muted-foreground">
                    Manage availability and maintenance schedules for {selectedCourt.name}
                  </p>
                </div>
                <TimeSlotManager
                  court={selectedCourt}
                  onUpdateCourt={(data) => handleUpdateCourt(selectedCourt.id, data)}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourtManagement;
