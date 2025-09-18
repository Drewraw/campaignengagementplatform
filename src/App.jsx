import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppRoutes from "./Routes";
import axios from "axios";
import { auth } from "./firebase"; // Make sure to import your firebase auth instance

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });

    const connectToBackend = async () => {
      try {
        await axios.get("/api/campaigns");
        console.log("Backend is connected");
      } catch (error) {
        console.error("Backend connection failed:", error);
      }
    };
    connectToBackend();

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">CampaignConnect</Link>
        </h1>
      </div>
      <AppRoutes currentUser={currentUser} />
    </div>
  );
}

export default App;
