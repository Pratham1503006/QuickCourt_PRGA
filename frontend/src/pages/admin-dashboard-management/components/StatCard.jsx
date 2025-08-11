import React from 'react';
import Icon from '../../../components/AppIcon';

const StatCard = ({ title, value, change, changeType, icon, color = 'primary' }) => {
  const getColorClasses = (colorType) => {
    const colors = {
      primary: 'bg-blue-50 text-blue-600 border-blue-200',
      success: 'bg-green-50 text-green-600 border-green-200',
      warning: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      error: 'bg-red-50 text-red-600 border-red-200'
    };
    return colors?.[colorType] || colors?.primary;
  };

  const getChangeColor = (type) => {
    return type === 'increase' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft hover:shadow-elevated transition-natural">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <p className="text-3xl font-bold text-card-foreground">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <Icon 
                name={changeType === 'increase' ? 'TrendingUp' : 'TrendingDown'} 
                size={16} 
                className={`mr-1 ${getChangeColor(changeType)}`}
              />
              <span className={`text-sm font-medium ${getChangeColor(changeType)}`}>
                {change}
              </span>
              <span className="text-sm text-muted-foreground ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
          <Icon name={icon} size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;