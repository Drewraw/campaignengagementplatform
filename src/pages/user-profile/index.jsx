import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProfileHeader from './components/ProfileHeader';
import TabNavigation from './components/TabNavigation';
import CampaignCard from './components/CampaignCard';
import ActivityFeed from './components/ActivityFeed';
import EditProfileModal from './components/EditProfileModal';
import Icon from '../../components/AppIcon';


const UserProfile = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('active');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [campaigns, setCampaigns] = useState({
    active: [],
    created: [],
    completed: []
  });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock user data
  const mockUser = {
    id: 1,
    name: "Sarah Johnson",
    username: "sarahj_deals",
    bio: "Passionate about finding the best deals and building community through group buying. Love tech gadgets and sustainable products! 🌱✨",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    joinDate: "March 2023",
    location: "San Francisco, CA",
    website: "https://sarahdeals.com",
    isVerified: true,
    isOwnProfile: true,
    stats: {
      campaignsCreated: 12,
      campaignsJoined: 47,
      totalSavings: "$1,247",
      communityImpact: "892"
    },
    achievements: [
      { id: 1, name: "First Campaign", icon: "Trophy", description: "Created your first campaign" },
      { id: 2, name: "Deal Hunter", icon: "Target", description: "Joined 25+ campaigns" },
      { id: 3, name: "Community Builder", icon: "Users", description: "Helped 100+ people save money" },
      { id: 4, name: "Early Adopter", icon: "Zap", description: "One of the first 1000 users" }
    ]
  };

  // Mock campaigns data
  const mockCampaigns = {
    active: [
      {
        id: 1,
        title: "iPhone 15 Pro Max Group Buy",
        description: "Get the latest iPhone with exclusive group discount. Limited time offer with premium accessories included.",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300&h=200&fit=crop",
        status: "active",
        currentSupporters: 87,
        targetSupporters: 100,
        timeLeft: "3 days",
        discount: 15
      },
      {
        id: 2,
        title: "Sustainable Fashion Bundle",
        description: "Eco-friendly clothing collection from top sustainable brands. Perfect for conscious consumers.",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=300&h=200&fit=crop",
        status: "active",
        currentSupporters: 34,
        targetSupporters: 50,
        timeLeft: "1 week",
        discount: 25
      },
      {
        id: 3,
        title: "Premium Coffee Subscription",
        description: "Monthly delivery of artisanal coffee beans from around the world. Perfect for coffee enthusiasts.",
        image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=200&fit=crop",
        status: "active",
        currentSupporters: 23,
        targetSupporters: 30,
        timeLeft: "5 days",
        discount: 20
      }
    ],
    created: [
      {
        id: 4,
        title: "Smart Home Security System",
        description: "Complete home security solution with AI-powered cameras and smart sensors for modern homes.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop",
        status: "active",
        currentSupporters: 156,
        targetSupporters: 200,
        timeLeft: "2 weeks",
        discount: 30
      },
      {
        id: 5,
        title: "Organic Skincare Set",
        description: "Natural skincare products made with organic ingredients. Perfect for sensitive skin types.",
        image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=200&fit=crop",
        status: "completed",
        currentSupporters: 75,
        targetSupporters: 75,
        timeLeft: "Completed",
        discount: 40,
        savings: 89
      }
    ],
    completed: [
      {
        id: 6,
        title: "Wireless Earbuds Pro",
        description: "Premium wireless earbuds with noise cancellation and long battery life for music lovers.",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&h=200&fit=crop",
        status: "completed",
        currentSupporters: 120,
        targetSupporters: 100,
        timeLeft: "Completed",
        discount: 35,
        savings: 67,
        couponUsed: true
      },
      {
        id: 7,
        title: "Fitness Tracker Bundle",
        description: "Advanced fitness tracking device with health monitoring features and premium accessories.",
        image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=300&h=200&fit=crop",
        status: "completed",
        currentSupporters: 89,
        targetSupporters: 80,
        timeLeft: "Completed",
        discount: 25,
        savings: 45,
        couponUsed: true
      }
    ]
  };

  // Mock activities data
  const mockActivities = [
    {
      id: 1,
      type: "campaign_created",
      title: "Created new campaign",
      description: "Smart Home Security System - Help us reach 200 supporters for 30% off!",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=50&h=50&fit=crop",
      metadata: {
        supporters: 156,
        discount: 30
      }
    },
    {
      id: 2,
      type: "campaign_joined",
      title: "Joined campaign",
      description: "iPhone 15 Pro Max Group Buy - 13 more supporters needed!",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=50&h=50&fit=crop",
      metadata: {
        supporters: 87,
        discount: 15
      }
    },
    {
      id: 3,
      type: "campaign_completed",
      title: "Campaign completed successfully",
      description: "Organic Skincare Set reached its target! Coupon code sent to your email.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=50&h=50&fit=crop",
      metadata: {
        supporters: 75,
        savings: 89
      }
    },
    {
      id: 4,
      type: "achievement_earned",
      title: "Achievement unlocked",
      description: "Community Builder - You've helped 100+ people save money!",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      metadata: {}
    },
    {
      id: 5,
      type: "coupon_redeemed",
      title: "Coupon redeemed",
      description: "Used 35% off coupon for Wireless Earbuds Pro",
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      metadata: {
        savings: 67
      }
    }
  ];

  const tabs = [
    { id: 'active', label: 'Active Campaigns', icon: 'Activity', count: mockCampaigns?.active?.length },
    { id: 'created', label: 'Created', icon: 'Plus', count: mockCampaigns?.created?.length },
    { id: 'completed', label: 'Completed', icon: 'CheckCircle', count: mockCampaigns?.completed?.length },
    { id: 'activity', label: 'Activity', icon: 'Clock', count: mockActivities?.length }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setUser(mockUser);
      setCampaigns(mockCampaigns);
      setActivities(mockActivities);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)]?.map((_, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4 animate-pulse">
              <div className="bg-muted h-32 rounded-lg mb-3" />
              <div className="space-y-2">
                <div className="bg-muted h-4 rounded w-3/4" />
                <div className="bg-muted h-3 rounded w-full" />
                <div className="bg-muted h-3 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeTab === 'activity') {
      return <ActivityFeed activities={activities} />;
    }

    const currentCampaigns = campaigns?.[activeTab] || [];

    if (currentCampaigns?.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name={tabs?.find(tab => tab?.id === activeTab)?.icon || 'Package'} size={24} className="text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No {activeTab} campaigns yet
          </h3>
          <p className="text-muted-foreground mb-4">
            {activeTab === 'active' && "Join some campaigns to see them here"}
            {activeTab === 'created' && "Create your first campaign to get started"}
            {activeTab === 'completed' && "Complete some campaigns to see your history"}
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentCampaigns?.map((campaign) => (
          <CampaignCard
            key={campaign?.id}
            campaign={campaign}
            type={activeTab}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="bg-card border border-border rounded-lg p-6 mb-6 animate-pulse">
              <div className="h-32 bg-muted rounded-lg mb-4" />
              <div className="flex items-end gap-4 mb-4">
                <div className="w-24 h-24 bg-muted rounded-full" />
                <div className="space-y-2">
                  <div className="bg-muted h-6 rounded w-32" />
                  <div className="bg-muted h-4 rounded w-24" />
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[...Array(4)]?.map((_, index) => (
                  <div key={index} className="text-center">
                    <div className="bg-muted h-8 rounded w-16 mx-auto mb-2" />
                    <div className="bg-muted h-4 rounded w-20 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <ProfileHeader
            user={user}
            onEditProfile={handleEditProfile}
          />

          <TabNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
            tabs={tabs}
          />

          {renderTabContent()}
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default UserProfile;