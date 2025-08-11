import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      id: 1,
      icon: "Search",
      title: "Find Your Venue",
      description: "Browse through hundreds of sports facilities in your area. Filter by sport type, location, price, and amenities to find the perfect match.",
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600"
    },
    {
      id: 2,
      icon: "Calendar",
      title: "Select Time Slot",
      description: "Choose your preferred date and time from available slots. View real-time availability and pricing for different time periods.",
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600"
    },
    {
      id: 3,
      icon: "CreditCard",
      title: "Secure Payment",
      description: "Complete your booking with our secure payment system. Get instant confirmation and booking details via email and SMS.",
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600"
    },
    {
      id: 4,
      icon: "Play",
      title: "Enjoy Your Game",
      description: "Arrive at the venue and enjoy your game! Rate your experience and help other players discover great facilities.",
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600"
    }
  ];

  const features = [
    {
      icon: "Shield",
      title: "Verified Venues",
      description: "All facilities are verified for quality and safety standards"
    },
    {
      icon: "Clock",
      title: "Instant Booking",
      description: "Book courts instantly with real-time availability"
    },
    {
      icon: "RefreshCw",
      title: "Flexible Cancellation",
      description: "Cancel or reschedule bookings with flexible policies"
    },
    {
      icon: "Headphones",
      title: "24/7 Support",
      description: "Get help anytime with our dedicated support team"
    }
  ];

  return (
    <div className="bg-surface py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            How It Works
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Book your favorite sports facility in just a few simple steps. It's quick, easy, and secure.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {steps?.map((step, index) => (
            <div key={step?.id} className="relative">
              {/* Connector Line (Desktop) */}
              {index < steps?.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border z-0">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-border rounded-full" />
                </div>
              )}
              
              <div className="relative z-10 text-center">
                {/* Step Icon */}
                <div className={`w-24 h-24 ${step?.color} ${step?.hoverColor} rounded-full flex items-center justify-center mx-auto mb-4 transition-smooth group-hover:scale-110`}>
                  <Icon name={step?.icon} size={32} color="white" />
                </div>
                
                {/* Step Number */}
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                  {step?.id}
                </div>
                
                {/* Step Content */}
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {step?.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step?.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="bg-muted rounded-2xl p-8 lg:p-12 mb-12">
          <h3 className="text-xl md:text-2xl font-bold text-text-primary text-center mb-8">
            Why Choose QuickCourt?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features?.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={feature?.icon} size={24} color="white" />
                </div>
                <h4 className="font-semibold text-text-primary mb-2">
                  {feature?.title}
                </h4>
                <p className="text-sm text-text-secondary">
                  {feature?.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-primary to-secondary rounded-2xl p-8 lg:p-12 text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Book Your Next Game?
          </h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of sports enthusiasts who trust QuickCourt for their facility bookings. Start playing today!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate('/venue-search-listings')}
              className="bg-white text-primary hover:bg-gray-100 px-8"
            >
              Find Venues
              <Icon name="Search" size={20} className="ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login-registration')}
              className="border-white text-white hover:bg-white hover:text-primary px-8"
            >
              Sign Up Free
              <Icon name="UserPlus" size={20} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;