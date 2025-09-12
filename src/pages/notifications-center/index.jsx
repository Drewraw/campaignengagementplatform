import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import NotificationItem from './components/NotificationItem';
import NotificationFilters from './components/NotificationFilters';
import NotificationSettings from './components/NotificationSettings';
import EmptyNotifications from './components/EmptyNotifications';
import NotificationSearch from './components/NotificationSearch';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const NotificationsCenter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [activeFilter, setActiveFilter] = useState(searchParams?.get('filter') || 'all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Mock notification settings
  const [notificationSettings, setNotificationSettings] = useState({
    delivery: {
      inApp: true,
      email: true,
      push: false,
      sms: false
    },
    campaignupdates: {
      milestones: true,
      completion: true,
      newSupporters: true,
      deadlines: true
    },
    socialactivity: {
      likes: true,
      comments: true,
      mentions: true,
      follows: false
    },
    systemmessages: {
      announcements: true,
      security: true,
      marketing: false,
      tips: true
    },
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  });

  // Mock notifications data
  const mockNotifications = [
    {
      id: 1,
      type: 'campaign_milestone',
      title: 'Campaign milestone reached!',
      message: 'Your campaign "Premium Wireless Headphones" has reached 75% of its target with 150 supporters.',
      timestamp: new Date(Date.now() - 300000), // 5 minutes ago
      isRead: false,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      senderName: 'Campaign System',
      campaignTitle: 'Premium Wireless Headphones',
      actionUrl: '/campaign-details?id=1'
    },
    {
      id: 2,
      type: 'new_supporter',
      title: 'New supporter joined!',
      message: 'Sarah Johnson joined your campaign "Eco-Friendly Water Bottles". You now have 89 supporters!',
      timestamp: new Date(Date.now() - 900000), // 15 minutes ago
      isRead: false,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
      senderName: 'Sarah Johnson',
      campaignTitle: 'Eco-Friendly Water Bottles',
      actionUrl: '/campaign-details?id=2'
    },
    {
      id: 3,
      type: 'comment',
      title: 'New comment on your campaign',
      message: 'Mike Chen commented: "This looks amazing! When do you expect to reach the target?"',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      isRead: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      senderName: 'Mike Chen',
      campaignTitle: 'Smart Home Security System',
      actionUrl: '/campaign-details?id=3'
    },
    {
      id: 4,
      type: 'campaign_complete',
      title: 'Campaign completed successfully!',
      message: 'Congratulations! Your campaign "Organic Coffee Subscription" reached its target. Coupon codes have been distributed.',
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      isRead: false,
      avatar: null,
      senderName: null,
      campaignTitle: 'Organic Coffee Subscription',
      actionUrl: '/campaign-details?id=4'
    },
    {
      id: 5,
      type: 'like',
      title: 'Someone liked your campaign',
      message: 'Emma Wilson and 3 others liked your campaign "Sustainable Fashion Collection".',
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      isRead: true,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      senderName: 'Emma Wilson',
      campaignTitle: 'Sustainable Fashion Collection',
      actionUrl: '/campaign-details?id=5'
    },
    {
      id: 6,
      type: 'system',
      title: 'New feature available',
      message: 'We\'ve added campaign analytics! Track your campaign performance with detailed insights and metrics.',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      isRead: true,
      avatar: null,
      senderName: null,
      campaignTitle: null,
      actionUrl: '/user-profile?tab=analytics'
    },
    {
      id: 7,
      type: 'brand_message',
      title: 'Message from TechGear Pro',
      message: 'Thank you for supporting our campaign! We\'re excited to share exclusive updates about our upcoming product launch.',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      isRead: true,
      avatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=40&h=40&fit=crop&crop=center',
      senderName: 'TechGear Pro',
      campaignTitle: 'Next-Gen Gaming Accessories',
      actionUrl: '/brand-dashboard?brand=techgear-pro'
    },
    {
      id: 8,
      type: 'campaign_milestone',
      title: 'Campaign milestone reached!',
      message: 'The campaign "Artisan Coffee Roasters" you joined has reached 50% of its target!',
      timestamp: new Date(Date.now() - 259200000), // 3 days ago
      isRead: true,
      avatar: null,
      senderName: null,
      campaignTitle: 'Artisan Coffee Roasters',
      actionUrl: '/campaign-details?id=6'
    }
  ];

  // Initialize notifications
  useEffect(() => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setNotifications(mockNotifications);
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter notifications based on active filter and search query
  useEffect(() => {
    let filtered = notifications;

    // Apply filter
    if (activeFilter !== 'all') {
      switch (activeFilter) {
        case 'unread':
          filtered = filtered?.filter(n => !n?.isRead);
          break;
        case 'campaign_updates':
          filtered = filtered?.filter(n => 
            ['campaign_milestone', 'campaign_complete', 'new_supporter']?.includes(n?.type)
          );
          break;
        case 'social_activity':
          filtered = filtered?.filter(n => 
            ['comment', 'like', 'mention', 'follow']?.includes(n?.type)
          );
          break;
        case 'system':
          filtered = filtered?.filter(n => 
            ['system', 'brand_message']?.includes(n?.type)
          );
          break;
      }
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered?.filter(n =>
        n?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        n?.message?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        (n?.campaignTitle && n?.campaignTitle?.toLowerCase()?.includes(searchQuery?.toLowerCase())) ||
        (n?.senderName && n?.senderName?.toLowerCase()?.includes(searchQuery?.toLowerCase()))
      );
    }

    setFilteredNotifications(filtered);
  }, [notifications, activeFilter, searchQuery]);

  // Update URL when filter changes
  useEffect(() => {
    if (activeFilter === 'all') {
      searchParams?.delete('filter');
    } else {
      searchParams?.set('filter', activeFilter);
    }
    setSearchParams(searchParams, { replace: true });
  }, [activeFilter, searchParams, setSearchParams]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev =>
      prev?.map(n =>
        n?.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev =>
      prev?.map(n => ({ ...n, isRead: true }))
    );
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev?.filter(n => n?.id !== notificationId)
    );
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.')) {
      setNotifications([]);
    }
  };

  const handleSearch = (query) => {
    setIsSearching(true);
    setSearchQuery(query);
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
  };

  const handleUpdateSettings = (newSettings) => {
    setNotificationSettings(newSettings);
    // Here you would typically save to backend
    console.log('Updated notification settings:', newSettings);
  };

  const unreadCount = notifications?.filter(n => !n?.isRead)?.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto">
          {/* Search Header */}
          <NotificationSearch
            onSearch={handleSearch}
            onClear={handleClearSearch}
            isSearching={isSearching}
          />

          {/* Filters and Actions */}
          <NotificationFilters
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            unreadCount={unreadCount}
            onMarkAllAsRead={handleMarkAllAsRead}
            onClearAll={handleClearAll}
          />

          {/* Settings Button */}
          <div className="bg-card border-b border-border px-4 py-2">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center space-x-2"
              >
                <Icon name="Settings" size={16} />
                <span>Settings</span>
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-card">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-muted-foreground">Loading notifications...</span>
                </div>
              </div>
            ) : filteredNotifications?.length === 0 ? (
              <EmptyNotifications filterType={activeFilter} />
            ) : (
              <div className="divide-y divide-border">
                {filteredNotifications?.map((notification) => (
                  <div key={notification?.id} className="group">
                    <NotificationItem
                      notification={notification}
                      onMarkAsRead={handleMarkAsRead}
                      onDelete={handleDeleteNotification}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Load More Button */}
          {filteredNotifications?.length > 0 && !isLoading && (
            <div className="bg-card border-t border-border p-6 text-center">
              <Button variant="outline" className="flex items-center space-x-2">
                <Icon name="RotateCcw" size={16} />
                <span>Load more notifications</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      {/* Settings Modal */}
      <NotificationSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={notificationSettings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
};

export default NotificationsCenter;