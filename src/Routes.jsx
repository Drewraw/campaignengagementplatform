      import React from "react";
      import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
      import TimelineFeed from "./pages/timeline-feed";
      import VotingPool from "./pages/voting-pool";
      import CampaignForm from './pages/user-led-campaigns/components/CampaignForm';
      import UserProfile from "./pages/user-profile";
      import { useNavigate } from "react-router-dom";


      const currentUser = {
        id: "2",
        name: "Jane Doe",
        username: "jane.doe",
        role: "creator", 
      };

      const CreateCampaignPage = () => {
        const navigate = useNavigate();

        const handleCampaignSubmit = async (campaignData) => {
          try {
            const response = await fetch('/api/createCampaign', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                ...campaignData,
                creator: {
                  id: currentUser.id,
                  name: currentUser.name,
                }
              }),
            });

            if (response.ok) {
              navigate('/voting-pool');
            } else {
              console.error('Failed to create campaign');
            }
          } catch (error) {
            console.error('Error creating campaign:', error);
          }
        };

        return <CampaignForm onSubmit={handleCampaignSubmit} />;
      }

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

              {/* Create Campaign */}
              <Route
                path="/create-campaign"
                element={<CreateCampaignPage />}
              />

              {/* User Profile */}
              <Route
                path="/user-profile/:userId"
                element={<UserProfile currentUser={currentUser} />}
              />
            </Routes>
          </Router>
        );
      }
