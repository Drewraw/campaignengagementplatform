import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CampaignCard = ({ campaign, onJoin, onLike, onComment, onShare }) => {
  const [isJoined, setIsJoined] = useState(campaign?.isJoined || false);
  const [isLiked, setIsLiked] = useState(campaign?.isLiked || false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const navigate = useNavigate();

  const handleJoin = () => {
    if (!isJoined) {
      setIsJoined(true);
      onJoin(campaign?.id);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike(campaign?.id, !isLiked);
  };

  const handleComment = () => {
    if (commentText?.trim()) {
      onComment(campaign?.id, commentText);
      setCommentText('');
    }
  };

  const handleInterestedClick = () => {
    setCommentText('Interested!');
    onComment(campaign?.id, 'Interested!');
    setCommentText('');
    if (!isJoined) {
      setIsJoined(true);
      onJoin(campaign?.id);
    }
  };

  const getTierInfo = () => {
    if (!campaign?.tiers || campaign?.tiers?.length === 0) {
      return {
        currentTier: null,
        nextTier: null,
        isAchieved: false,
        progress: 0
      };
    }

    // Sort tiers by required users (ascending)
    const sortedTiers = [...campaign?.tiers]?.sort((a, b) => a?.requiredUsers - b?.requiredUsers);
    const currentSupporters = campaign?.currentSupporters || 0;

    // Find the highest achieved tier
    let currentTier = null;
    let nextTier = null;
    
    for (let i = 0; i < sortedTiers?.length; i++) {
      if (currentSupporters >= sortedTiers?.[i]?.requiredUsers) {
        currentTier = sortedTiers?.[i];
      } else {
        nextTier = sortedTiers?.[i];
        break;
      }
    }

    // If no tier achieved, next tier is the first one
    if (!currentTier) {
      nextTier = sortedTiers?.[0];
    }

    const targetUsers = nextTier?.requiredUsers || currentTier?.requiredUsers || 0;
    const progress = Math.min((currentSupporters / targetUsers) * 100, 100);

    return {
      currentTier,
      nextTier,
      isAchieved: !!currentTier,
      progress,
      allTiers: sortedTiers
    };
  };

  const tierInfo = getTierInfo();
  const progressPercentage = campaign?.tiers ? tierInfo?.progress : 
    Math.min((campaign?.currentSupporters / campaign?.targetSupporters) * 100, 100);
  const isCompleted = campaign?.tiers ? 
    tierInfo?.currentTier && !tierInfo?.nextTier : 
    campaign?.currentSupporters >= campaign?.targetSupporters;
  const isExpired = new Date(campaign.endDate) < new Date();

  const getStatusBadge = () => {
    if (isCompleted) {
      return (
        <div className="flex items-center space-x-1 bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-medium">
          <Icon name="CheckCircle" size={12} />
          <span>Completed</span>
        </div>
      );
    }
    if (isExpired) {
      return (
        <div className="flex items-center space-x-1 bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs font-medium">
          <Icon name="Clock" size={12} />
          <span>Expired</span>
        </div>
      );
    }
    if (campaign?.isTrending) {
      return (
        <div className="flex items-center space-x-1 bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs font-medium">
          <Icon name="Flame" size={12} />
          <span>Trending</span>
        </div>
      );
    }
    return null;
  };

  const formatTimeRemaining = () => {
    const now = new Date();
    const end = new Date(campaign.endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Expired';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h left`;
    return `${hours}h left`;
  };

  const renderTierProgress = () => {
    if (!campaign?.tiers) return null;

    const { currentTier, nextTier, allTiers } = tierInfo;
    const currentSupporters = campaign?.currentSupporters || 0;

    return (
      <div className="space-y-3">
        {/* Tier milestones */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-muted-foreground">Campaign Tiers</span>
            <span className="text-foreground">{currentSupporters} supporters joined</span>
          </div>
          
          <div className="space-y-2">
            {allTiers?.map((tier, index) => {
              const isAchieved = currentSupporters >= tier?.requiredUsers;
              const isActive = nextTier?.requiredUsers === tier?.requiredUsers;
              
              return (
                <div key={tier?.requiredUsers} className={`flex items-center justify-between p-2 rounded-lg border ${
                  isAchieved ? 'bg-success/10 border-success/30' : isActive ?'bg-primary/10 border-primary/30': 'bg-muted/50 border-border'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      isAchieved ? 'bg-success text-success-foreground' : 
                      isActive ? 'bg-primary text-primary-foreground': 'bg-muted text-muted-foreground'
                    }`}>
                      {isAchieved ? (
                        <Icon name="Check" size={10} />
                      ) : (
                        <span className="text-xs font-bold">{index + 1}</span>
                      )}
                    </div>
                    <span className={`text-sm font-medium ${
                      isAchieved ? 'text-success' : isActive ?'text-primary': 'text-muted-foreground'
                    }`}>
                      🎯 {tier?.requiredUsers} users
                    </span>
                  </div>
                  <span className={`text-sm font-bold ${
                    isAchieved ? 'text-success' : isActive ?'text-primary': 'text-muted-foreground'
                  }`}>
                    {tier?.discount}% OFF
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Progress bar for next tier */}
        {nextTier && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Progress to next tier ({nextTier?.discount}% OFF)
              </span>
              <span className="text-foreground font-medium">
                {currentSupporters}/{nextTier?.requiredUsers}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div 
                className="h-2 rounded-full bg-primary transition-all duration-500"
                style={{ width: `${Math.min((currentSupporters / nextTier?.requiredUsers) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
        {/* Current achievement status */}
        {currentTier && (
          <div className="flex items-center space-x-2 p-2 bg-success/10 border border-success/30 rounded-lg">
            <Icon name="Trophy" size={16} className="text-success" />
            <span className="text-sm font-medium text-success">
              🎉 Tier {allTiers?.findIndex(t => t?.requiredUsers === currentTier?.requiredUsers) + 1} Unlocked: {currentTier?.discount}% OFF!
            </span>
          </div>
        )}
      </div>
    );
  };

  const handleCardClick = (e) => {
    if (e?.target?.closest('button') || e?.target?.closest('.action-area')) return;
    navigate(`/campaign-details?id=${campaign?.id}`);
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-soft hover:shadow-medium transition-smooth cursor-pointer">
      <div onClick={handleCardClick}>
        {/* Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full overflow-hidden">
                <Image 
                  src={campaign?.creator?.avatar} 
                  alt={campaign?.creator?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium text-foreground">{campaign?.creator?.name}</h4>
                <p className="text-sm text-muted-foreground">@{campaign?.creator?.username}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge()}
              <span className="text-sm text-muted-foreground">{formatTimeRemaining()}</span>
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
            {campaign?.title}
          </h3>
          
          <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
            {campaign?.description}
          </p>
        </div>

        {/* Product Image */}
        <div className="px-4 mb-4">
          <div className="aspect-video bg-muted rounded-lg overflow-hidden">
            <Image 
              src={campaign?.product?.image} 
              alt={campaign?.product?.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Progress Section - Enhanced for Tiers */}
        <div className="px-4 mb-4">
          {campaign?.tiers ? (
            renderTierProgress()
          ) : (
            // Keep existing progress display for non-tier campaigns
            (<>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  {campaign?.currentSupporters?.toLocaleString()} of {campaign?.targetSupporters?.toLocaleString()} supporters
                </span>
                <span className="text-sm text-muted-foreground">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 mb-3">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isCompleted ? 'bg-success' : 'bg-primary'
                  }`}
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="text-muted-foreground">
                    Target: <span className="font-medium text-foreground">${campaign?.product?.price}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Discount: <span className="font-medium text-success">{campaign?.discount}%</span>
                  </span>
                </div>
              </div>
            </>)
          )}
        </div>
      </div>
      {/* Actions */}
      <div className="px-4 pb-4 action-area">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {/* Enhanced Join/Interested Button */}
            {campaign?.tiers ? (
              <Button
                variant={isJoined ? "default" : "outline"}
                size="sm"
                onClick={handleInterestedClick}
                disabled={isJoined || isCompleted || isExpired}
                iconName={isJoined ? "Check" : "ThumbsUp"}
                iconPosition="left"
                className="min-w-[120px]"
              >
                {isJoined ? 'Interested!' : 'Join Campaign'}
              </Button>
            ) : (
              <Button
                variant={isJoined ? "default" : "outline"}
                size="sm"
                onClick={handleJoin}
                disabled={isJoined || isCompleted || isExpired}
                iconName={isJoined ? "Check" : "Plus"}
                iconPosition="left"
                className="min-w-[100px]"
              >
                {isJoined ? 'Joined' : 'Join'}
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              iconName={isLiked ? "Heart" : "Heart"}
              className={isLiked ? "text-error" : ""}
            >
              {campaign?.likes + (isLiked && !campaign?.isLiked ? 1 : 0)}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              iconName="MessageCircle"
            >
              {campaign?.comments?.length}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onShare(campaign?.id)}
              iconName="Share"
            >
              Share
            </Button>
          </div>
        </div>

        {/* Comments Section - Enhanced for Campaigns */}
        {showComments && (
          <div className="border-t border-border pt-3 mt-3">
            <div className="space-y-3 mb-3 max-h-40 overflow-y-auto">
              {campaign?.comments?.slice(0, 5)?.map((comment) => (
                <div key={comment?.id} className={`flex items-start space-x-2 ${
                  comment?.isSystemMessage ? 'bg-primary/5 p-2 rounded-lg border border-primary/20' : ''
                }`}>
                  <div className="w-6 h-6 bg-muted rounded-full overflow-hidden flex-shrink-0">
                    {comment?.isSystemMessage ? (
                      <div className="w-full h-full bg-primary rounded-full flex items-center justify-center">
                        <Icon name="Megaphone" size={12} className="text-primary-foreground" />
                      </div>
                    ) : (
                      <Image 
                        src={comment?.user?.avatar} 
                        alt={comment?.user?.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${
                        comment?.isSystemMessage ? 'text-primary' : 'text-foreground'
                      }`}>
                        {comment?.isSystemMessage ? `${campaign?.creator?.name} POC` : comment?.user?.name}
                        {comment?.isSystemMessage && (
                          <Icon name="BadgeCheck" size={12} className="inline ml-1 text-primary" />
                        )}
                      </span>
                      <span className="text-xs text-muted-foreground">{comment?.timeAgo}</span>
                    </div>
                    <p className={`text-sm ${
                      comment?.isSystemMessage ? 'text-primary font-medium' : 'text-muted-foreground'
                    }`}>
                      {comment?.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              {/* Quick Interested Button for Tier Campaigns */}
              {campaign?.tiers && !isJoined && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleInterestedClick}
                  disabled={isCompleted || isExpired}
                  iconName="ThumbsUp"
                  iconPosition="left"
                  className="w-full"
                >
                  Comment "Interested!" to join
                </Button>
              )}
              
              {/* Regular Comment Input */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e?.target?.value)}
                  placeholder={campaign?.tiers ? 'Comment "Interested!" or add your message...' : 'Add a comment...'}
                  className="flex-1 px-3 py-2 bg-input border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  onKeyPress={(e) => e?.key === 'Enter' && handleComment()}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleComment}
                  disabled={!commentText?.trim()}
                  iconName="Send"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCard;