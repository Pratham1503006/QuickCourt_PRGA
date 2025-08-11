import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import TrustSignals from './components/TrustSignals';

const LoginRegistration = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();

  // Check if user is already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const userRole = localStorage.getItem('userRole');
    
    if (isAuthenticated === 'true' && userRole) {
      // Redirect to appropriate dashboard based on role
      switch (userRole) {
        case 'admin': navigate('/admin-dashboard-management');
          break;
        case 'owner': navigate('/venue-details-booking');
          break;
        default:
          navigate('/homepage-dashboard');
      }
    }
  }, [navigate]);

  const handleSwitchToRegister = () => {
    setActiveTab('register');
    setShowForgotPassword(false);
  };

  const handleSwitchToLogin = () => {
    setActiveTab('login');
    setShowForgotPassword(false);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setActiveTab('login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          <div 
            className="flex items-center cursor-pointer transition-smooth hover:opacity-80"
            onClick={() => navigate('/homepage-dashboard')}
          >
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="text-xl font-bold text-text-primary">QuickCourt</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/homepage-dashboard')}
              className="text-text-secondary hover:text-text-primary transition-smooth"
            >
              <Icon name="Home" size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="min-h-[calc(100vh-4rem)] flex">
          {/* Left Side - Background Image (Desktop Only) */}
          <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/90 to-secondary/90 z-10"></div>
            <Image
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              alt="Sports facility with modern courts and equipment"
              className="w-full h-full object-cover"
            />
            
            {/* Overlay Content */}
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 text-white">
              <div className="max-w-md">
                <h1 className="text-4xl font-bold mb-6">
                  Book Your Perfect Sports Venue
                </h1>
                <p className="text-lg mb-8 opacity-90">
                  Discover and reserve premium sports facilities in your area. From tennis courts to basketball arenas, find the perfect venue for your game.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Icon name="MapPin" size={16} />
                    </div>
                    <span>500+ Venues Nationwide</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Icon name="Clock" size={16} />
                    </div>
                    <span>Instant Booking Confirmation</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Icon name="Shield" size={16} />
                    </div>
                    <span>Secure Payment Processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Authentication Forms */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
              <div className="w-full max-w-md">
                {showForgotPassword ? (
                  <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
                ) : (
                  <>
                    {/* Tab Navigation */}
                    <div className="flex mb-8 bg-muted rounded-lg p-1">
                      <button
                        onClick={() => setActiveTab('login')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-smooth ${
                          activeTab === 'login' ?'bg-surface text-text-primary shadow-soft' :'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => setActiveTab('register')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-smooth ${
                          activeTab === 'register' ?'bg-surface text-text-primary shadow-soft' :'text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        Sign Up
                      </button>
                    </div>

                    {/* Form Content */}
                    {activeTab === 'login' ? (
                      <LoginForm
                        onSwitchToRegister={handleSwitchToRegister}
                        onForgotPassword={handleForgotPassword}
                      />
                    ) : (
                      <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Trust Signals Footer */}
            <div className="border-t border-border bg-muted/30 p-6 lg:p-8">
              <TrustSignals />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LoginRegistration;