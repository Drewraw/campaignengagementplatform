import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import CampaignCard from './components/CampaignCard';
import ActivityFeed from './components/ActivityFeed';
import Icon from '../../components/AppIcon';
import axios from 'axios';

const UserProfile = ({ currentUser }) => { // currentUser is logged-in user
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('active');
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState({ active: [], created: [], completed: [] });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dmMessage, setDmMessage] = useState('');

  const isAdmin = currentUser?.role === 'admin'; // admin check

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`/api/getUserProfileData?userId=${searchParams.get('id')}`);
        setUser(response.data.user);
        setCampaigns(response.data.campaigns);
        setActivities(response.data.activities);
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  const tabs = [
    { id: 'active', label: 'Active Campaigns', icon: 'Activity', count: campaigns.active.length },
    { id: 'created', label: 'Created', icon: 'Plus', count: campaigns.created.length },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle', count: campaigns.completed.length },
    { id: 'activity', label: 'Activity', icon: 'Clock', count: activities.length }
  ];

  const sendDM = async () => {
    if (!dmMessage.trim()) return;
    try {
      await axios.post('/api/sendDM', { toUserId: user.id, message: dmMessage });
      alert('Message sent!');
      setDmMessage('');
    } catch (err) {
      console.error('Failed to send DM', err);
      alert('Failed to send message');
    }
  };

  const renderTabContent = () => {
    if (isLoading) {
      return <p>Loading profile...</p>;
    }

    if (activeTab === 'activity') return <ActivityFeed activities={activities} />;

    const currentCampaigns = campaigns[activeTab] || [];
    if (currentCampaigns.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name={tabs.find(tab => tab.id === activeTab)?.icon || 'Package'} size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No {activeTab} campaigns yet
          </h3>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCampaigns.map((campaign) => (
          <div key={campaign.id} className="relative">
            <CampaignCard
              campaign={campaign}
              type={activeTab}
              onClick={() => navigate(`/campaign-details?id=${campaign.id}`)}
            />
            {/* Edit button for creator */}
            {activeTab === 'created' && currentUser?.id === campaign.creator.id && (
              <button
                className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs"
                onClick={() => navigate(`/edit-campaign?id=${campaign.id}`)}
              >
                Edit
              </button>
            )}
          </div>
        ))}
      </div>
    );
  };

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16 max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-muted rounded-full overflow-hidden">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{user.name}</h2>
              <p className="text-muted-foreground">@{user.username}</p>
            </div>
          </div>

          {/* Admin DM section */}
          {isAdmin && (
            <div className="flex flex-col space-y-2">
              <textarea
                className="border p-2 rounded w-64"
                placeholder="Send DM to user"
                value={dmMessage}
                onChange={(e) => setDmMessage(e.target.value)}
              />
              <button
                className="bg-green-500 text-white px-4 py-2 rounded"
                onClick={sendDM}
              >
                Send DM
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded ${
                activeTab === tab.id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {renderTabContent()}
      </div>
    </div>
  );
};

export default UserProfile;
