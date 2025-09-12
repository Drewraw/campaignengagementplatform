import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';


const CampaignProgress = ({ campaign, onJoinCampaign, hasJoined }) => {
  const [timeLeft, setTimeLeft] = useState('');

  const progressPercentage = Math.min((campaign?.currentSupporters / campaign?.targetSupporters) * 100, 100);
  const isCompleted = campaign?.currentSupporters >= campaign?.targetSupporters;

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()?.getTime();
      const endTime = new Date(campaign.endDate)?.getTime();
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h left`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m left`);
        } else {
          setTimeLeft(`${minutes}m left`);
        }
      } else {
        setTimeLeft('Campaign ended');
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000);

    return () => clearInterval(interval);
  }, [campaign?.endDate]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US')?.format(num);
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-soft">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-foreground">Campaign Progress</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Icon name="Clock" size={16} />
          <span>{timeLeft}</span>
        </div>
      </div>
      {/* Progress Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(campaign?.currentSupporters)}
          </div>
          <div className="text-sm text-muted-foreground">Current Supporters</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">
            {formatNumber(campaign?.targetSupporters)}
          </div>
          <div className="text-sm text-muted-foreground">Target Supporters</div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Progress</span>
          <span className="text-sm font-medium text-foreground">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              isCompleted ? 'bg-success' : 'bg-primary'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      {/* Tier Information */}
      <div className="mb-6">
        <h3 className="font-semibold text-foreground mb-3">Reward Tiers</h3>
        <div className="space-y-2">
          {campaign?.tiers?.map((tier, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border ${
                campaign?.currentSupporters >= tier?.threshold
                  ? 'border-success bg-success/10' :'border-border bg-muted/50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  campaign?.currentSupporters >= tier?.threshold
                    ? 'bg-success' :'bg-muted-foreground'
                }`} />
                <span className="font-medium text-foreground">
                  {formatNumber(tier?.threshold)} supporters
                </span>
              </div>
              <span className="text-sm font-semibold text-primary">
                {tier?.discount}% OFF
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Join Campaign Button */}
      <div className="space-y-3">
        {hasJoined ? (
          <div className="flex items-center justify-center space-x-2 p-3 bg-success/10 border border-success rounded-lg">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <span className="font-medium text-success">You've joined this campaign!</span>
          </div>
        ) : (
          <Button
            variant="default"
            size="lg"
            fullWidth
            onClick={onJoinCampaign}
            iconName="Users"
            iconPosition="left"
            disabled={timeLeft === 'Campaign ended'}
          >
            Join Campaign
          </Button>
        )}

        {/* Supporter Avatars */}
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            {campaign?.recentSupporters?.slice(0, 5)?.map((supporter, index) => (
              <Image
                key={index}
                src={supporter?.avatar}
                alt={supporter?.name}
                className="w-8 h-8 rounded-full border-2 border-background object-cover"
              />
            ))}
            {campaign?.currentSupporters > 5 && (
              <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                <span className="text-xs font-medium text-muted-foreground">
                  +{campaign?.currentSupporters - 5}
                </span>
              </div>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {campaign?.currentSupporters > 0 && `${campaign?.recentSupporters?.[0]?.name} and ${campaign?.currentSupporters - 1} others joined`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CampaignProgress;