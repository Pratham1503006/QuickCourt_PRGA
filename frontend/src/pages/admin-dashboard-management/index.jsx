import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import StatCard from './components/StatCard';
import PlatformChart from './components/PlatformChart';
import FacilityApprovalCard from './components/FacilityApprovalCard';
import UserManagementTable from './components/UserManagementTable';
import ReportsSection from './components/ReportsSection';

const AdminDashboardManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  // Mock data for platform statistics
  const platformStats = [
    {
      title: "Total Users",
      value: "12,847",
      change: "+12.5%",
      changeType: "increase",
      icon: "Users",
      color: "primary"
    },
    {
      title: "Active Facilities",
      value: "1,234",
      change: "+8.2%",
      changeType: "increase",
      icon: "Building",
      color: "success"
    },
    {
      title: "Platform Revenue",
      value: "$284,592",
      change: "+15.3%",
      changeType: "increase",
      icon: "DollarSign",
      color: "warning"
    },
    {
      title: "Pending Approvals",
      value: "23",
      change: "-5.1%",
      changeType: "decrease",
      icon: "Clock",
      color: "error"
    }
  ];

  // Mock data for charts
  const platformGrowthData = [
    { name: 'Jan', value: 8500 },
    { name: 'Feb', value: 9200 },
    { name: 'Mar', value: 9800 },
    { name: 'Apr', value: 10500 },
    { name: 'May', value: 11200 },
    { name: 'Jun', value: 11800 },
    { name: 'Jul', value: 12400 },
    { name: 'Aug', value: 12847 }
  ];

  const bookingTrendsData = [
    { name: 'Mon', value: 245 },
    { name: 'Tue', value: 312 },
    { name: 'Wed', value: 289 },
    { name: 'Thu', value: 356 },
    { name: 'Fri', value: 423 },
    { name: 'Sat', value: 567 },
    { name: 'Sun', value: 489 }
  ];

  const revenueDistributionData = [
    { name: 'Court Bookings', value: 45 },
    { name: 'Premium Features', value: 25 },
    { name: 'Commission', value: 20 },
    { name: 'Advertisements', value: 10 }
  ];

  // Mock data for pending facility approvals
  const pendingFacilities = [
    {
      id: 1,
      name: "Elite Sports Complex",
      location: "Downtown, New York",
      ownerName: "Michael Johnson",
      submittedDate: "2025-08-05T10:30:00Z",
      priority: "high",
      pendingDays: 6,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
      sports: ["Basketball", "Tennis", "Badminton"],
      amenities: ["Parking", "Locker Rooms", "Cafeteria", "WiFi", "AC"],
      description: `Modern sports complex featuring state-of-the-art facilities with professional-grade courts and comprehensive amenities. Located in the heart of downtown with excellent accessibility and parking facilities.`,
      totalCourts: 8,
      priceRange: { min: 25, max: 80 },
      operatingHours: "6:00 AM - 11:00 PM"
    },
    {
      id: 2,
      name: "Riverside Tennis Club",
      location: "Riverside, California",
      ownerName: "Sarah Williams",
      submittedDate: "2025-08-07T14:15:00Z",
      priority: "medium",
      pendingDays: 4,
      image: "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400",
      sports: ["Tennis", "Pickleball"],
      amenities: ["Parking", "Pro Shop", "Coaching", "Equipment Rental"],
      description: `Premium tennis facility with clay and hard courts, offering professional coaching services and equipment rental. Perfect for both recreational and competitive players.`,
      totalCourts: 6,
      priceRange: { min: 30, max: 60 },
      operatingHours: "7:00 AM - 10:00 PM"
    },
    {
      id: 3,
      name: "Community Sports Hub",
      location: "Suburbs, Texas",
      ownerName: "David Chen",
      submittedDate: "2025-08-09T09:45:00Z",
      priority: "low",
      pendingDays: 2,
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400",
      sports: ["Basketball", "Volleyball", "Futsal"],
      amenities: ["Parking", "Changing Rooms", "Water Fountain"],
      description: `Community-focused sports facility providing affordable access to various indoor sports. Family-friendly environment with flexible booking options.`,
      totalCourts: 4,
      priceRange: { min: 15, max: 35 },
      operatingHours: "8:00 AM - 9:00 PM"
    }
  ];

  // Mock data for user management
  const users = [
    {
      id: 1,
      name: "Alex Rodriguez",
      email: "alex.rodriguez@email.com",
      role: "user",
      status: "active",
      joinDate: "2024-03-15T00:00:00Z",
      totalBookings: 24,
      avatar: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      name: "Emma Thompson",
      email: "emma.thompson@email.com",
      role: "owner",
      status: "active",
      joinDate: "2024-01-20T00:00:00Z",
      totalBookings: 156,
      avatar: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      name: "James Wilson",
      email: "james.wilson@email.com",
      role: "user",
      status: "banned",
      joinDate: "2024-06-10T00:00:00Z",
      totalBookings: 8,
      avatar: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 4,
      name: "Lisa Anderson",
      email: "lisa.anderson@email.com",
      role: "user",
      status: "active",
      joinDate: "2024-05-22T00:00:00Z",
      totalBookings: 42,
      avatar: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: 5,
      name: "Robert Davis",
      email: "robert.davis@email.com",
      role: "owner",
      status: "inactive",
      joinDate: "2024-02-08T00:00:00Z",
      totalBookings: 89,
      avatar: "https://randomuser.me/api/portraits/men/5.jpg"
    }
  ];

  // Mock data for reports
  const reports = [
    {
      id: 1,
      title: "Inappropriate behavior during booking",
      category: "User Complaint",
      description: `User reported inappropriate behavior from another player during a tennis match. The incident occurred on court 3 at Downtown Sports Complex. Multiple witnesses present.`,
      reportedBy: "Jennifer Martinez",
      status: "pending",
      priority: "high",
      createdAt: "2025-08-10T15:30:00Z",
      assignedTo: null
    },
    {
      id: 2,
      title: "Court maintenance issues",
      category: "Facility Issue",
      description: `Basketball court surface has several cracks and uneven areas that pose safety risks. Lighting in court 2 is also flickering intermittently.`,
      reportedBy: "Mike Johnson",
      status: "investigating",
      priority: "medium",
      createdAt: "2025-08-09T11:20:00Z",
      assignedTo: "Admin Team"
    },
    {
      id: 3,
      title: "Payment not processed correctly",
      category: "Payment Dispute",
      description: `Customer was charged twice for the same booking session. Payment gateway showed successful transaction but amount was debited twice from bank account.`,
      reportedBy: "Sarah Kim",
      status: "resolved",
      priority: "high",
      createdAt: "2025-08-08T09:15:00Z",
      assignedTo: "Finance Team"
    },
    {
      id: 4,
      title: "Mobile app crashes during booking",
      category: "Technical Problem",
      description: `Mobile application consistently crashes when trying to select time slots for weekend bookings. Issue occurs on both iOS and Android devices.`,
      reportedBy: "Tom Wilson",
      status: "investigating",
      priority: "medium",
      createdAt: "2025-08-07T16:45:00Z",
      assignedTo: "Tech Team"
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'facilities', label: 'Facility Approvals', icon: 'Building' },
    { id: 'users', label: 'User Management', icon: 'Users' },
    { id: 'reports', label: 'Reports', icon: 'FileText' },
    { id: 'database', label: 'Database', icon: 'Database' }
  ];

  const handleApproveFacility = (facilityId) => {
    console.log('Approving facility:', facilityId);
    // Implementation for facility approval
  };

  const handleRejectFacility = (facilityId) => {
    console.log('Rejecting facility:', facilityId);
    // Implementation for facility rejection
  };

  const handleViewFacilityDetails = (facility) => {
    console.log('Viewing facility details:', facility);
    // Implementation for viewing facility details
  };

  const handleBanUser = (userId) => {
    console.log('Banning user:', userId);
    // Implementation for banning user
  };

  const handleUnbanUser = (userId) => {
    console.log('Unbanning user:', userId);
    // Implementation for unbanning user
  };

  const handleViewUserBookings = (userId) => {
    console.log('Viewing user bookings:', userId);
    // Implementation for viewing user bookings
  };

  const handleUpdateReportStatus = (reportId, status) => {
    console.log('Updating report status:', reportId, status);
    // Implementation for updating report status
  };

  const handleViewReportDetails = (report) => {
    console.log('Viewing report details:', report);
    // Implementation for viewing report details
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Platform Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {platformStats?.map((stat, index) => (
          <StatCard
            key={index}
            title={stat?.title}
            value={stat?.value}
            change={stat?.change}
            changeType={stat?.changeType}
            icon={stat?.icon}
            color={stat?.color}
          />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformChart
          type="line"
          data={platformGrowthData}
          title="Platform Growth"
          height={300}
        />
        <PlatformChart
          type="bar"
          data={bookingTrendsData}
          title="Weekly Booking Trends"
          height={300}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PlatformChart
          type="pie"
          data={revenueDistributionData}
          title="Revenue Distribution"
          height={300}
        />
        <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-card-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              fullWidth
              onClick={() => setActiveTab('facilities')}
            >
              <Icon name="Building" size={16} className="mr-2" />
              Review Pending Facilities ({pendingFacilities?.length})
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setActiveTab('users')}
            >
              <Icon name="Users" size={16} className="mr-2" />
              Manage Users ({users?.length})
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setActiveTab('reports')}
            >
              <Icon name="FileText" size={16} className="mr-2" />
              Handle Reports ({reports?.filter(r => r?.status === 'pending')?.length} pending)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderFacilitiesTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Facility Approvals</h2>
          <p className="text-muted-foreground">Review and approve pending facility registrations</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Icon name="Filter" size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {pendingFacilities?.map((facility) => (
          <FacilityApprovalCard
            key={facility?.id}
            facility={facility}
            onApprove={handleApproveFacility}
            onReject={handleRejectFacility}
            onViewDetails={handleViewFacilityDetails}
          />
        ))}
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">User Management</h2>
          <p className="text-muted-foreground">Manage platform users and their access</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Icon name="UserPlus" size={16} className="mr-2" />
            Add User
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      <UserManagementTable
        users={users}
        onBanUser={handleBanUser}
        onUnbanUser={handleUnbanUser}
        onViewBookings={handleViewUserBookings}
      />
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Reports & Complaints</h2>
          <p className="text-muted-foreground">Handle user reports and platform issues</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Icon name="Filter" size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Icon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      <ReportsSection
        reports={reports}
        onUpdateStatus={handleUpdateReportStatus}
        onViewDetails={handleViewReportDetails}
      />
    </div>
  );

  const renderDatabaseTab = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Database Management</h2>
          <p className="text-muted-foreground">View and manage database information</p>
        </div>
        <Button 
          onClick={() => navigate('/database-viewer')} 
          variant="default" 
          size="sm"
        >
          <Icon name="ExternalLink" size={16} className="mr-2" />
          Open Database Viewer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Users Table</h3>
              <p className="text-sm text-muted-foreground">View all registered users</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/database-viewer')} 
            variant="outline" 
            size="sm" 
            fullWidth
          >
            View Users
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Icon name="Calendar" size={20} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Bookings Table</h3>
              <p className="text-sm text-muted-foreground">View all bookings data</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/database-viewer')} 
            variant="outline" 
            size="sm" 
            fullWidth
          >
            View Bookings
          </Button>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Icon name="Building" size={20} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Venues Table</h3>
              <p className="text-sm text-muted-foreground">View all venues data</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/database-viewer')} 
            variant="outline" 
            size="sm" 
            fullWidth
          >
            View Venues
          </Button>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverviewTab();
      case 'facilities':
        return renderFacilitiesTab();
      case 'users':
        return renderUsersTab();
      case 'reports':
        return renderReportsTab();
      case 'database':
        return renderDatabaseTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <button onClick={() => navigate('/homepage-dashboard')} className="hover:text-foreground transition-colors">
                Home
              </button>
              <Icon name="ChevronRight" size={16} />
              <span>Admin Dashboard</span>
            </div>
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Platform oversight and management tools
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-border mb-8">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                    activeTab === tab?.id
                      ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                  {tab?.id === 'facilities' && pendingFacilities?.length > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                      {pendingFacilities?.length}
                    </span>
                  )}
                  {tab?.id === 'reports' && reports?.filter(r => r?.status === 'pending')?.length > 0 && (
                    <span className="bg-warning text-warning-foreground text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                      {reports?.filter(r => r?.status === 'pending')?.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardManagement;