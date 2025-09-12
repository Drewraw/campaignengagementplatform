import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeed = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'campaign_created':
        return 'Plus';
      case 'campaign_joined':
        return 'Users';
      case 'campaign_completed':
        return 'CheckCircle';
      case 'achievement_earned':
        return 'Award';
      case 'coupon_redeemed':
        return 'Ticket';
      default:
        return 'Activity';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'campaign_created':
        return 'text-primary bg-primary/10';
      case 'campaign_joined':
        return 'text-secondary bg-secondary/10';
      case 'campaign_completed':
        return 'text-success bg-success/10';
      case 'achievement_earned':
        return 'text-accent bg-accent/10';
      case 'coupon_redeemed':
        return 'text-warning bg-warning/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const activityTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  if (!activities || activities?.length === 0) {
    return (
      <div className="text-center py-8">
        <Icon name="Activity" size={48} className="text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities?.map((activity) => (
        <div key={activity?.id} className="flex gap-3 p-3 bg-card border border-border rounded-lg">
          {/* Activity Icon */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity?.type)}`}>
            <Icon name={getActivityIcon(activity?.type)} size={16} />
          </div>

          {/* Activity Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity?.title}</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {activity?.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {formatTimeAgo(activity?.timestamp)}
              </span>
            </div>

            {/* Activity Image/Thumbnail */}
            {activity?.image && (
              <div className="mt-2">
                <Image
                  src={activity?.image}
                  alt={activity?.title}
                  className="w-12 h-12 rounded object-cover"
                />
              </div>
            )}

            {/* Activity Metadata */}
            {activity?.metadata && (
              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                {activity?.metadata?.supporters && (
                  <div className="flex items-center gap-1">
                    <Icon name="Users" size={12} />
                    <span>{activity?.metadata?.supporters} supporters</span>
                  </div>
                )}
                {activity?.metadata?.savings && (
                  <div className="flex items-center gap-1 text-success">
                    <Icon name="DollarSign" size={12} />
                    <span>Saved ${activity?.metadata?.savings}</span>
                  </div>
                )}
                {activity?.metadata?.discount && (
                  <div className="flex items-center gap-1 text-accent">
                    <Icon name="Percent" size={12} />
                    <span>{activity?.metadata?.discount}% off</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;