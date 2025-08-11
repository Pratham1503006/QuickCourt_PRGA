import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PopularSports = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const sportsData = [
    {
      id: 1,
      name: "Basketball",
      icon: "Circle",
      venueCount: 45,
      avgPrice: 25,
      color: "bg-orange-500",
      hoverColor: "hover:bg-orange-600",
      description: "Indoor & outdoor courts"
    },
    {
      id: 2,
      name: "Tennis",
      icon: "Circle",
      venueCount: 32,
      avgPrice: 30,
      color: "bg-green-500",
      hoverColor: "hover:bg-green-600",
      description: "Clay & hard courts"
    },
    {
      id: 3,
      name: "Football",
      icon: "Circle",
      venueCount: 28,
      avgPrice: 40,
      color: "bg-blue-500",
      hoverColor: "hover:bg-blue-600",
      description: "Full & half pitches"
    },
    {
      id: 4,
      name: "Badminton",
      icon: "Circle",
      venueCount: 38,
      avgPrice: 20,
      color: "bg-purple-500",
      hoverColor: "hover:bg-purple-600",
      description: "Professional courts"
    },
    {
      id: 5,
      name: "Swimming",
      icon: "Waves",
      venueCount: 15,
      avgPrice: 35,
      color: "bg-cyan-500",
      hoverColor: "hover:bg-cyan-600",
      description: "Indoor & outdoor pools"
    },
    {
      id: 6,
      name: "Squash",
      icon: "Square",
      venueCount: 22,
      avgPrice: 28,
      color: "bg-red-500",
      hoverColor: "hover:bg-red-600",
      description: "Glass & traditional courts"
    },
    {
      id: 7,
      name: "Cricket",
      icon: "Circle",
      venueCount: 18,
      avgPrice: 50,
      color: "bg-yellow-500",
      hoverColor: "hover:bg-yellow-600",
      description: "Nets & full grounds"
    },
    {
      id: 8,
      name: "Volleyball",
      icon: "Circle",
      venueCount: 25,
      avgPrice: 22,
      color: "bg-indigo-500",
      hoverColor: "hover:bg-indigo-600",
      description: "Indoor & beach courts"
    }
  ];

  const handleSportClick = (sportName) => {
    navigate(`/venue-search-listings?sport=${sportName?.toLowerCase()}`);
  };

  const scroll = (direction) => {
    if (scrollRef?.current) {
      const scrollAmount = 300;
      scrollRef?.current?.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-surface py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
              Popular Sports
            </h2>
            <p className="text-text-secondary">
              Find facilities for your favorite sports
            </p>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="w-10 h-10"
            >
              <Icon name="ChevronLeft" size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="w-10 h-10"
            >
              <Icon name="ChevronRight" size={20} />
            </Button>
          </div>
        </div>

        {/* Sports Grid/Scroll */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide space-x-4 md:space-x-6 pb-4 md:pb-0"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {sportsData?.map((sport) => (
              <div
                key={sport?.id}
                onClick={() => handleSportClick(sport?.name)}
                className="flex-shrink-0 w-64 md:w-72 bg-card border border-border rounded-xl p-6 cursor-pointer transition-smooth hover:shadow-elevated hover:border-primary/20 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${sport?.color} ${sport?.hoverColor} rounded-lg flex items-center justify-center transition-smooth group-hover:scale-110`}>
                    <Icon name={sport?.icon} size={24} color="white" />
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-text-secondary">From</div>
                    <div className="text-lg font-bold text-text-primary">
                      ${sport?.avgPrice}/hr
                    </div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-smooth">
                  {sport?.name}
                </h3>
                
                <p className="text-text-secondary text-sm mb-3">
                  {sport?.description}
                </p>
                
                <div className="flex items-center justify-between text-sm mb-4">
                  <span className="text-text-secondary">
                    {sport?.venueCount} venues
                  </span>
                  <span className="font-semibold text-text">
                    ${sport?.avgPrice}+
                  </span>
                </div>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/venue-search-listings?sport=${sport.name.toLowerCase()}`);
                  }}
                  className="w-full"
                >
                  Find {sport.name} Venues
                </Button>
              </div>
            ))}
          </div>
          
          {/* Mobile Navigation Hint */}
          <div className="md:hidden flex justify-center mt-4">
            <div className="flex items-center text-sm text-text-secondary">
              <Icon name="ArrowLeft" size={16} className="mr-1" />
              Swipe to explore more sports
              <Icon name="ArrowRight" size={16} className="ml-1" />
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            variant="default"
            size="lg"
            onClick={() => navigate('/venue-search-listings')}
            className="px-8 mr-4"
          >
            View All Sports
            <Icon name="ArrowRight" size={20} className="ml-2" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/venue-search-listings')}
          >
            Advanced Search
            <Icon name="Filter" size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopularSports;