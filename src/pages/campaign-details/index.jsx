import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProductGallery from './components/ProductGallery';
import CampaignHeader from './components/CampaignHeader';
import CampaignProgress from './components/CampaignProgress';
import CommentSection from './components/CommentSection';
import CampaignUpdates from './components/CampaignUpdates';
import RelatedCampaigns from './components/RelatedCampaigns';
import axios from 'axios';

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const loadCampaign = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/getCampaignDetails?id=${id}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCampaign();

    const joinedCampaigns = JSON.parse(localStorage.getItem('joinedCampaigns') || '[]');
    setHasJoined(joinedCampaigns.includes(id));

    const likedCampaigns = JSON.parse(localStorage.getItem('likedCampaigns') || '[]');
    setIsLiked(likedCampaigns.includes(id));
  }, [id]);

  const handleJoinCampaign = () => {
    if (!hasJoined) {
      setHasJoined(true);
      setData(prev => ({
        ...prev,
        campaign: {
          ...prev.campaign,
          currentSupporters: prev.campaign.currentSupporters + 1
        }
      }));

      const joinedCampaigns = JSON.parse(localStorage.getItem('joinedCampaigns') || '[]');
      joinedCampaigns.push(id);
      localStorage.setItem('joinedCampaigns', JSON.stringify(joinedCampaigns));
    }
  };

  const handleLikeCampaign = () => {
    setIsLiked(!isLiked);
    setData(prev => ({
      ...prev,
      campaign: {
        ...prev.campaign,
        likes: isLiked ? prev.campaign.likes - 1 : prev.campaign.likes + 1
      }
    }));

    const likedCampaigns = JSON.parse(localStorage.getItem('likedCampaigns') || '[]');
    if (isLiked) {
      const index = likedCampaigns.indexOf(id);
      if (index > -1) likedCampaigns.splice(index, 1);
    } else {
      likedCampaigns.push(id);
    }
    localStorage.setItem('likedCampaigns', JSON.stringify(likedCampaigns));
  };

  const handleShareCampaign = () => {
    if (navigator.share) {
      navigator.share({
        title: data.campaign.title,
        text: data.campaign.description.substring(0, 100) + '...',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleAddComment = (comment) => {
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

  if (!data) {
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
            <div className="lg:col-span-2 space-y-6">
              <ProductGallery 
                images={data.campaign.images} 
                productName={data.campaign.title}
              />

              <CampaignHeader
                campaign={data.campaign}
                onShare={handleShareCampaign}
                onLike={handleLikeCampaign}
                isLiked={isLiked}
              />

              <CampaignUpdates updates={data.updates} />

              <CommentSection
                initialComments={data.comments}
                onAddComment={handleAddComment}
              />
            </div>

            <div className="space-y-6">
              <CampaignProgress
                campaign={data.campaign}
                onJoinCampaign={handleJoinCampaign}
                hasJoined={hasJoined}
              />
            </div>
          </div>

          <div className="mt-12">
            <RelatedCampaigns
              campaigns={data.relatedCampaigns}
              onCampaignClick={handleRelatedCampaignClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetails;
