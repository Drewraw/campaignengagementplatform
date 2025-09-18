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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      // After successful logout, you might want to redirect the user to the login page
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div>
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">CampaignConnect</Link>
        </h1>
        {currentUser ? (
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Login
          </Link>
        )}
      </div>
      <AppRoutes currentUser={currentUser} />
    </div>
  );
}

export default App;
