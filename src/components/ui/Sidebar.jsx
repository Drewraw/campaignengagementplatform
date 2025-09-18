import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isCollapsed = false, onToggleCollapse }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notificationCounts, setNotificationCounts] = useState({
    notifications: 3,
    timeline: 5
  });
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { 
      label: 'Timeline', 
      path: '/timeline-feed', 
      icon: 'Home',
      notificationKey: 'timeline'
    },
    { 
      label: 'Explore', 
      path: '/campaign-details', 
      icon: 'Search'
    },
    { 
      label: 'Create', 
      path: '/create-campaign', 
      icon: 'Plus'
    },
    { 
      label: 'Profile', 
      path: '/user-profile', 
      icon: 'User'
    },
    { 
      label: 'Notifications', 
      path: '/notifications-center', 
      icon: 'Bell',
      notificationKey: 'notifications'
    },
    {
      label: 'Feedback',
      path: '/feedback',
      icon: 'MessageSquare'
    }
  ];

  const brandNavItems = [
    { 
      label: 'Brand Dashboard', 
      path: '/brand-dashboard', 
      icon: 'BarChart3',
      roleRequired: 'brand'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    // Clear notifications for visited items
    const item = [...navigationItems, ...brandNavItems]?.find(item => item?.path === path);
    if (item?.notificationKey) {
      setNotificationCounts(prev => ({
        ...prev,
        [item?.notificationKey]: 0
      }));
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate(`/campaign-details?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const isActive = (path) => location?.pathname === path;

  // Simulate real-time notification updates
  useEffect(() => {
    const interval = setInterval(() => {
      setNotificationCounts(prev => ({
        ...prev,
        notifications: Math.max(0, prev?.notifications + Math.floor(Math.random() * 2) - 1)
      }));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const NotificationBadge = ({ count }) => {
    if (!count || count === 0) return null;
    
    return (
      <span className="absolute -top-1 -right-1 bg-error text-error-foreground text-xs font-medium px-1.5 py-0.5 rounded-full min-w-[18px] h-[18px] flex items-center justify-center animate-scale-in">
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen bg-card border-r border-border z-40 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-60'
    }`}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <button
              onClick={() => navigate('/timeline-feed')}
              className="flex items-center space-x-2 hover-scale transition-smooth"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Zap" size={20} color="white" />
              </div>
              <span className="text-lg font-semibold text-foreground">CampaignConnect</span>
            </button>
          )}
          
          {isCollapsed && (
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
              <Icon name="Zap" size={20} color="white" />
            </div>
          )}
          
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className={isCollapsed ? 'hidden' : ''}
            >
              <Icon name="PanelLeftClose" size={16} />
            </Button>
          )}
        </div>

        {/* Search */}
        {!isCollapsed && (
          <div className="p-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  placeholder="Search campaigns..."
                  className={`w-full pl-10 pr-4 py-2 bg-input border rounded-lg text-sm transition-smooth focus:outline-none focus:ring-2 focus:ring-ring ${
                    isSearchFocused ? 'border-ring' : 'border-border'
                  }`}
                />
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
                />
              </div>
            </form>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2">
          <div className="space-y-1">
            {navigationItems?.map((item) => (
              <button
                key={item?.path}
                onClick={() => handleNavigation(item?.path)}
                className={`relative w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-smooth hover-scale group ${
                  isActive(item?.path)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={isCollapsed ? item?.label : ''}
              >
                <div className="relative">
                  <Icon name={item?.icon} size={18} />
                  {item?.notificationKey && (
                    <NotificationBadge count={notificationCounts?.[item?.notificationKey]} />
                  )}
                </div>
                {!isCollapsed && <span>{item?.label}</span>}
                
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-large opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    {item?.label}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Brand Section */}
          <div className="mt-8">
            {!isCollapsed && (
              <div className="px-3 py-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Business
                </h3>
              </div>
            )}
            <div className="space-y-1">
              {brandNavItems?.map((item) => (
                <button
                  key={item?.path}
                  onClick={() => handleNavigation(item?.path)}
                  className={`relative w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-smooth hover-scale group ${
                    isActive(item?.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                  title={isCollapsed ? item?.label : ''}
                >
                  <Icon name={item?.icon} size={18} />
                  {!isCollapsed && <span>{item?.label}</span>}
                  
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-large opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item?.label}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          {!isCollapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">John Doe</p>
                <p className="text-xs text-muted-foreground truncate">john@example.com</p>
              </div>
              <Button variant="ghost" size="sm">
                <Icon name="Settings" size={16} />
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                <Icon name="User" size={16} className="text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;