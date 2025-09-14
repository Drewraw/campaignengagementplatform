import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TimelineFeed from "./pages/timeline-feed";
import VotingPool from "./pages/voting-pool";
// Replace previous CreateCampaign import
import CampaignForm from './pages/user-led-campaigns/components/CampaignForm';
import UserProfile from "./pages/user-profile";
import CampaignDetails from "./pages/campaign-details";

// Simulated logged-in user (admin)
const currentUser = {
  id: "1",
  name: "Admin User",
  username: "admin",
  role: "admin", // allows sending DM to other users
};

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Timeline Feed */}
        <Route
          path="/"
          element={<TimelineFeed currentUser={currentUser} />}
        />

        {/* Voting Pool */}
        <Route
          path="/voting-pool"
          element={<VotingPool currentUser={currentUser} />}
        />

        {/* User-led Campaign Creation */}
        <Route
          path="/create-campaign"
          element={<CampaignForm currentUser={currentUser} />}
        />

        {/* User Profile */}
        <Route
          path="/user-profile"
          element={<UserProfile currentUser={currentUser} />}
        />

        {/* Campaign Details */}
        <Route
          path="/campaign-details"
          element={<CampaignDetails currentUser={currentUser} />}
        />
      </Routes>
    </Router>
  );
}
