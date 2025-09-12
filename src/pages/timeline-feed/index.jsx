import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import CampaignCard from './components/CampaignCard';
import ComposeArea from './components/ComposeArea';
import SkeletonCard from './components/SkeletonCard';
import TrendingSection from './components/TrendingSection';
import FilterBar from './components/FilterBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const TimelineFeed = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [trendingCampaigns, setTrendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilters, setActiveFilters] = useState(['all']);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Mock current user
  const currentUser = {
    id: 1,
    name: "John Doe",
    username: "johndoe",
    email: "john@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  };

  // Mock campaigns data
  const mockCampaigns = [
    {
      id: 1,
      title: "🔥 Tesla Model 3 Group Buy - Tier Discounts Available!",
      description: "Join our tier-based campaign for Tesla Model 3! More supporters = bigger discounts for everyone. Get up to 15% off based on participation.",
      creator: {
        id: 2,
        name: "Tesla Collective",
        username: "teslagroup",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
      },
      product: {
        id: 1,
        name: "Tesla Model 3",
        price: 45000,
        image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&h=400&fit=crop"
      },
      currentSupporters: 847,
      tiers: [
        { requiredUsers: 500, discount: 5 },
        { requiredUsers: 1000, discount: 10 },
        { requiredUsers: 1500, discount: 15 }
      ],
      endDate: "2025-01-15T23:59:59Z",
      likes: 567,
      isLiked: false,
      isJoined: false,
      isTrending: true,
      comments: [
        {
          id: 1,
          user: {
            name: "Mike Johnson",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
          },
          text: "Interested! Love the tier system!",
          timeAgo: "2h"
        },
        {
          id: 2,
          isSystemMessage: true,
          user: {
            name: "Tesla Collective",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
          },
          text: "🎉 Tier 1 unlocked! We've reached 500 supporters - everyone gets 5% OFF! Let's push for Tier 2 (1000 supporters = 10% OFF)!",
          timeAgo: "4h"
        },
        {
          id: 3,
          user: {
            name: "Lisa Wang",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
          },
          text: "Amazing progress! Can\'t wait for the next tier.",
          timeAgo: "5h"
        }
      ]
    },
    {
      id: 2,
      title: "⚡ iPhone 15 Pro Max - Multi-Tier Campaign",
      description: "Revolutionary tier-based pricing! The more people join, the better deals we all get. Currently working towards 20% discount tier!",
      creator: {
        id: 3,
        name: "TechDeals Pro",
        username: "techdeals",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
      },
      product: {
        id: 2,
        name: "iPhone 15 Pro Max",
        price: 1199,
        image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=400&fit=crop"
      },
      currentSupporters: 1687,
      tiers: [
        { requiredUsers: 1000, discount: 10 },
        { requiredUsers: 1500, discount: 15 },
        { requiredUsers: 2000, discount: 20 }
      ],
      endDate: "2025-01-20T23:59:59Z",
      likes: 892,
      isLiked: true,
      isJoined: true,
      isTrending: true,
      comments: [
        {
          id: 4,
          user: {
            name: "Emma Davis",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=face"
          },
          text: "Interested!",
          timeAgo: "1h"
        },
        {
          id: 5,
          isSystemMessage: true,
          user: {
            name: "TechDeals Pro",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
          },
          text: "🚀 TIER 2 ACHIEVED! 15% OFF for everyone! Only 313 more supporters needed for the ultimate 20% discount tier. Let\'s make it happen!",
          timeAgo: "3h"
        },
        {
          id: 6,
          user: {
            name: "Alex Rivera",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
          },
          text: "This is incredible! Almost at the final tier!",
          timeAgo: "4h"
        }
      ]
    },
    {
      id: 3,
      title: "MacBook Pro M3 - Professional Bundle",
      description: "Get the latest MacBook Pro with professional accessories bundle. Perfect for developers and creatives.",
      creator: {
        id: 4,
        name: "David Kim",
        username: "techpro",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
      },
      product: {
        id: 3,
        name: "MacBook Pro M3",
        price: 1999,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=400&fit=crop"
      },
      currentSupporters: 423,
      targetSupporters: 500,
      discount: 15,
      endDate: "2025-01-25T23:59:59Z",
      likes: 156,
      isLiked: false,
      isJoined: false,
      isTrending: true,
      comments: []
    },
    {
      id: 4,
      title: "🎧 Sony WH-1000XM5 - Tier Rewards System",
      description: "Premium noise-canceling headphones with our innovative tier system. Help us reach 300 supporters for maximum savings!",
      creator: {
        id: 5,
        name: "AudioPhile Hub",
        username: "audiohub",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
      },
      product: {
        id: 4,
        name: "Sony WH-1000XM5",
        price: 399,
        image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=400&fit=crop"
      },
      currentSupporters: 89,
      tiers: [
        { requiredUsers: 100, discount: 8 },
        { requiredUsers: 200, discount: 15 },
        { requiredUsers: 300, discount: 25 }
      ],
      endDate: "2025-01-12T23:59:59Z",
      likes: 234,
      isLiked: false,
      isJoined: true,
      isTrending: false,
      comments: [
        {
          id: 7,
          user: {
            name: "Tom Wilson",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
          },
          text: "Interested! These headphones are amazing.",
          timeAgo: "30m"
        },
        {
          id: 8,
          isSystemMessage: true,
          user: {
            name: "AudioPhile Hub",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
          },
          text: "🎯 So close to Tier 1! Just 11 more supporters needed for 8% OFF. Spread the word!",
          timeAgo: "2h"
        }
      ]
    },
    {
      id: 5,
      title: "Samsung Galaxy S24 Ultra - Photography Beast",
      description: "Capture life in stunning detail with the Galaxy S24 Ultra. Professional-grade camera system with AI enhancement.",
      creator: {
        id: 6,
        name: "Robert Chen",
        username: "mobilepro",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
      },
      product: {
        id: 5,
        name: "Samsung Galaxy S24 Ultra",
        price: 1199,
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=400&fit=crop"
      },
      currentSupporters: 234,
      targetSupporters: 750,
      discount: 22,
      endDate: "2025-01-30T23:59:59Z",
      likes: 87,
      isLiked: false,
      isJoined: false,
      isTrending: false,
      comments: []
    },
    {
      id: 6,
      title: "🎮 Gaming Setup Bundle - Epic Tier Rewards",
      description: "Complete gaming setup with tier-based discounts! RTX 4080, mechanical keyboard, gaming mouse, and more. Epic savings await!",
      creator: {
        id: 7,
        name: "GamerCollective",
        username: "gamercollective",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face"
      },
      product: {
        id: 6,
        name: "Gaming Setup Bundle",
        price: 2499,
        image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600&h=400&fit=crop"
      },
      currentSupporters: 156,
      tiers: [
        { requiredUsers: 150, discount: 12 },
        { requiredUsers: 300, discount: 20 },
        { requiredUsers: 500, discount: 30 }
      ],
      endDate: "2025-02-01T23:59:59Z",
      likes: 445,
      isLiked: false,
      isJoined: false,
      isTrending: true,
      comments: [
        {
          id: 9,
          isSystemMessage: true,
          user: {
            name: "GamerCollective",
            avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&h=400&fit=crop&crop=face"
          },
          text: "🎉 TIER 1 UNLOCKED! 12% OFF achieved! Let's push for Tier 2 (300 supporters = 20% OFF). Epic gaming awaits!",
          timeAgo: "1h"
        },
        {
          id: 10,
          user: {
            name: "Sarah Mitchell",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
          },
          text: "Interested! This bundle is perfect for my setup upgrade.",
          timeAgo: "2h"
        }
      ]
    }
  ];

  // Load initial campaigns
  useEffect(() => {
    const loadInitialCampaigns = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCampaigns(mockCampaigns);
      setTrendingCampaigns(mockCampaigns?.filter(c => c?.isTrending));
      setLoading(false);
    };

    loadInitialCampaigns();
  }, []);

  // Filter campaigns based on active filters
  const filteredCampaigns = campaigns?.filter(campaign => {
    if (activeFilters?.includes('all')) return true;
    
    if (activeFilters?.includes('trending') && campaign?.isTrending) return true;
    if (activeFilters?.includes('new') && new Date(campaign.endDate) > new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) return true;
    if (activeFilters?.includes('ending-soon') && new Date(campaign.endDate) < new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)) return true;
    if (activeFilters?.includes('joined') && campaign?.isJoined) return true;
    
    // Category filters
    if (activeFilters?.includes('electronics') && ['iPhone', 'MacBook', 'AirPods', 'Samsung']?.some(term => campaign?.product?.name?.includes(term))) return true;
    if (activeFilters?.includes('fashion') && campaign?.product?.name?.includes('Nike')) return true;
    
    return false;
  });

  // Handle infinite scroll
  const handleScroll = useCallback(() => {
    if (window.innerHeight + document.documentElement?.scrollTop !== document.documentElement?.offsetHeight || loadingMore || !hasMore) {
      return;
    }
    
    setLoadingMore(true);
    // Simulate loading more campaigns
    setTimeout(() => {
      setPage(prev => prev + 1);
      setLoadingMore(false);
      // Simulate no more data after page 3
      if (page >= 2) {
        setHasMore(false);
      }
    }, 1000);
  }, [loadingMore, hasMore, page]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle campaign actions
  const handleJoinCampaign = (campaignId) => {
    setCampaigns(prev => prev?.map(campaign => 
      campaign?.id === campaignId 
        ? { ...campaign, isJoined: true, currentSupporters: campaign?.currentSupporters + 1 }
        : campaign
    ));
  };

  const handleLikeCampaign = (campaignId, isLiked) => {
    setCampaigns(prev => prev?.map(campaign => 
      campaign?.id === campaignId 
        ? { 
            ...campaign, 
            isLiked: isLiked, 
            likes: isLiked ? campaign?.likes + 1 : campaign?.likes - 1 
          }
        : campaign
    ));
  };

  const handleCommentCampaign = (campaignId, commentText) => {
    const newComment = {
      id: Date.now(),
      user: currentUser,
      text: commentText,
      timeAgo: "now"
    };

    setCampaigns(prev => prev?.map(campaign => 
      campaign?.id === campaignId 
        ? { ...campaign, comments: [...campaign?.comments, newComment] }
        : campaign
    ));
  };

  const handleShareCampaign = (campaignId) => {
    if (navigator.share) {
      navigator.share({
        title: 'Check out this campaign!',
        url: `${window.location?.origin}/campaign-details?id=${campaignId}`
      });
    } else {
      navigator.clipboard?.writeText(`${window.location?.origin}/campaign-details?id=${campaignId}`);
      // You could show a toast notification here
    }
  };

  const handleCreateCampaign = (campaignData) => {
    const newCampaign = {
      id: Date.now(),
      title: campaignData?.title,
      description: `New campaign for ${campaignData?.product?.name}`,
      creator: campaignData?.creator,
      product: campaignData?.product,
      currentSupporters: 1,
      targetSupporters: 100,
      discount: 15,
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)?.toISOString(),
      likes: 0,
      isLiked: false,
      isJoined: true,
      isTrending: false,
      comments: []
    };

    setCampaigns(prev => [newCampaign, ...prev]);
  };

  const handleFilterChange = (filterId) => {
    if (filterId === 'all') {
      setActiveFilters(['all']);
    } else {
      setActiveFilters(prev => {
        const newFilters = prev?.filter(f => f !== 'all');
        if (newFilters?.includes(filterId)) {
          const filtered = newFilters?.filter(f => f !== filterId);
          return filtered?.length === 0 ? ['all'] : filtered;
        } else {
          return [...newFilters, filterId];
        }
      });
    }
  };

  const handleJoinTrending = (campaignId) => {
    handleJoinCampaign(campaignId);
    setTrendingCampaigns(prev => prev?.map(campaign => 
      campaign?.id === campaignId 
        ? { ...campaign, isJoined: true, currentSupporters: campaign?.currentSupporters + 1 }
        : campaign
    ));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Compose Area */}
          <ComposeArea 
            user={currentUser} 
            onCreateCampaign={handleCreateCampaign}
          />

          {/* Trending Section */}
          <TrendingSection 
            trendingCampaigns={trendingCampaigns}
            onJoinTrending={handleJoinTrending}
          />

          {/* Filter Bar */}
          <FilterBar 
            onFilterChange={handleFilterChange}
            activeFilters={activeFilters}
          />

          {/* Campaign Feed */}
          <div className="space-y-6">
            {loading ? (
              // Loading skeletons
              (Array.from({ length: 3 })?.map((_, index) => (
                <SkeletonCard key={index} />
              )))
            ) : filteredCampaigns?.length === 0 ? (
              // Empty state
              (<div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Search" size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No campaigns found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or create a new campaign
                </p>
                <Button
                  variant="default"
                  onClick={() => navigate('/create-campaign')}
                  iconName="Plus"
                  iconPosition="left"
                >
                  Create Campaign
                </Button>
              </div>)
            ) : (
              // Campaign cards
              (filteredCampaigns?.map((campaign) => (
                <CampaignCard
                  key={campaign?.id}
                  campaign={campaign}
                  onJoin={handleJoinCampaign}
                  onLike={handleLikeCampaign}
                  onComment={handleCommentCampaign}
                  onShare={handleShareCampaign}
                />
              )))
            )}

            {/* Loading more indicator */}
            {loadingMore && (
              <div className="flex justify-center py-6">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span>Loading more campaigns...</span>
                </div>
              </div>
            )}

            {/* End of feed indicator */}
            {!hasMore && !loading && filteredCampaigns?.length > 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="CheckCircle" size={20} className="text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">You're all caught up!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Check back later for new campaigns
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TimelineFeed;