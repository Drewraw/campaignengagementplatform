import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const NotificationSettings = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSettingChange = (category, setting, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [category]: {
        ...prev?.[category],
        [setting]: value
      }
    }));
  };

  const handleSave = () => {
    onUpdateSettings(localSettings);
    onClose();
  };

  const handleReset = () => {
    setLocalSettings(settings);
  };

  if (!isOpen) return null;

  const settingCategories = [
    {
      title: 'Campaign Updates',
      description: 'Notifications about campaign progress and milestones',
      icon: 'Target',
      settings: [
        { key: 'milestones', label: 'Campaign milestones reached', description: 'When campaigns hit 25%, 50%, 75%, and 100% targets' },
        { key: 'completion', label: 'Campaign completions', description: 'When campaigns you joined are completed' },
        { key: 'newSupporters', label: 'New supporters', description: 'When someone joins your campaigns' },
        { key: 'deadlines', label: 'Campaign deadlines', description: 'Reminders before campaigns expire' }
      ]
    },
    {
      title: 'Social Activity',
      description: 'Notifications about social interactions',
      icon: 'Heart',
      settings: [
        { key: 'likes', label: 'Likes on your content', description: 'When someone likes your campaigns or comments' },
        { key: 'comments', label: 'Comments and replies', description: 'When someone comments on your content or replies to you' },
        { key: 'mentions', label: 'Mentions', description: 'When someone mentions you in comments' },
        { key: 'follows', label: 'New followers', description: 'When someone starts following you' }
      ]
    },
    {
      title: 'System Messages',
      description: 'Platform announcements and account notifications',
      icon: 'Settings',
      settings: [
        { key: 'announcements', label: 'Platform announcements', description: 'Important updates and new features' },
        { key: 'security', label: 'Security alerts', description: 'Login attempts and security-related notifications' },
        { key: 'marketing', label: 'Marketing updates', description: 'Promotional content and special offers' },
        { key: 'tips', label: 'Tips and tutorials', description: 'Helpful tips to improve your experience' }
      ]
    }
  ];

  const deliveryMethods = [
    { key: 'inApp', label: 'In-app notifications', description: 'Show notifications in the app' },
    { key: 'email', label: 'Email notifications', description: 'Send notifications to your email' },
    { key: 'push', label: 'Push notifications', description: 'Browser push notifications' },
    { key: 'sms', label: 'SMS notifications', description: 'Text message notifications (premium campaigns only)' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-large w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Settings" size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Notification Settings</h2>
              <p className="text-sm text-muted-foreground">Customize how you receive notifications</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-8">
            {/* Delivery Methods */}
            <div>
              <h3 className="text-base font-medium text-foreground mb-4">Delivery Methods</h3>
              <div className="space-y-3">
                {deliveryMethods?.map((method) => (
                  <div key={method?.key} className="flex items-start space-x-3">
                    <Checkbox
                      checked={localSettings?.delivery?.[method?.key] || false}
                      onChange={(e) => handleSettingChange('delivery', method?.key, e?.target?.checked)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-foreground cursor-pointer">
                        {method?.label}
                      </label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {method?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Categories */}
            {settingCategories?.map((category) => (
              <div key={category?.title}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                    <Icon name={category?.icon} size={14} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-foreground">{category?.title}</h3>
                    <p className="text-xs text-muted-foreground">{category?.description}</p>
                  </div>
                </div>
                
                <div className="space-y-3 ml-9">
                  {category?.settings?.map((setting) => (
                    <div key={setting?.key} className="flex items-start space-x-3">
                      <Checkbox
                        checked={localSettings?.[category?.title?.toLowerCase()?.replace(' ', '')]?.[setting?.key] || false}
                        onChange={(e) => handleSettingChange(
                          category?.title?.toLowerCase()?.replace(' ', ''), 
                          setting?.key, 
                          e?.target?.checked
                        )}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <label className="text-sm font-medium text-foreground cursor-pointer">
                          {setting?.label}
                        </label>
                        <p className="text-xs text-muted-foreground mt-1">
                          {setting?.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Quiet Hours */}
            <div>
              <h3 className="text-base font-medium text-foreground mb-4">Quiet Hours</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={localSettings?.quietHours?.enabled || false}
                    onChange={(e) => handleSettingChange('quietHours', 'enabled', e?.target?.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-foreground cursor-pointer">
                      Enable quiet hours
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Pause non-urgent notifications during specified hours
                    </p>
                  </div>
                </div>
                
                {localSettings?.quietHours?.enabled && (
                  <div className="ml-6 flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">From:</span>
                      <select 
                        value={localSettings?.quietHours?.start || '22:00'}
                        onChange={(e) => handleSettingChange('quietHours', 'start', e?.target?.value)}
                        className="px-2 py-1 border border-border rounded text-foreground bg-input"
                      >
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i?.toString()?.padStart(2, '0');
                          return (
                            <option key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-muted-foreground">To:</span>
                      <select 
                        value={localSettings?.quietHours?.end || '08:00'}
                        onChange={(e) => handleSettingChange('quietHours', 'end', e?.target?.value)}
                        className="px-2 py-1 border border-border rounded text-foreground bg-input"
                      >
                        {Array.from({ length: 24 }, (_, i) => {
                          const hour = i?.toString()?.padStart(2, '0');
                          return (
                            <option key={hour} value={`${hour}:00`}>
                              {hour}:00
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-border bg-muted/30">
          <Button variant="outline" onClick={handleReset}>
            Reset to defaults
          </Button>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;