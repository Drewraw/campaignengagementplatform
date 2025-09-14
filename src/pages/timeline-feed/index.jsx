
import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import CampaignCard from './components/CampaignCard'
import { db } from '../../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const TimelineFeed = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('newest');

  const categories = ["All", "Food & Beverages", "Electronics", "Fashion", "Home Appliances"];

  useEffect(() => {
    const q = query(collection(db, "campaigns"), where("isApproved", "==", true));
    const unsubscribe = onSnapshot(q, snapshot => {
      setCampaigns(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const handleCategoryChange = (e) => setCategoryFilter(e.target.value);
  const handleTimeFilterChange = (e) => setTimeFilter(e.target.value);

  const filteredCampaigns = campaigns
    .filter(c => categoryFilter === 'All' || c.category === categoryFilter)
    .sort((a, b) => {
      if (timeFilter === 'newest') {
        if (b.createdAt && a.createdAt) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return 0;
      }
      if (timeFilter === 'oldest') {
        if (b.createdAt && a.createdAt) {
          return a.createdAt.seconds - b.createdAt.seconds;
        }
        return 0;
      }
      // Add more sorting options if needed
      return 0;
    });

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Timeline Feed</h1>
          <div className="flex space-x-4">
            <select onChange={handleCategoryChange} value={categoryFilter} className="p-2 rounded-md border border-gray-300">
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select onChange={handleTimeFilterChange} value={timeFilter} className="p-2 rounded-md border border-gray-300">
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default TimelineFeed;
