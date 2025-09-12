import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const NotificationFilters = ({ 
  activeFilter, 
  onFilterChange, 
  unreadCount, 
  onMarkAllAsRead, 
  onClearAll 
}) => {
  const filterOptions = [
    { 
      key: 'all', 
      label: 'All', 
      icon: 'Bell',
      count: null
    },
    { 
      key: 'unread', 
      label: 'Unread', 
      icon: 'BellRing',
      count: unreadCount
    },
    { 
      key: 'campaign_updates', 
      label: 'Campaigns', 
      icon: 'Target',
      count: null
    },
    { 
      key: 'social_activity', 
      label: 'Social', 
      icon: 'Heart',
      count: null
    },
    { 
      key: 'system', 
      label: 'System', 
      icon: 'Settings',
      count: null
    }
  ];

  return (
    <div className="bg-card border-b border-border">
      {/* Filter Tabs */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-1 overflow-x-auto">
          {filterOptions?.map((filter) => (
            <Button
              key={filter?.key}
              variant={activeFilter === filter?.key ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onFilterChange(filter?.key)}
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <Icon name={filter?.icon} size={16} />
              <span>{filter?.label}</span>
              {filter?.count !== null && filter?.count > 0 && (
                <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                  activeFilter === filter?.key 
                    ? 'bg-primary-foreground text-primary' 
                    : 'bg-primary text-primary-foreground'
                }`}>
                  {filter?.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 ml-4">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onMarkAllAsRead}
              className="flex items-center space-x-2"
            >
              <Icon name="CheckCheck" size={16} />
              <span className="hidden sm:inline">Mark all read</span>
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="flex items-center space-x-2 text-muted-foreground hover:text-error"
          >
            <Icon name="Trash2" size={16} />
            <span className="hidden sm:inline">Clear all</span>
          </Button>
        </div>
      </div>
      {/* Filter Summary */}
      {activeFilter !== 'all' && (
        <div className="px-4 pb-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Filter" size={14} />
            <span>
              Showing {activeFilter === 'unread' ? 'unread' : activeFilter?.replace('_', ' ')} notifications
            </span>
            {activeFilter === 'unread' && unreadCount > 0 && (
              <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {unreadCount} unread
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationFilters;