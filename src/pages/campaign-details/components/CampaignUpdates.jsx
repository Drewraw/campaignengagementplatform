import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const CampaignUpdates = ({ updates }) => {
  const formatTimeAgo = (date) => {
    const now = new Date();
    const updateDate = new Date(date);
    const diffInMinutes = Math.floor((now - updateDate) / (1000 * 60));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'milestone':
        return 'Target';
      case 'announcement':
        return 'Megaphone';
      case 'product':
        return 'Package';
      default:
        return 'Info';
    }
  };

  const getUpdateColor = (type) => {
    switch (type) {
      case 'milestone':
        return 'text-success';
      case 'announcement':
        return 'text-primary';
      case 'product':
        return 'text-warning';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 shadow-soft">
      <h2 className="text-xl font-semibold text-foreground mb-6">
        Campaign Updates ({updates?.length})
      </h2>
      <div className="space-y-6">
        {updates?.map((update, index) => (
          <div key={update?.id} className="relative">
            {/* Timeline Line */}
            {index < updates?.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-border" />
            )}
            
            <div className="flex space-x-4">
              {/* Update Icon */}
              <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${getUpdateColor(update?.type)}`}>
                <Icon name={getUpdateIcon(update?.type)} size={20} />
              </div>

              {/* Update Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-foreground">{update?.title}</h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      update?.type === 'milestone' ?'bg-success/10 text-success'
                        : update?.type === 'announcement' ?'bg-primary/10 text-primary' :'bg-warning/10 text-warning'
                    }`}>
                      {update?.type}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatTimeAgo(update?.timestamp)}
                  </span>
                </div>

                <p className="text-foreground text-sm leading-relaxed mb-3">
                  {update?.content}
                </p>

                {/* Update Image */}
                {update?.image && (
                  <div className="mb-3">
                    <Image
                      src={update?.image}
                      alt={update?.title}
                      className="w-full max-w-md h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                {/* Update Stats */}
                {update?.stats && (
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    {update?.stats?.supporters && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Users" size={14} />
                        <span>{update?.stats?.supporters} supporters</span>
                      </div>
                    )}
                    {update?.stats?.progress && (
                      <div className="flex items-center space-x-1">
                        <Icon name="TrendingUp" size={14} />
                        <span>{update?.stats?.progress}% complete</span>
                      </div>
                    )}
                    {update?.stats?.timeLeft && (
                      <div className="flex items-center space-x-1">
                        <Icon name="Clock" size={14} />
                        <span>{update?.stats?.timeLeft}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {updates?.length === 0 && (
          <div className="text-center py-8">
            <Icon name="Calendar" size={48} className="text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No updates yet. Check back later for campaign news!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignUpdates;