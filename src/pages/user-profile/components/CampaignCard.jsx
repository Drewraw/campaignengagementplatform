import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CampaignCard = ({ campaign, type = 'active' }) => {
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-primary bg-primary/10';
      case 'completed':
        return 'text-success bg-success/10';
      case 'expired':
        return 'text-muted-foreground bg-muted';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getProgressPercentage = () => {
    return Math.min((campaign?.currentSupporters / campaign?.targetSupporters) * 100, 100);
  };

  const handleViewCampaign = () => {
    navigate(`/campaign-details?id=${campaign?.id}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-medium transition-smooth">
      {/* Campaign Image */}
      <div className="relative mb-3 overflow-hidden rounded-lg">
        <Image
          src={campaign?.image}
          alt={campaign?.title}
          className="w-full h-32 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign?.status)}`}>
            {campaign?.status?.charAt(0)?.toUpperCase() + campaign?.status?.slice(1)}
          </span>
        </div>
      </div>
      {/* Campaign Info */}
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
            {campaign?.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {campaign?.description}
          </p>
        </div>

        {/* Progress Bar */}
        {campaign?.status === 'active' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">
                {campaign?.currentSupporters}/{campaign?.targetSupporters}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
          </div>
        )}

        {/* Campaign Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Icon name="Users" size={14} />
              <span>{campaign?.currentSupporters}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Icon name="Clock" size={14} />
              <span>{campaign?.timeLeft}</span>
            </div>
          </div>
          {campaign?.discount && (
            <div className="text-success font-medium">
              {campaign?.discount}% OFF
            </div>
          )}
        </div>

        {/* Rewards/Savings */}
        {type === 'completed' && campaign?.savings && (
          <div className="flex items-center justify-between p-2 bg-success/10 rounded-lg">
            <div className="flex items-center gap-2">
              <Icon name="DollarSign" size={16} className="text-success" />
              <span className="text-sm font-medium text-success">
                Saved ${campaign?.savings}
              </span>
            </div>
            {campaign?.couponUsed && (
              <div className="flex items-center gap-1 text-xs text-success">
                <Icon name="Ticket" size={12} />
                <span>Coupon Used</span>
              </div>
            )}
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewCampaign}
            iconName="ExternalLink"
            iconPosition="right"
            fullWidth
          >
            View Campaign
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;