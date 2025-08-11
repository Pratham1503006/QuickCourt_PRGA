import React from 'react';
import { cn } from '../../utils/cn';
import Icon from '../AppIcon';
import Button from './Button';

const EmptyState = ({ 
  title = "No items found", 
  description = "There are no items to display at this time.", 
  icon = "inbox",
  iconSize = 48,
  actionButton,
  actionText,
  onActionClick,
  actionIcon,
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const variants = {
    default: 'text-muted-foreground',
    minimal: 'text-muted-foreground/60',
    emphasized: 'text-foreground',
    error: 'text-destructive',
    success: 'text-emerald-600'
  };

  const sizes = {
    sm: {
      container: 'py-8 px-3',
      icon: 32,
      title: 'text-base',
      description: 'text-sm',
      maxWidth: 'max-w-xs'
    },
    default: {
      container: 'py-12 px-4',
      icon: 48,
      title: 'text-lg',
      description: 'text-sm',
      maxWidth: 'max-w-sm'
    },
    lg: {
      container: 'py-16 px-6',
      icon: 64,
      title: 'text-xl',
      description: 'text-base',
      maxWidth: 'max-w-md'
    }
  };

  const sizeConfig = sizes[size];
  const finalIconSize = iconSize || sizeConfig.icon;

  return (
    <div className={cn(
      'flex flex-col items-center justify-center text-center',
      sizeConfig.container,
      className
    )}>
      {/* Icon */}
      <div className={cn(
        'flex items-center justify-center rounded-full bg-muted/50 mb-6 transition-all duration-300 hover:bg-muted/70',
        size === 'sm' ? 'w-16 h-16' : size === 'lg' ? 'w-24 h-24' : 'w-20 h-20'
      )}>
        {typeof icon === 'string' && icon.length === 1 ? (
          <span className="text-2xl opacity-60">{icon}</span>
        ) : (
          <Icon 
            name={icon} 
            size={finalIconSize} 
            className="text-muted-foreground/60"
          />
        )}
      </div>

      {/* Content */}
      <div className={cn('space-y-3', sizeConfig.maxWidth)}>
        <h3 className={cn(
          'font-semibold tracking-tight',
          sizeConfig.title,
          variants[variant]
        )}>
          {title}
        </h3>
        
        {description && (
          <p className={cn(
            'leading-relaxed text-muted-foreground',
            sizeConfig.description
          )}>
            {description}
          </p>
        )}
      </div>

      {/* Action */}
      {(actionButton || actionText || onActionClick) && (
        <div className="mt-8">
          {actionButton || (
            <Button
              onClick={onActionClick}
              variant="outline"
              size={size === 'sm' ? 'sm' : 'default'}
              iconName={actionIcon}
              className="interactive-subtle"
            >
              {actionText || 'Get started'}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

// Specialized EmptyState variants
export const NoSearchResults = ({ 
  searchTerm, 
  onClearSearch,
  className 
}) => (
  <EmptyState
    icon="search"
    title="No results found"
    description={searchTerm ? `No results for "${searchTerm}"` : "Try adjusting your search criteria"}
    actionText={searchTerm ? "Clear search" : "Browse all"}
    actionIcon={searchTerm ? "x" : "grid"}
    onActionClick={onClearSearch}
    className={className}
  />
);

export const NoDataYet = ({ 
  title = "Nothing here yet",
  description = "Get started by adding your first item.",
  actionText = "Add item",
  onActionClick,
  className 
}) => (
  <EmptyState
    icon="plus-circle"
    title={title}
    description={description}
    actionText={actionText}
    actionIcon="plus"
    onActionClick={onActionClick}
    variant="minimal"
    className={className}
  />
);

export const ErrorState = ({ 
  title = "Something went wrong",
  description = "We encountered an error loading this content.",
  actionText = "Try again",
  onRetry,
  className 
}) => (
  <EmptyState
    icon="alert-triangle"
    title={title}
    description={description}
    actionText={actionText}
    actionIcon="refresh-cw"
    onActionClick={onRetry}
    variant="error"
    className={className}
  />
);

export default EmptyState;
