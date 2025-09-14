import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const VotingCampaignCard = ({ campaign, onVote }) => (
  <div className="bg-card border border-border rounded-lg shadow-soft overflow-hidden p-4 flex flex-col">
    <h3 className="font-semibold mb-1">{campaign.title}</h3>
    <p className="text-muted-foreground mb-2">{campaign.description}</p>
    <div className="flex flex-wrap gap-2 mb-2">
      {campaign.tags?.map(tag => <span key={tag} className="bg-muted px-2 py-1 rounded text-xs">{tag}</span>)}
    </div>
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={() => onVote(campaign.id, 'upvote')}>
        <Icon name="ThumbsUp" /> Upvote ({campaign.upvotes})
      </Button>
      <Button variant="outline" size="sm" onClick={() => onVote(campaign.id, 'downvote')}>
        <Icon name="ThumbsDown" /> Downvote ({campaign.downvotes})
      </Button>
    </div>
    <p className="text-xs text-muted-foreground mt-2">Ends on: {new Date(campaign.endDate).toLocaleDateString()}</p>
  </div>
);

export default VotingCampaignCard;

