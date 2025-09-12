import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import MetricsCard from './components/MetricsCard';
import CampaignTable from './components/CampaignTable';
import CouponManager from './components/CouponManager';
import AnalyticsChart from './components/AnalyticsChart';
import MessageCenter from './components/MessageCenter';
import ProductCatalog from './components/ProductCatalog';
import Icon from '../../components/AppIcon';


const BrandDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data
  const metricsData = [
    {
      title: 'Total Campaigns',
      value: '127',
      change: '+12%',
      changeType: 'positive',
      icon: 'Target',
      trend: true
    },
    {
      title: 'Active Promotions',
      value: '23',
      change: '+5%',
      changeType: 'positive',
      icon: 'Zap',
      trend: true
    },
    {
      title: 'Coupon Redemptions',
      value: '1,847',
      change: '+28%',
      changeType: 'positive',
      icon: 'Ticket',
      trend: true
    },
    {
      title: 'Engagement Rate',
      value: '67.3%',
      change: '-3%',
      changeType: 'negative',
      icon: 'TrendingUp',
      trend: true
    }
  ];

  const campaignsData = [
    {
      id: 1,
      productName: 'iPhone 15 Pro Max',
      productImage: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      price: 1199,
      creator: 'Sarah Johnson',
      creatorAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      currentSupporters: 89,
      targetSupporters: 100,
      status: 'active',
      createdAt: '2025-01-08'
    },
    {
      id: 2,
      productName: 'Nike Air Max 270',
      productImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      price: 150,
      creator: 'Mike Chen',
      creatorAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      currentSupporters: 45,
      targetSupporters: 75,
      status: 'pending',
      createdAt: '2025-01-09'
    },
    {
      id: 3,
      productName: 'Samsung Galaxy S24',
      productImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      price: 899,
      creator: 'Emma Davis',
      creatorAvatar: 'https://randomuser.me/api/portraits/women/28.jpg',
      currentSupporters: 120,
      targetSupporters: 100,
      status: 'completed',
      createdAt: '2025-01-05'
    },
    {
      id: 4,
      productName: 'MacBook Pro 14"',
      productImage: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      price: 1999,
      creator: 'Alex Rodriguez',
      creatorAvatar: 'https://randomuser.me/api/portraits/men/35.jpg',
      currentSupporters: 25,
      targetSupporters: 50,
      status: 'active',
      createdAt: '2025-01-07'
    },
    {
      id: 5,
      productName: 'Sony WH-1000XM5',
      productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      price: 399,
      creator: 'Lisa Wang',
      creatorAvatar: 'https://randomuser.me/api/portraits/women/41.jpg',
      currentSupporters: 15,
      targetSupporters: 30,
      status: 'expired',
      createdAt: '2024-12-28'
    }
  ];

  const couponsData = [
    {
      id: 1,
      code: 'BRAND20-XYZ123',
      discount: 20,
      status: 'active',
      expirationDate: '2025-02-15',
      usedBy: null
    },
    {
      id: 2,
      code: 'BRAND15-ABC456',
      discount: 15,
      status: 'used',
      expirationDate: '2025-02-10',
      usedBy: 'john.doe@email.com'
    },
    {
      id: 3,
      code: 'BRAND25-DEF789',
      discount: 25,
      status: 'active',
      expirationDate: '2025-03-01',
      usedBy: null
    },
    {
      id: 4,
      code: 'BRAND10-GHI012',
      discount: 10,
      status: 'expired',
      expirationDate: '2025-01-05',
      usedBy: null
    },
    {
      id: 5,
      code: 'BRAND30-JKL345',
      discount: 30,
      status: 'active',
      expirationDate: '2025-02-20',
      usedBy: null
    }
  ];

  const messagesData = [
    {
      id: 1,
      type: 'broadcast',
      content: `Exciting news! We've just launched a special promotion for all active campaigns. Get ready for amazing deals!`,
      campaign: 'all',timestamp: new Date('2025-01-10T10:30:00'),
      recipientCount: 1247,
      readCount: 892
    },
    {
      id: 2,
      type: 'individual',senderName: 'Sarah Johnson',senderAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      content: `Hi! I wanted to ask about the timeline for the iPhone 15 Pro campaign. When can we expect the coupon codes to be distributed?`,
      campaignContext: 'iPhone 15 Pro Max Campaign',timestamp: new Date('2025-01-10T09:15:00')
    },
    {
      id: 3,
      type: 'broadcast',content: `Campaign milestone reached! The Nike Air Max campaign has hit 50 supporters. Keep sharing to unlock the next tier!`,campaign: '2',timestamp: new Date('2025-01-09T16:45:00'),
      recipientCount: 75,
      readCount: 68
    },
    {
      id: 4,
      type: 'individual',senderName: 'Mike Chen',senderAvatar: 'https://randomuser.me/api/portraits/men/45.jpg',
      content: `Thank you for approving my campaign! I'm excited to see how the community responds to this product.`,
      campaignContext: 'Nike Air Max 270 Campaign',
      timestamp: new Date('2025-01-09T14:20:00')
    }
  ];

  const productsData = [
    {
      id: 1,
      name: 'iPhone 15 Pro Max',
      description: 'Latest flagship smartphone with advanced camera system and A17 Pro chip for professional photography and gaming.',
      price: 1199,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400',
      status: 'active',
      campaignEligible: true,
      minSupporters: 50,
      activeCampaigns: 3,
      totalSales: 127
    },
    {
      id: 2,
      name: 'Nike Air Max 270',
      description: 'Comfortable running shoes with Max Air unit for superior cushioning and style for everyday wear.',
      price: 150,
      category: 'fashion',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
      status: 'active',
      campaignEligible: true,
      minSupporters: 25,
      activeCampaigns: 2,
      totalSales: 89
    },
    {
      id: 3,
      name: 'Samsung Galaxy S24',
      description: 'Premium Android smartphone with advanced AI features and professional-grade camera capabilities.',
      price: 899,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      status: 'active',
      campaignEligible: true,
      minSupporters: 40,
      activeCampaigns: 1,
      totalSales: 156
    },
    {
      id: 4,
      name: 'Dyson V15 Detect',
      description: 'Powerful cordless vacuum with laser dust detection and intelligent suction adjustment technology.',
      price: 749,
      category: 'home',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      status: 'inactive',
      campaignEligible: false,
      minSupporters: 30,
      activeCampaigns: 0,
      totalSales: 43
    },
    {
      id: 5,
      name: 'Adidas Ultraboost 22',
      description: 'High-performance running shoes with responsive Boost midsole and Primeknit upper for comfort.',
      price: 190,
      category: 'sports',
      image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400',
      status: 'active',
      campaignEligible: true,
      minSupporters: 20,
      activeCampaigns: 1,
      totalSales: 67
    },
    {
      id: 6,
      name: 'MacBook Pro 14"',
      description: 'Professional laptop with M3 Pro chip, Liquid Retina XDR display, and all-day battery life.',
      price: 1999,
      category: 'electronics',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
      status: 'active',
      campaignEligible: true,
      minSupporters: 35,
      activeCampaigns: 2,
      totalSales: 94
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'campaigns', label: 'Campaigns', icon: 'Target' },
    { id: 'coupons', label: 'Coupons', icon: 'Ticket' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
    { id: 'messages', label: 'Messages', icon: 'MessageCircle' },
    { id: 'products', label: 'Products', icon: 'Package' }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCampaignApprove = (campaignId) => {
    console.log('Approving campaign:', campaignId);
    // Implementation would update campaign status
  };

  const handleCampaignReject = (campaignId) => {
    console.log('Rejecting campaign:', campaignId);
    // Implementation would update campaign status
  };

  const handleCampaignMessage = (campaignId) => {
    console.log('Messaging campaign:', campaignId);
    setActiveTab('messages');
  };

  const handleGenerateCoupons = (formData) => {
    console.log('Generating coupons:', formData);
    // Implementation would generate new coupons
  };

  const handleToggleCouponStatus = (couponId) => {
    console.log('Toggling coupon status:', couponId);
    // Implementation would update coupon status
  };

  const handleSendMessage = (messageData) => {
    console.log('Sending message:', messageData);
    // Implementation would send message
  };

  const handleReplyMessage = (messageId, reply) => {
    console.log('Replying to message:', messageId, reply);
    // Implementation would send reply
  };

  const handleUpdateProduct = (productId, updateData) => {
    console.log('Updating product:', productId, updateData);
    // Implementation would update product
  };

  const handleToggleProductEligibility = (productId) => {
    console.log('Toggling product eligibility:', productId);
    // Implementation would toggle campaign eligibility
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)]?.map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
                ))}
              </div>
              <div className="h-96 bg-muted rounded-lg"></div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Brand Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor campaign performance and manage promotional activities
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 mb-8 overflow-x-auto">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap ${
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

          {/* Tab Content */}
          <div className="space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {metricsData?.map((metric, index) => (
                    <MetricsCard key={index} {...metric} />
                  ))}
                </div>

                {/* Recent Campaigns */}
                <CampaignTable
                  campaigns={campaignsData?.slice(0, 3)}
                  onApprove={handleCampaignApprove}
                  onReject={handleCampaignReject}
                  onMessage={handleCampaignMessage}
                />

                {/* Quick Analytics */}
                <AnalyticsChart data={{}} />
              </>
            )}

            {activeTab === 'campaigns' && (
              <CampaignTable
                campaigns={campaignsData}
                onApprove={handleCampaignApprove}
                onReject={handleCampaignReject}
                onMessage={handleCampaignMessage}
              />
            )}

            {activeTab === 'coupons' && (
              <CouponManager
                coupons={couponsData}
                onGenerateCoupons={handleGenerateCoupons}
                onToggleStatus={handleToggleCouponStatus}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsChart data={{}} />
            )}

            {activeTab === 'messages' && (
              <MessageCenter
                messages={messagesData}
                onSendMessage={handleSendMessage}
                onReplyMessage={handleReplyMessage}
              />
            )}

            {activeTab === 'products' && (
              <ProductCatalog
                products={productsData}
                onUpdateProduct={handleUpdateProduct}
                onToggleEligibility={handleToggleProductEligibility}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandDashboard;