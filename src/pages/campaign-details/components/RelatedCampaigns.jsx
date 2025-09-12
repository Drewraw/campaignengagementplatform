import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RelatedCampaigns = ({ campaigns, onCampaignClick }) => {
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US')?.format(num);
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
  };

  const CampaignCard = ({ campaign }) => (
    <div 
      className="bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-medium transition-smooth cursor-pointer hover-scale"
      onClick={() => onCampaignClick(campaign?.id)}
    >
      {/* Campaign Image */}
      <div className="relative aspect-video bg-muted">
        <Image
          src={campaign?.image}
          alt={campaign?.title}
          className="w-full h-full object-cover"
        />
        {campaign?.isHot && (
          <div className="absolute top-2 left-2 bg-error text-error-foreground px-2 py-1 rounded text-xs font-medium">
            🔥 Hot
          </div>
        )}
        {campaign?.isNew && (
          <div className="absolute top-2 right-2 bg-success text-success-foreground px-2 py-1 rounded text-xs font-medium">
            New
          </div>
        )}
      </div>

      {/* Campaign Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
          {campaign?.title}
        </h3>

        {/* Creator */}
        <div className="flex items-center space-x-2 mb-3">
          <Image
            src={campaign?.creator?.avatar}
            alt={campaign?.creator?.name}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-muted-foreground">{campaign?.creator?.name}</span>
          {campaign?.creator?.verified && (
            <Icon name="BadgeCheck" size={14} className="text-primary" />
          )}
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium text-foreground">
              {Math.round(calculateProgress(campaign?.currentSupporters, campaign?.targetSupporters))}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="h-2 bg-primary rounded-full transition-all duration-300"
              style={{ 
                width: `${calculateProgress(campaign?.currentSupporters, campaign?.targetSupporters)}%` 
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="Users" size={14} />
            <span>{formatNumber(campaign?.currentSupporters)}</span>
          </div>
          <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon name="Clock" size={14} />
            <span>{campaign?.timeLeft}</span>
          </div>
        </div>

        {/* Discount Badge */}
        {campaign?.maxDiscount && (
          <div className="mt-3 text-center">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Up to {campaign?.maxDiscount}% OFF
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-lg p-6 shadow-soft">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Related Campaigns
        </h2>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns?.map((campaign) => (
          <CampaignCard key={campaign?.id} campaign={campaign} />
        ))}
      </div>
      {campaigns?.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No related campaigns found.</p>
        </div>
      )}
    </div>
  );
};

export default RelatedCampaigns;