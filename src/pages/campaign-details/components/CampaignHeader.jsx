import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CampaignHeader = ({ campaign, onShare, onLike, isLiked }) => {
  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })?.format(new Date(date));
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-soft">
      {/* Campaign Title */}
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
        {campaign?.title}
      </h1>
      {/* Creator Info */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Image
              src={campaign?.creator?.avatar}
              alt={campaign?.creator?.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            {campaign?.creator?.verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                <Icon name="Check" size={12} color="white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-foreground">{campaign?.creator?.name}</h3>
              {campaign?.creator?.verified && (
                <Icon name="BadgeCheck" size={16} className="text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Created on {formatDate(campaign?.createdAt)}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant={isLiked ? "default" : "outline"}
            size="sm"
            onClick={onLike}
            iconName="Heart"
            iconPosition="left"
            iconSize={16}
          >
            {campaign?.likes}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onShare}
            iconName="Share"
            iconSize={16}
          />
        </div>
      </div>
      {/* Product Description */}
      <div className="prose prose-sm max-w-none">
        <p className="text-foreground leading-relaxed">
          {campaign?.description}
        </p>
      </div>
      {/* Campaign Tags */}
      {campaign?.tags && campaign?.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {campaign?.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-muted text-muted-foreground text-sm rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignHeader;