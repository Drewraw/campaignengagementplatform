import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import VotingCampaignCard from './components/VotingCampaignCard';
import { db } from '../../firebase';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';

const VotingPool = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('all');
  const categories = ["All", "Food & Beverages", "Electronics", "Fashion", "Home Appliances"];

  useEffect(() => {
    const q = query(collection(db, "campaigns"), where("isApproved", "==", false));
    const unsubscribe = onSnapshot(q, snapshot => {
      setCampaigns(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleVote = async (campaignId, voteType) => {
    const campaignRef = doc(db, "campaigns", campaignId);
    const campaign = campaigns.find(c => c.id === campaignId);

    if (!campaign) return;

    const newUpvotes = voteType === 'upvote' ? campaign.upvotes + 1 : campaign.upvotes;
    const newDownvotes = voteType === 'downvote' ? campaign.downvotes + 1 : campaign.downvotes;

    await updateDoc(campaignRef, { upvotes: newUpvotes, downvotes: newDownvotes });

    if (newUpvotes >= 5) {
      await updateDoc(campaignRef, { isApproved: true });
      alert("Campaign reached 5 upvotes! Appearing in Timeline Feed.");
    }
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
    if (timeFilter === 'new') return true; // optional, could sort
    return true;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16 max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Voting Pool</h1>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button key={cat} className={`px-3 py-1 rounded ${categoryFilter===cat?'bg-blue-500 text-white':'bg-gray-200'}`} 
              onClick={() => setCategoryFilter(cat)}>
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredCampaigns.length === 0 && <p className="text-center text-muted-foreground">No campaigns to vote on.</p>}
          {filteredCampaigns.map(campaign => (
            <VotingCampaignCard key={campaign.id} campaign={campaign} onVote={handleVote} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default VotingPool;
