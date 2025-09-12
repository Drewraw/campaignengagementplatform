import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ user, onEditProfile }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      {/* Cover Image */}
      <div className="relative h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-lg mb-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
      </div>
      {/* Profile Info */}
      <div className="relative -mt-16 mb-4">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="relative">
              <Image
                src={user?.avatar}
                alt={user?.name}
                className="w-24 h-24 rounded-full border-4 border-card shadow-medium object-cover"
              />
              {user?.isVerified && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Icon name="Check" size={14} color="white" />
                </div>
              )}
            </div>
            <div className="pb-2">
              <h1 className="text-2xl font-bold text-foreground">{user?.name}</h1>
              <p className="text-muted-foreground">@{user?.username}</p>
              <div className="flex items-center gap-2 mt-1">
                <Icon name="Calendar" size={14} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Joined {user?.joinDate}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {user?.isOwnProfile ? (
              <Button variant="outline" onClick={onEditProfile} iconName="Edit" iconPosition="left">
                Edit Profile
              </Button>
            ) : (
              <>
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  onClick={handleFollowToggle}
                  iconName={isFollowing ? "UserMinus" : "UserPlus"}
                  iconPosition="left"
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button variant="ghost" iconName="MessageCircle">
                  Message
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Bio */}
      {user?.bio && (
        <div className="mb-4">
          <p className="text-foreground leading-relaxed">{user?.bio}</p>
        </div>
      )}
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{user?.stats?.campaignsCreated}</div>
          <div className="text-sm text-muted-foreground">Campaigns Created</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{user?.stats?.campaignsJoined}</div>
          <div className="text-sm text-muted-foreground">Campaigns Joined</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{user?.stats?.totalSavings}</div>
          <div className="text-sm text-muted-foreground">Total Savings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{user?.stats?.communityImpact}</div>
          <div className="text-sm text-muted-foreground">Community Impact</div>
        </div>
      </div>
      {/* Achievement Badges */}
      {user?.achievements && user?.achievements?.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border">
          <h3 className="text-sm font-semibold text-foreground mb-2">Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {user?.achievements?.map((achievement) => (
              <div
                key={achievement?.id}
                className="flex items-center gap-1 px-2 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium"
                title={achievement?.description}
              >
                <Icon name={achievement?.icon} size={12} />
                <span>{achievement?.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileHeader;