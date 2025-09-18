import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TimelineFeed from './pages/timeline-feed';
import VotingPool from './pages/voting-pool';
import UserProfile from './pages/user-profile';
import CreateCampaignPage from './pages/user-led-campaigns';
import PrivateRoute from './components/PrivateRoute';
import FeedbackPage from './pages/feedback/FeedbackPage';

export default function AppRoutes({ currentUser }) {
  return (
    <Routes>
      <Route path="/" element={<TimelineFeed />} />
      <Route path="/voting-pool" element={<VotingPool />} />
      <Route path="/user-profile/:userId" element={<UserProfile />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute currentUser={currentUser} />}>
        <Route path="/create-campaign" element={<CreateCampaignPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
      </Route>
    </Routes>
  );
}
