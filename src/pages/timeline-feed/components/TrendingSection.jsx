import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const TrendingSection = ({ trendingCampaigns, onJoinTrending }) => {
  const navigate = useNavigate();

  const handleCampaignClick = (campaignId) => {
    navigate(`/campaign-details?id=${campaignId}`);
  };

  if (!trendingCampaigns || trendingCampaigns?.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft mb-6">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="TrendingUp" size={20} className="text-warning" />
          <h3 className="text-lg font-semibold text-foreground">Trending Now</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Popular campaigns gaining momentum
        </p>
      </div>
      <div className="p-4">
        <div className="space-y-4">
          {trendingCampaigns?.slice(0, 3)?.map((campaign, index) => {
            const progressPercentage = Math.min((campaign?.currentSupporters / campaign?.targetSupporters) * 100, 100);
            
            return (
              <div 
                key={campaign?.id} 
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-smooth cursor-pointer"
                onClick={() => handleCampaignClick(campaign?.id)}
              >
                <div className="flex items-center justify-center w-6 h-6 bg-warning text-warning-foreground rounded-full text-xs font-bold">
                  {index + 1}
                </div>
                <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                  <Image 
                    src={campaign?.product?.image} 
                    alt={campaign?.product?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">{campaign?.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <div className="flex items-center space-x-1">
                      <Icon name="Users" size={12} className="text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {campaign?.currentSupporters?.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="Flame" size={12} className="text-warning" />
                      <span className="text-xs text-warning font-medium">
                        {Math.round(progressPercentage)}%
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-muted rounded-full h-1 mt-2">
                    <div 
                      className="h-1 bg-warning rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
                <div className="flex-shrink-0" onClick={(e) => e?.stopPropagation()}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onJoinTrending(campaign?.id)}
                    disabled={campaign?.isJoined}
                    iconName={campaign?.isJoined ? "Check" : "Plus"}
                    className="min-w-[70px]"
                  >
                    {campaign?.isJoined ? 'Joined' : 'Join'}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/campaign-details?trending=true')}
            iconName="ArrowRight"
            iconPosition="right"
            fullWidth
          >
            View All Trending Campaigns
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TrendingSection;