import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import WelcomeBanner from './components/WelcomeBanner';
import PopularSports from './components/PopularSports';
import FeaturedVenues from './components/FeaturedVenues';
import HowItWorks from './components/HowItWorks';
import QuickStats from './components/QuickStats';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';

const HomepageDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Find Venues',
      description: 'Search and book sports facilities',
      icon: 'Search',
      path: '/venue-search-listings',
      color: 'bg-blue-500 hover:bg-blue-600'
    },
    {
      title: 'My Bookings',
      description: 'View and manage your reservations',
      icon: 'Calendar',
      path: '/user-profile-my-bookings',
      color: 'bg-green-500 hover:bg-green-600'
    },
    {
      title: 'Favorites',
      description: 'Access your saved venues',
      icon: 'Heart',
      path: '/user-favorites',
      color: 'bg-purple-500 hover:bg-purple-600'
    },
    {
      title: 'Notifications',
      description: 'Stay updated with alerts',
      icon: 'Bell',
      path: '/user-notifications',
      color: 'bg-orange-500 hover:bg-orange-600'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      {/* Main Content */}
      <main className="pt-16">
        {/* Welcome Banner Section */}
        <section className="px-4 lg:px-6 py-8">
          <div className="max-w-7xl mx-auto">
            <WelcomeBanner />
          </div>
        </section>

        {/* Quick Navigation Section */}
        <section className="px-4 lg:px-6 py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Quick Access
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Navigate to your favorite features with just one click
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action) => (
                <div
                  key={action.title}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer"
                  onClick={() => navigate(action.path)}
                >
                  <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mb-4 mx-auto`}>
                    <Icon name={action.icon} className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                    {action.title}
                  </h3>
                  <p className="text-sm text-gray-600 text-center">
                    {action.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/venue-search-listings')}
                className="mr-4"
              >
                <Icon name="Search" className="w-5 h-5 mr-2 inline" />
                Explore All Venues
              </Button>
              
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/user-profile-my-bookings')}
              >
                <Icon name="Calendar" className="w-5 h-5 mr-2 inline" />
                View My Bookings
              </Button>
            </div>
          </div>
        </section>

        {/* Popular Sports Section */}
        <section>
          <PopularSports />
        </section>

        {/* Featured Venues Section */}
        <section>
          <FeaturedVenues />
        </section>

        {/* Quick Stats Section */}
        <section>
          <QuickStats />
        </section>

        {/* How It Works Section */}
        <section>
          <HowItWorks />
        </section>
      </main>
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">Q</span>
                </div>
                <span className="text-xl font-bold">QuickCourt</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Your trusted platform for booking sports facilities. Play more, worry less.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-smooth">
                  <span className="text-xs">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-smooth">
                  <span className="text-xs">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary transition-smooth">
                  <span className="text-xs">in</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><button onClick={() => navigate('/venue-search-listings')} className="hover:text-white transition-smooth">Find Venues</button></li>
                <li><button onClick={() => navigate('/user-favorites')} className="hover:text-white transition-smooth">My Favorites</button></li>
                <li><button onClick={() => navigate('/user-profile-my-bookings')} className="hover:text-white transition-smooth">My Bookings</button></li>
                <li><button onClick={() => navigate('/user-notifications')} className="hover:text-white transition-smooth">Notifications</button></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#help" className="hover:text-white transition-smooth">Help Center</a></li>
                <li><a href="#contact" className="hover:text-white transition-smooth">Contact Us</a></li>
                <li><a href="#terms" className="hover:text-white transition-smooth">Terms of Service</a></li>
                <li><a href="#privacy" className="hover:text-white transition-smooth">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>📧 support@quickcourt.com</p>
                <p>📞 +1 (555) 123-4567</p>
                <p>📍 123 Sports Ave, City, State 12345</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; {new Date()?.getFullYear()} QuickCourt. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomepageDashboard;