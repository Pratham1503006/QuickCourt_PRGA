import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, signOut } = useAuth();
  const [bookingCount, setBookingCount] = useState(2);
  const [adminNotifications, setAdminNotifications] = useState(3);
  const location = useLocation();
  const navigate = useNavigate();

  // Determine user role
  const userRole = !isAuthenticated ? 'guest' : (user?.role || 'user');

  const navigationItems = [
    {
      label: 'Discover',
      path: '/homepage-dashboard',
      icon: 'Home',
      roles: ['user', 'customer', 'admin', 'guest'],
      tooltip: 'Explore featured venues and facilities'
    },
    {
      label: 'Find Venues',
      path: '/venue-search-listings',
      icon: 'Search',
      roles: ['user', 'customer', 'admin', 'guest'],
      tooltip: 'Search and filter sports facilities'
    },
    {
      label: 'My Bookings',
      path: '/user-profile-my-bookings',
      icon: 'Calendar',
      roles: ['user', 'customer', 'admin'],
      tooltip: 'View and manage your bookings'
    },
    {
      label: 'Favorites',
      path: '/user-favorites',
      icon: 'Heart',
      roles: ['user', 'customer', 'admin'],
      tooltip: 'Your saved venues'
    },
    {
      label: 'Notifications',
      path: '/user-notifications',
      icon: 'Bell',
      roles: ['user', 'customer', 'admin'],
      tooltip: 'View your notifications'
    },
    {
      label: 'Venue Management',
      path: '/venue-details-booking',
      icon: 'Building',
      roles: ['venue_owner', 'admin'],
      tooltip: 'Manage venue details and bookings'
    },
    {
      label: 'Admin Portal',
      path: '/admin-dashboard-management',
      icon: 'Shield',
      roles: ['admin'],
      tooltip: 'Platform management and oversight'
    },
    {
      label: 'Database',
      path: '/database-viewer',
      icon: 'Database',
      roles: ['admin'],
      tooltip: 'View database information'
    }
  ];

  const filteredNavItems = navigationItems?.filter(item => 
    item?.roles?.includes(userRole)
  );

  const primaryNavItems = filteredNavItems?.slice(0, 4);
  const overflowNavItems = filteredNavItems?.slice(4);

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/venue-search-listings?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const handleBookingClick = () => {
    navigate('/user-profile-my-bookings');
  };

  const handleAdminNotificationClick = () => {
    navigate('/admin-dashboard-management');
  };

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-1000">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <div 
          className="flex items-center cursor-pointer transition-smooth hover:opacity-80"
          onClick={() => handleNavigation('/homepage-dashboard')}
        >
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <span className="text-xl font-bold text-text-primary">QuickCourt</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Button
              key={item?.path}
              variant={isActivePath(item?.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item?.path)}
              className="h-10 px-4"
              title={item?.tooltip}
            >
              <Icon name={item?.icon} size={16} className="mr-2" />
              {item?.label}
            </Button>
          ))}
          
          {overflowNavItems?.length > 0 && (
            <div className="relative group">
              <Button variant="ghost" size="sm" className="h-10 px-4">
                <Icon name="MoreHorizontal" size={16} className="mr-2" />
                More
              </Button>
              <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-elevated opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth z-1010">
                <div className="py-2">
                  {overflowNavItems?.map((item) => (
                    <button
                      key={item?.path}
                      onClick={() => handleNavigation(item?.path)}
                      className="w-full flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                      title={item?.tooltip}
                    >
                      <Icon name={item?.icon} size={16} className="mr-3" />
                      {item?.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <Input
                  type="search"
                  placeholder="Search venues..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-64 h-10"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSearchOpen(false)}
                  className="ml-2"
                >
                  <Icon name="X" size={16} />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchOpen(true)}
                title="Search venues"
              >
                <Icon name="Search" size={20} />
              </Button>
            )}
          </div>

          {/* Booking Status Indicator */}
          {userRole !== 'guest' && bookingCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBookingClick}
              className="relative"
              title={`${bookingCount} active bookings`}
            >
              <Icon name="Calendar" size={16} className="mr-2" />
              My Bookings
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-success text-success-foreground text-xs rounded-full flex items-center justify-center">
                {bookingCount}
              </span>
            </Button>
          )}

          {/* Admin Notification Center */}
          {userRole === 'admin' && adminNotifications > 0 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleAdminNotificationClick}
              className="relative"
              title={`${adminNotifications} pending notifications`}
            >
              <Icon name="Bell" size={20} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-warning text-warning-foreground text-xs rounded-full flex items-center justify-center">
                {adminNotifications}
              </span>
            </Button>
          )}

          {/* User Menu */}
          {userRole !== 'guest' ? (
            <div className="relative group">
              <Button variant="ghost" size="icon" className="w-10 h-10">
                <Icon name="User" size={20} />
              </Button>
              <div className="absolute top-full right-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-elevated opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-smooth z-1010">
                <div className="py-2">
                  <button 
                    onClick={() => navigate('/user-profile-my-bookings')}
                    className="w-full flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="User" size={16} className="mr-3" />
                    My Profile
                  </button>
                  <button 
                    onClick={() => navigate('/settings')}
                    className="w-full flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="Settings" size={16} className="mr-3" />
                    Settings
                  </button>
                  <button 
                    onClick={() => navigate('/help')}
                    className="w-full flex items-center px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                  >
                    <Icon name="HelpCircle" size={16} className="mr-3" />
                    Help
                  </button>
                  <hr className="my-1 border-border" />
                  <button 
                    onClick={signOut}
                    className="w-full flex items-center px-4 py-2 text-sm text-destructive hover:bg-muted transition-smooth"
                  >
                    <Icon name="LogOut" size={16} className="mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleNavigation('/login-registration')}
            >
              Sign In
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Icon name={isMenuOpen ? "X" : "Menu"} size={24} />
        </Button>
      </div>
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border">
          <div className="px-4 py-4 space-y-2">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <Input
                type="search"
                placeholder="Search venues..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full"
              />
            </form>

            {/* Mobile Navigation Items */}
            {filteredNavItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-smooth ${
                  isActivePath(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-primary hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={20} className="mr-3" />
                <span className="font-medium">{item?.label}</span>
                {item?.path === '/user-profile-my-bookings' && userRole !== 'guest' && bookingCount > 0 && (
                  <span className="ml-auto w-6 h-6 bg-success text-success-foreground text-xs rounded-full flex items-center justify-center">
                    {bookingCount}
                  </span>
                )}
                {item?.path === '/admin-dashboard-management' && userRole === 'admin' && adminNotifications > 0 && (
                  <span className="ml-auto w-6 h-6 bg-warning text-warning-foreground text-xs rounded-full flex items-center justify-center">
                    {adminNotifications}
                  </span>
                )}
              </button>
            ))}

            {/* Mobile User Actions */}
            <div className="pt-4 border-t border-border">
              {userRole !== 'guest' ? (
                <>
                  <button 
                    onClick={() => handleNavigation('/user-profile-my-bookings')}
                    className="w-full flex items-center px-4 py-3 text-text-primary hover:bg-muted rounded-lg transition-smooth"
                  >
                    <Icon name="User" size={20} className="mr-3" />
                    My Profile
                  </button>
                  <button 
                    onClick={() => navigate('/settings')}
                    className="w-full flex items-center px-4 py-3 text-text-primary hover:bg-muted rounded-lg transition-smooth"
                  >
                    <Icon name="Settings" size={20} className="mr-3" />
                    Settings
                  </button>
                  <button 
                    onClick={() => navigate('/help')}
                    className="w-full flex items-center px-4 py-3 text-text-primary hover:bg-muted rounded-lg transition-smooth"
                  >
                    <Icon name="HelpCircle" size={20} className="mr-3" />
                    Help
                  </button>
                  <button 
                    onClick={signOut}
                    className="w-full flex items-center px-4 py-3 text-destructive hover:bg-muted rounded-lg transition-smooth"
                  >
                    <Icon name="LogOut" size={20} className="mr-3" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Button
                  variant="default"
                  fullWidth
                  onClick={() => handleNavigation('/login-registration')}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;