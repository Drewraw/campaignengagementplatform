import React, { useEffect } from "react";
import Routes from "./Routes";
import axios from "axios";

function App() {
  useEffect(() => {
    const connectToBackend = async () => {
      try {
        await axios.get("/api/campaigns");
        console.log("Backend is connected");
      } catch (error) {
        console.error("Backend connection failed:", error);
      }
    };
    connectToBackend();
  }, []);

  return (
    <div>
      <div className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">CampaignConnect</h1>
      </div>
      <Routes />
    </div>
  );
}

export default App;
