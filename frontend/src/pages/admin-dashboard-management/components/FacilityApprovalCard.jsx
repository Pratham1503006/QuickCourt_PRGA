import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const FacilityApprovalCard = ({ facility, onApprove, onReject, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors?.[priority] || colors?.medium;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft hover:shadow-elevated transition-natural">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <Image 
                src={facility?.image} 
                alt={facility?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className="text-lg font-semibold text-card-foreground">{facility?.name}</h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(facility?.priority)}`}>
                  {facility?.priority} priority
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{facility?.location}</p>
              <div className="flex items-center text-sm text-muted-foreground space-x-4">
                <span className="flex items-center">
                  <Icon name="Calendar" size={14} className="mr-1" />
                  Submitted {formatDate(facility?.submittedDate)}
                </span>
                <span className="flex items-center">
                  <Icon name="User" size={14} className="mr-1" />
                  {facility?.ownerName}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} />
          </Button>
        </div>

        {isExpanded && (
          <div className="border-t border-border pt-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="text-sm font-medium text-card-foreground mb-2">Sports Offered</h4>
                <div className="flex flex-wrap gap-1">
                  {facility?.sports?.map((sport, index) => (
                    <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      {sport}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-card-foreground mb-2">Amenities</h4>
                <div className="flex flex-wrap gap-1">
                  {facility?.amenities?.slice(0, 3)?.map((amenity, index) => (
                    <span key={index} className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      {amenity}
                    </span>
                  ))}
                  {facility?.amenities?.length > 3 && (
                    <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                      +{facility?.amenities?.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-card-foreground mb-2">Description</h4>
              <p className="text-sm text-muted-foreground line-clamp-3">{facility?.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-card-foreground">Courts:</span>
                <span className="ml-2 text-muted-foreground">{facility?.totalCourts}</span>
              </div>
              <div>
                <span className="font-medium text-card-foreground">Price Range:</span>
                <span className="ml-2 text-muted-foreground">${facility?.priceRange?.min}-${facility?.priceRange?.max}/hr</span>
              </div>
              <div>
                <span className="font-medium text-card-foreground">Operating Hours:</span>
                <span className="ml-2 text-muted-foreground">{facility?.operatingHours}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Pending for {facility?.pendingDays} days
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(facility)}
            >
              <Icon name="Eye" size={16} className="mr-2" />
              View Details
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onReject(facility?.id)}
            >
              <Icon name="X" size={16} className="mr-2" />
              Reject
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => onApprove(facility?.id)}
            >
              <Icon name="Check" size={16} className="mr-2" />
              Approve
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityApprovalCard;