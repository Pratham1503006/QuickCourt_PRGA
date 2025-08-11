import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = () => {
  const stats = [
    {
      id: 1,
      icon: "MapPin",
      value: "500+",
      label: "Sports Venues",
      description: "Verified facilities across the city",
      color: "text-blue-600"
    },
    {
      id: 2,
      icon: "Users",
      value: "25K+",
      label: "Active Players",
      description: "Sports enthusiasts trust us",
      color: "text-green-600"
    },
    {
      id: 3,
      icon: "Calendar",
      value: "100K+",
      label: "Bookings Made",
      description: "Successful reservations completed",
      color: "text-purple-600"
    },
    {
      id: 4,
      icon: "Star",
      value: "4.8",
      label: "Average Rating",
      description: "Based on user reviews",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="bg-card border-t border-border py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
            Trusted by Sports Community
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Join thousands of players who have made QuickCourt their go-to platform for sports facility bookings
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats?.map((stat) => (
            <div key={stat?.id} className="text-center group">
              <div className="bg-muted rounded-2xl p-6 lg:p-8 transition-smooth hover:shadow-elevated hover:bg-card">
                <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-smooth`}>
                  <Icon name={stat?.icon} size={28} className={stat?.color} />
                </div>
                
                <div className={`text-3xl lg:text-4xl font-bold ${stat?.color} mb-2`}>
                  {stat?.value}
                </div>
                
                <h3 className="text-lg font-semibold text-text-primary mb-1">
                  {stat?.label}
                </h3>
                
                <p className="text-sm text-text-secondary">
                  {stat?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickStats;