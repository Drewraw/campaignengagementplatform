import React from "react";
import CampaignForm from "./components/CampaignForm";

export default function UserLedCampaignsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">User-Campaigns</h1>
      <CampaignForm />
    </div>
  );
}
