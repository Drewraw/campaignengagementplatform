import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyNotifications = ({ filterType }) => {
  const navigate = useNavigate();

  const getEmptyStateContent = () => {
    switch (filterType) {
      case 'unread':
        return {
          icon: 'CheckCheck',
          title: 'All caught up!',
          description: 'You have no unread notifications. Great job staying on top of things!',
          action: {
            label: 'View all notifications',
            onClick: () => navigate('/notifications-center?filter=all')
          }
        };
      case 'campaign_updates':
        return {
          icon: 'Target',
          title: 'No campaign updates',
          description: 'Join some campaigns to start receiving updates about their progress.',
          action: {
            label: 'Explore campaigns',
            onClick: () => navigate('/campaign-details')
          }
        };
      case 'social_activity':
        return {
          icon: 'Heart',
          title: 'No social activity',
          description: 'Create campaigns or engage with others to see social notifications here.',
          action: {
            label: 'Create campaign',
            onClick: () => navigate('/create-campaign')
          }
        };
      case 'system':
        return {
          icon: 'Settings',
          title: 'No system messages',
          description: 'System announcements and important updates will appear here.',
          action: null
        };
      default:
        return {
          icon: 'Bell',
          title: 'No notifications yet',
          description: 'When you join campaigns, interact with others, or receive updates, they\'ll appear here.',
          action: {
            label: 'Explore campaigns',
            onClick: () => navigate('/campaign-details')
          }
        };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
        <Icon name={content?.icon} size={32} className="text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {content?.title}
      </h3>
      <p className="text-muted-foreground mb-8 max-w-md leading-relaxed">
        {content?.description}
      </p>
      {content?.action && (
        <Button 
          onClick={content?.action?.onClick}
          className="flex items-center space-x-2"
        >
          <Icon name="ArrowRight" size={16} />
          <span>{content?.action?.label}</span>
        </Button>
      )}
      {/* Additional suggestions */}
      <div className="mt-12 w-full max-w-md">
        <h4 className="text-sm font-medium text-foreground mb-4">Get started:</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/timeline-feed')}
            className="flex items-center space-x-2 justify-start"
          >
            <Icon name="Home" size={16} />
            <span>View timeline</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/user-profile')}
            className="flex items-center space-x-2 justify-start"
          >
            <Icon name="User" size={16} />
            <span>Edit profile</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmptyNotifications;