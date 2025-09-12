import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProductGallery from './components/ProductGallery';
import CampaignHeader from './components/CampaignHeader';
import CampaignProgress from './components/CampaignProgress';
import CommentSection from './components/CommentSection';
import CampaignUpdates from './components/CampaignUpdates';
import RelatedCampaigns from './components/RelatedCampaigns';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [campaign, setCampaign] = useState(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock campaign data
  const mockCampaign = {
    id: "1",
    title: "Premium Wireless Headphones - Group Buy Campaign",
    description: `Experience crystal-clear audio with these premium wireless headphones featuring active noise cancellation, 30-hour battery life, and premium comfort design.\n\nJoin our group buying campaign to unlock exclusive discounts! The more supporters we get, the bigger the savings for everyone. These headphones normally retail for $299, but through our community-driven approach, we can secure significant discounts for all participants.\n\nFeatures include:\n• Active Noise Cancellation technology\n• 30-hour battery life with quick charge\n• Premium leather ear cushions\n• Bluetooth 5.0 connectivity\n• Built-in voice assistant support`,
    creator: {
      name: "TechDeals Pro",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      verified: true
    },
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop",
      "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop"
    ],
    currentSupporters: 847,
    targetSupporters: 1000,
    likes: 234,
    createdAt: "2025-01-05T10:30:00Z",
    endDate: "2025-01-20T23:59:59Z",
    tags: ["electronics", "audio", "wireless", "premium"],
    tiers: [
      { threshold: 100, discount: 10 },
      { threshold: 500, discount: 20 },
      { threshold: 1000, discount: 30 }
    ],
    recentSupporters: [
      {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      },
      {
        name: "Mike Chen",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      },
      {
        name: "Emily Davis",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      },
      {
        name: "Alex Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      },
      {
        name: "Lisa Wang",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
      }
    ]
  };

  const mockComments = [
    {
      id: 1,
      user: {
        name: "Sarah Johnson",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
        verified: true
      },
      content: "These headphones look amazing! I\'ve been looking for a good pair with ANC. The group discount makes it even better. Count me in!",
      timestamp: new Date(Date.now() - 1800000),
      likes: 12,
      replies: [
        {
          id: 11,
          user: {
            name: "Mike Chen",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            verified: false
          },
          content: "Same here! The 30-hour battery life is exactly what I need for long flights.",
          timestamp: new Date(Date.now() - 1500000),
          likes: 5
        }
      ]
    },
    {
      id: 2,
      user: {
        name: "Alex Rodriguez",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        verified: false
      },
      content: "Just joined! We\'re so close to the 1000 supporter target. Can\'t wait to get that 30% discount!",
      timestamp: new Date(Date.now() - 3600000),
      likes: 8,
      replies: []
    },
    {
      id: 3,
      user: {
        name: "Emily Davis",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
        verified: true
      },
      content: "I have the previous model and it\'s fantastic. This new version with improved ANC is definitely worth it. Great campaign!",
      timestamp: new Date(Date.now() - 7200000),
      likes: 15,
      replies: []
    }
  ];

  const mockUpdates = [
    {
      id: 1,
      type: "milestone",
      title: "800 Supporters Reached!",
      content: "Amazing news! We\'ve reached 800 supporters and unlocked the 20% discount tier. Only 200 more supporters needed to unlock the maximum 30% discount!",
      timestamp: new Date(Date.now() - 3600000),
      stats: {
        supporters: 800,
        progress: 80,
        timeLeft: "5 days left"
      }
    },
    {
      id: 2,
      type: "announcement",
      title: "Product Demo Video Available",
      content: "Check out our detailed product demonstration video showing all the features and sound quality tests. Link available in the campaign description.",
      timestamp: new Date(Date.now() - 86400000),
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=300&fit=crop"
    },
    {
      id: 3,
      type: "product",
      title: "Color Options Confirmed",
      content: "We've confirmed that all three color variants (Black, White, and Rose Gold) will be available for campaign participants. You'll be able to choose your preferred color when the campaign completes.",
      timestamp: new Date(Date.now() - 172800000),
      stats: {
        supporters: 650,
        progress: 65
      }
    }
  ];

  const mockRelatedCampaigns = [
    {
      id: "2",
      title: "Smart Fitness Watch - Community Discount",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
      creator: {
        name: "FitTech Deals",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
        verified: true
      },
      currentSupporters: 432,
      targetSupporters: 500,
      timeLeft: "3d 12h",
      maxDiscount: 25,
      isHot: true
    },
    {
      id: "3",
      title: "Wireless Charging Pad Bundle",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
      creator: {
        name: "ChargeTech Pro",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
        verified: false
      },
      currentSupporters: 89,
      targetSupporters: 200,
      timeLeft: "8d 5h",
      maxDiscount: 15,
      isNew: true
    },
    {
      id: "4",
      title: "Premium Bluetooth Speaker Set",
      image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
      creator: {
        name: "AudioDeals Hub",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
        verified: true
      },
      currentSupporters: 756,
      targetSupporters: 800,
      timeLeft: "2d 18h",
      maxDiscount: 35
    }
  ];

  useEffect(() => {
    // Simulate loading campaign data
    const loadCampaign = async () => {
      setLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCampaign(mockCampaign);
      setLoading(false);
    };

    loadCampaign();

    // Check if user has joined (simulate from localStorage or API)
    const joinedCampaigns = JSON.parse(localStorage.getItem('joinedCampaigns') || '[]');
    setHasJoined(joinedCampaigns?.includes(id));

    // Check if user has liked (simulate from localStorage or API)
    const likedCampaigns = JSON.parse(localStorage.getItem('likedCampaigns') || '[]');
    setIsLiked(likedCampaigns?.includes(id));
  }, [id]);

  const handleJoinCampaign = () => {
    if (!hasJoined) {
      setHasJoined(true);
      setCampaign(prev => ({
        ...prev,
        currentSupporters: prev?.currentSupporters + 1
      }));

      // Save to localStorage
      const joinedCampaigns = JSON.parse(localStorage.getItem('joinedCampaigns') || '[]');
      joinedCampaigns?.push(id);
      localStorage.setItem('joinedCampaigns', JSON.stringify(joinedCampaigns));
    }
  };

  const handleLikeCampaign = () => {
    setIsLiked(!isLiked);
    setCampaign(prev => ({
      ...prev,
      likes: isLiked ? prev?.likes - 1 : prev?.likes + 1
    }));

    // Save to localStorage
    const likedCampaigns = JSON.parse(localStorage.getItem('likedCampaigns') || '[]');
    if (isLiked) {
      const index = likedCampaigns?.indexOf(id);
      if (index > -1) likedCampaigns?.splice(index, 1);
    } else {
      likedCampaigns?.push(id);
    }
    localStorage.setItem('likedCampaigns', JSON.stringify(likedCampaigns));
  };

  const handleShareCampaign = () => {
    if (navigator.share) {
      navigator.share({
        title: campaign?.title,
        text: campaign?.description?.substring(0, 100) + '...',
        url: window.location?.href
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard?.writeText(window.location?.href);
      // You could show a toast notification here
    }
  };

  const handleAddComment = (comment) => {
    // Handle comment addition (would typically sync with backend)
    console.log('New comment added:', comment);
  };

  const handleRelatedCampaignClick = (campaignId) => {
    navigate(`/campaign-details/${campaignId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="bg-muted rounded-lg h-96"></div>
                  <div className="bg-muted rounded-lg h-48"></div>
                </div>
                <div className="space-y-6">
                  <div className="bg-muted rounded-lg h-64"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-foreground mb-4">Campaign Not Found</h1>
              <p className="text-muted-foreground mb-6">The campaign you're looking for doesn't exist or has been removed.</p>
              <button
                onClick={() => navigate('/timeline-feed')}
                className="text-primary hover:underline"
              >
                Return to Timeline
              </button>
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
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Gallery */}
              <ProductGallery 
                images={campaign?.images} 
                productName={campaign?.title}
              />

              {/* Campaign Header */}
              <CampaignHeader
                campaign={campaign}
                onShare={handleShareCampaign}
                onLike={handleLikeCampaign}
                isLiked={isLiked}
              />

              {/* Campaign Updates */}
              <CampaignUpdates updates={mockUpdates} />

              {/* Comments Section */}
              <CommentSection
                initialComments={mockComments}
                onAddComment={handleAddComment}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Campaign Progress */}
              <CampaignProgress
                campaign={campaign}
                onJoinCampaign={handleJoinCampaign}
                hasJoined={hasJoined}
              />
            </div>
          </div>

          {/* Related Campaigns */}
          <div className="mt-12">
            <RelatedCampaigns
              campaigns={mockRelatedCampaigns}
              onCampaignClick={handleRelatedCampaignClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;