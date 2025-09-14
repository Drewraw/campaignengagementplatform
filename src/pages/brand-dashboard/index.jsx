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
import axios from 'axios';

const BrandDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    metricsData: [],
    campaignsData: [],
    couponsData: [],
    messagesData: [],
    productsData: [],
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'campaigns', label: 'Campaigns', icon: 'Target' },
    { id: 'coupons', label: 'Coupons', icon: 'Ticket' },
    { id: 'analytics', label: 'Analytics', icon: 'TrendingUp' },
    { id: 'messages', label: 'Messages', icon: 'MessageCircle' },
    { id: 'products', label: 'Products', icon: 'Package' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get('/api/getBrandDashboardData');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching brand dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCampaignApprove = (campaignId) => {
    console.log('Approving campaign:', campaignId);
  };

  const handleCampaignReject = (campaignId) => {
    console.log('Rejecting campaign:', campaignId);
  };

  const handleCampaignMessage = (campaignId) => {
    console.log('Messaging campaign:', campaignId);
    setActiveTab('messages');
  };

  const handleGenerateCoupons = (formData) => {
    console.log('Generating coupons:', formData);
  };

  const handleToggleCouponStatus = (couponId) => {
    console.log('Toggling coupon status:', couponId);
  };

  const handleSendMessage = (messageData) => {
    console.log('Sending message:', messageData);
  };

  const handleReplyMessage = (messageId, reply) => {
    console.log('Replying to message:', messageId, reply);
  };

  const handleUpdateProduct = (productId, updateData) => {
    console.log('Updating product:', productId, updateData);
  };

  const handleToggleProductEligibility = (productId) => {
    console.log('Toggling product eligibility:', productId);
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
                {[...Array(4)].map((_, i) => (
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Brand Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Monitor campaign performance and manage promotional activities
            </p>
          </div>

          <div className="flex items-center space-x-1 mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="space-y-8">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {data.metricsData.map((metric, index) => (
                    <MetricsCard key={index} {...metric} />
                  ))}
                </div>

                <CampaignTable
                  campaigns={data.campaignsData.slice(0, 3)}
                  onApprove={handleCampaignApprove}
                  onReject={handleCampaignReject}
                  onMessage={handleCampaignMessage}
                />

                <AnalyticsChart data={{}} />
              </>
            )}

            {activeTab === 'campaigns' && (
              <CampaignTable
                campaigns={data.campaignsData}
                onApprove={handleCampaignApprove}
                onReject={handleCampaignReject}
                onMessage={handleCampaignMessage}
              />
            )}

            {activeTab === 'coupons' && (
              <CouponManager
                coupons={data.couponsData}
                onGenerateCoupons={handleGenerateCoupons}
                onToggleStatus={handleToggleCouponStatus}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsChart data={{}} />
            )}

            {activeTab === 'messages' && (
              <MessageCenter
                messages={data.messagesData}
                onSendMessage={handleSendMessage}
                onReplyMessage={handleReplyMessage}
              />
            )}

            {activeTab === 'products' && (
              <ProductCatalog
                products={data.productsData}
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
