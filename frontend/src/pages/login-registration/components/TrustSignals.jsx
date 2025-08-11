import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'SSL Secured',
      description: 'Your data is protected with 256-bit encryption'
    },
    {
      icon: 'Users',
      title: '10,000+ Users',
      description: 'Trusted by sports enthusiasts nationwide'
    },
    {
      icon: 'Star',
      title: '4.8/5 Rating',
      description: 'Highly rated by our community'
    },
    {
      icon: 'Clock',
      title: '24/7 Support',
      description: 'Round-the-clock customer assistance'
    }
  ];

  const securityBadges = [
    {
      name: 'SSL Certificate',
      icon: 'Lock',
      color: 'text-success'
    },
    {
      name: 'Privacy Protected',
      icon: 'Eye',
      color: 'text-primary'
    },
    {
      name: 'Verified Platform',
      icon: 'CheckCircle',
      color: 'text-success'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Trust Features Grid */}
      <div className="grid grid-cols-2 gap-4">
        {trustFeatures?.map((feature, index) => (
          <div
            key={index}
            className="text-center p-4 bg-muted/50 rounded-lg border border-border/50"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name={feature?.icon} size={20} className="text-primary" />
            </div>
            <h4 className="font-semibold text-text-primary text-sm mb-1">
              {feature?.title}
            </h4>
            <p className="text-xs text-text-secondary leading-relaxed">
              {feature?.description}
            </p>
          </div>
        ))}
      </div>
      {/* Security Badges */}
      <div className="flex justify-center space-x-6">
        {securityBadges?.map((badge, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Icon name={badge?.icon} size={16} className={badge?.color} />
            <span className="text-xs text-text-secondary font-medium">
              {badge?.name}
            </span>
          </div>
        ))}
      </div>
      {/* Privacy Links */}
      <div className="text-center space-y-2">
        <div className="flex justify-center space-x-4 text-xs">
          <button className="text-text-secondary hover:text-primary transition-smooth">
            Privacy Policy
          </button>
          <span className="text-border">•</span>
          <button className="text-text-secondary hover:text-primary transition-smooth">
            Terms of Service
          </button>
          <span className="text-border">•</span>
          <button className="text-text-secondary hover:text-primary transition-smooth">
            Cookie Policy
          </button>
        </div>
        <p className="text-xs text-text-secondary">
          © {new Date()?.getFullYear()} QuickCourt. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default TrustSignals;