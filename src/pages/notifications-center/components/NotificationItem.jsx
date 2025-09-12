import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
  const navigate = useNavigate();

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'campaign_milestone':
        return { name: 'Target', color: 'text-success' };
      case 'campaign_complete':
        return { name: 'CheckCircle', color: 'text-success' };
      case 'new_supporter':
        return { name: 'UserPlus', color: 'text-primary' };
      case 'comment':
        return { name: 'MessageCircle', color: 'text-secondary' };
      case 'like':
        return { name: 'Heart', color: 'text-error' };
      case 'system':
        return { name: 'Bell', color: 'text-warning' };
      case 'brand_message':
        return { name: 'Mail', color: 'text-accent' };
      default:
        return { name: 'Bell', color: 'text-muted-foreground' };
    }
  };

  const handleNotificationClick = () => {
    if (!notification?.isRead) {
      onMarkAsRead(notification?.id);
    }
    
    // Navigate based on notification type
    if (notification?.actionUrl) {
      navigate(notification?.actionUrl);
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const iconConfig = getNotificationIcon(notification?.type);

  return (
    <div 
      className={`flex items-start space-x-3 p-4 border-b border-border hover:bg-muted/50 transition-smooth cursor-pointer ${
        !notification?.isRead ? 'bg-primary/5 border-l-4 border-l-primary' : ''
      }`}
      onClick={handleNotificationClick}
    >
      {/* Avatar or Icon */}
      <div className="flex-shrink-0">
        {notification?.avatar ? (
          <div className="relative">
            <Image
              src={notification?.avatar}
              alt={notification?.senderName || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-card border-2 border-card flex items-center justify-center ${iconConfig?.color}`}>
              <Icon name={iconConfig?.name} size={12} />
            </div>
          </div>
        ) : (
          <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${iconConfig?.color}`}>
            <Icon name={iconConfig?.name} size={20} />
          </div>
        )}
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className={`text-sm ${!notification?.isRead ? 'font-semibold text-foreground' : 'text-foreground'}`}>
              {notification?.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {notification?.message}
            </p>
            
            {/* Additional context */}
            {notification?.campaignTitle && (
              <div className="flex items-center space-x-2 mt-2">
                <div className="w-4 h-4 bg-primary/20 rounded flex items-center justify-center">
                  <Icon name="Target" size={10} className="text-primary" />
                </div>
                <span className="text-xs text-muted-foreground truncate">
                  {notification?.campaignTitle}
                </span>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-2 ml-3">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatTimeAgo(notification?.timestamp)}
            </span>
            {!notification?.isRead && (
              <div className="w-2 h-2 bg-primary rounded-full"></div>
            )}
          </div>
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center space-x-1">
          {!notification?.isRead && (
            <Button
              variant="ghost"
              size="xs"
              onClick={(e) => {
                e?.stopPropagation();
                onMarkAsRead(notification?.id);
              }}
              className="text-xs"
            >
              Mark read
            </Button>
          )}
          <Button
            variant="ghost"
            size="xs"
            onClick={(e) => {
              e?.stopPropagation();
              onDelete(notification?.id);
            }}
            className="text-xs text-muted-foreground hover:text-error"
          >
            <Icon name="X" size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;