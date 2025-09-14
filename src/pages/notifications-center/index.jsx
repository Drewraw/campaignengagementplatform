import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
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

  // Initialize notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/getNotifications');
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
        // In a real app, you might want to set an error state here
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotifications();
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
  };

  return (
    <div className="notifications-center">
      <Header />
      <div className="notifications-center__header">
        <h1>Notifications</h1>
        <Button onClick={() => setIsSettingsOpen(true)}>
          <Icon name="settings" />
          Settings
        </Button>
      </div>

      <NotificationSearch
        onSearch={handleSearch}
        onClear={handleClearSearch}
        isSearching={isSearching}
        searchQuery={searchQuery}
      />

      <NotificationFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        onMarkAllAsRead={handleMarkAllAsRead}
        onClearAll={handleClearAll}
        hasUnread={notifications.some(n => !n.isRead)}
      />

      {isLoading ? (
        <p>Loading notifications...</p>
      ) : filteredNotifications.length > 0 ? (
        <div className="notifications-list">
          {filteredNotifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDeleteNotification}
            />
          ))}
        </div>
      ) : (
        <EmptyNotifications />
      )}

      {isSettingsOpen && (
        <NotificationSettings
          settings={notificationSettings}
          onClose={() => setIsSettingsOpen(false)}
          onSave={(newSettings) => {
            setNotificationSettings(newSettings);
            setIsSettingsOpen(false);
            // Here you would typically save the settings to a backend
          }}
        />
      )}
    </div>
  );
};

export default NotificationsCenter;