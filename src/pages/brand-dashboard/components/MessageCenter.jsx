import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';


const MessageCenter = ({ messages, onSendMessage, onReplyMessage }) => {
  const [activeTab, setActiveTab] = useState('broadcast');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [replyText, setReplyText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  const tabs = [
    { id: 'broadcast', label: 'Broadcast Messages', icon: 'Megaphone' },
    { id: 'individual', label: 'Individual Messages', icon: 'MessageCircle' }
  ];

  const campaigns = [
    { id: 'all', name: 'All Campaigns' },
    { id: '1', name: 'iPhone 15 Pro Campaign' },
    { id: '2', name: 'Nike Air Max Campaign' },
    { id: '3', name: 'Samsung Galaxy Campaign' }
  ];

  const handleBroadcastSubmit = (e) => {
    e?.preventDefault();
    if (broadcastMessage?.trim()) {
      onSendMessage({
        type: 'broadcast',
        message: broadcastMessage,
        campaign: selectedCampaign,
        timestamp: new Date()
      });
      setBroadcastMessage('');
    }
  };

  const handleReplySubmit = (e) => {
    e?.preventDefault();
    if (replyText?.trim() && replyingTo) {
      onReplyMessage(replyingTo, replyText);
      setReplyText('');
      setReplyingTo(null);
    }
  };

  const formatTime = (date) => {
    return new Date(date)?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft">
      <div className="px-6 py-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Message Center</h2>
        <p className="text-sm text-muted-foreground mt-1">Communicate with campaign participants</p>
        
        <div className="flex items-center space-x-1 mt-4">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth ${
                activeTab === tab?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="p-6">
        {activeTab === 'broadcast' && (
          <div className="space-y-6">
            <form onSubmit={handleBroadcastSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Target Campaign
                  </label>
                  <select
                    value={selectedCampaign}
                    onChange={(e) => setSelectedCampaign(e?.target?.value)}
                    className="w-full px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    {campaigns?.map((campaign) => (
                      <option key={campaign?.id} value={campaign?.id}>
                        {campaign?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Broadcast Message
                  </label>
                  <div className="flex space-x-2">
                    <textarea
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e?.target?.value)}
                      placeholder="Type your message to campaign participants..."
                      rows={3}
                      className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      required
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      iconName="Send"
                      className="self-end"
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-foreground">Recent Broadcasts</h3>
              {messages?.filter(m => m?.type === 'broadcast')?.slice(0, 5)?.map((message) => (
                <div key={message?.id} className="bg-muted/30 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Icon name="Megaphone" size={16} className="text-primary" />
                      <span className="text-sm font-medium text-foreground">
                        {message?.campaign === 'all' ? 'All Campaigns' : `Campaign #${message?.campaign}`}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(message?.timestamp)} at {formatTime(message?.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{message?.content}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <span className="text-xs text-muted-foreground">
                      Sent to {message?.recipientCount} participants
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {message?.readCount} read
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'individual' && (
          <div className="space-y-4">
            {messages?.filter(m => m?.type === 'individual')?.map((message) => (
              <div key={message?.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <img
                    src={message?.senderAvatar}
                    alt={message?.senderName}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{message?.senderName}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(message?.timestamp)} at {formatTime(message?.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-foreground mb-2">{message?.content}</p>
                    
                    {message?.campaignContext && (
                      <div className="bg-muted/30 rounded p-2 mb-2">
                        <span className="text-xs text-muted-foreground">
                          Re: {message?.campaignContext}
                        </span>
                      </div>
                    )}

                    {replyingTo === message?.id ? (
                      <form onSubmit={handleReplySubmit} className="mt-3">
                        <div className="flex space-x-2">
                          <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e?.target?.value)}
                            placeholder="Type your reply..."
                            rows={2}
                            className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                            required
                          />
                          <div className="flex flex-col space-y-1">
                            <Button
                              type="submit"
                              variant="primary"
                              size="sm"
                              iconName="Send"
                            >
                              Reply
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setReplyingTo(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setReplyingTo(message?.id)}
                        iconName="Reply"
                        iconPosition="left"
                      >
                        Reply
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageCenter;