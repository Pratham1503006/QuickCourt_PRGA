import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const FacilityOwnerInfo = ({ owner, policies }) => {
  return (
    <div className="space-y-6">
      {/* Owner Information */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Facility Owner</h3>
        <div className="flex items-start space-x-4">
          <Image
            src={owner?.avatar}
            alt={owner?.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="font-medium text-text-primary mb-1">{owner?.name}</h4>
            <div className="flex items-center space-x-4 text-sm text-text-secondary mb-3">
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={14} className="text-warning fill-current" />
                <span>{owner?.rating} ({owner?.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>Member since {owner?.memberSince}</span>
              </div>
            </div>
            <p className="text-text-secondary text-sm mb-4">{owner?.bio}</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" iconName="Phone" iconPosition="left">
                Call
              </Button>
              <Button variant="outline" size="sm" iconName="MessageCircle" iconPosition="left">
                Message
              </Button>
              <Button variant="ghost" size="sm" iconName="Mail" iconPosition="left">
                Email
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Policies & Rules */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Policies & Rules</h3>
        <div className="space-y-4">
          {/* Cancellation Policy */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="RotateCcw" size={16} className="text-primary" />
              <h4 className="font-medium text-text-primary">Cancellation Policy</h4>
            </div>
            <p className="text-text-secondary text-sm pl-6">
              {policies?.cancellation}
            </p>
          </div>

          {/* House Rules */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Shield" size={16} className="text-primary" />
              <h4 className="font-medium text-text-primary">House Rules</h4>
            </div>
            <ul className="text-text-secondary text-sm pl-6 space-y-1">
              {policies?.houseRules?.map((rule, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety Guidelines */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="AlertTriangle" size={16} className="text-warning" />
              <h4 className="font-medium text-text-primary">Safety Guidelines</h4>
            </div>
            <ul className="text-text-secondary text-sm pl-6 space-y-1">
              {policies?.safetyGuidelines?.map((guideline, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-warning mt-1">•</span>
                  <span>{guideline}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Additional Information */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Info" size={16} className="text-primary" />
              <h4 className="font-medium text-text-primary">Additional Information</h4>
            </div>
            <ul className="text-text-secondary text-sm pl-6 space-y-1">
              {policies?.additionalInfo?.map((info, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-primary mt-1">•</span>
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {/* Contact Information */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center space-x-2 mb-3">
          <Icon name="Phone" size={16} className="text-primary" />
          <h4 className="font-medium text-text-primary">Emergency Contact</h4>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">Phone:</span>
            <span className="text-text-primary font-medium">{owner?.emergencyContact?.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">Available:</span>
            <span className="text-text-primary font-medium">{owner?.emergencyContact?.hours}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacilityOwnerInfo;