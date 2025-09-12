import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import BrandDashboard from './pages/brand-dashboard';
import NotificationsCenter from './pages/notifications-center';
import TimelineFeed from './pages/timeline-feed';
import CampaignDetails from './pages/campaign-details';
import UserProfile from './pages/user-profile';
import CreateCampaign from './pages/create-campaign';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<BrandDashboard />} />
        <Route path="/brand-dashboard" element={<BrandDashboard />} />
        <Route path="/notifications-center" element={<NotificationsCenter />} />
        <Route path="/timeline-feed" element={<TimelineFeed />} />
        <Route path="/campaign-details" element={<CampaignDetails />} />
        <Route path="/user-profile" element={<UserProfile />} />
        <Route path="/create-campaign" element={<CreateCampaign />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
