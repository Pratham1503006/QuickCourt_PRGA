import React from 'react';
import Icon from '../../../components/AppIcon';

const StatCard = ({ title, value, change, changeType, icon, color }) => {
  const colorClasses = {
    primary: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  const changeColorClasses = {
    increase: 'text-green-600 bg-green-50',
    decrease: 'text-red-600 bg-red-50'
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-soft">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
          <p className="text-3xl font-bold text-card-foreground">{value}</p>
          {change && (
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${changeColorClasses[changeType]}`}>
              <Icon 
                name={changeType === 'increase' ? 'ArrowUp' : 'ArrowDown'} 
                size={12} 
                className="mr-1" 
              />
              {change}
            </div>
          )}
        </div>
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon name={icon} size={24} className="text-white" />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
