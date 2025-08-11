import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const WelcomeBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const bannerSlides = [
    {
      id: 1,
      title: "Find Your Perfect Court",
      subtitle: "Book premium sports facilities in your area with just a few clicks",
      image: "https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
      ctaText: "Explore Venues",
      ctaAction: () => navigate('/venue-search-listings'),
      bgGradient: "from-blue-600/80 to-purple-600/80"
    },
    {
      id: 2,
      title: "Premium Basketball Courts",
      subtitle: "Professional-grade courts with modern amenities and flexible booking",
      image: "https://images.pexels.com/photos/1263348/pexels-photo-1263348.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
      ctaText: "Book Now",
      ctaAction: () => navigate('/venue-details-booking'),
      bgGradient: "from-orange-600/80 to-red-600/80"
    },
    {
      id: 3,
      title: "Tennis Excellence",
      subtitle: "World-class tennis facilities with coaching and tournament options",
      image: "https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop",
      ctaText: "View Courts",
      ctaAction: () => navigate('/venue-search-listings?sport=tennis'),
      bgGradient: "from-green-600/80 to-teal-600/80"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % bannerSlides?.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [bannerSlides?.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides?.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerSlides?.length) % bannerSlides?.length);
  };

  return (
    <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden rounded-xl bg-gray-900">
      {/* Slides */}
      <div className="relative h-full">
        {bannerSlides?.map((slide, index) => (
          <div
            key={slide?.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="relative h-full">
              <Image
                src={slide?.image}
                alt={slide?.title}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 bg-gradient-to-r ${slide?.bgGradient}`} />
              
              {/* Content */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-4 max-w-4xl">
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance">
                    {slide?.title}
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl mb-8 opacity-90 text-balance max-w-2xl mx-auto">
                    {slide?.subtitle}
                  </p>
                  <Button
                    variant="default"
                    size="lg"
                    onClick={slide?.ctaAction}
                    className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                  >
                    {slide?.ctaText}
                    <Icon name="ArrowRight" size={20} className="ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-smooth"
        aria-label="Previous slide"
      >
        <Icon name="ChevronLeft" size={24} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-smooth"
        aria-label="Next slide"
      >
        <Icon name="ChevronRight" size={24} />
      </button>
      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {bannerSlides?.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-smooth ${
              index === currentSlide
                ? 'bg-white' :'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default WelcomeBanner;