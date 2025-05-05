import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Profile.css";

const API_BASE = "http://localhost:3001";

// Utility to turn cover_image into a full URL
// or return a default image if path is empty
function resolveImageUrl(path) {
  if (!path) return "/default-car.jpg";
  if (path.startsWith("/uploads")) {
    return `${API_BASE}${path}`;
  }
  return "/default-car.jpg";
}

const Profile = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [builds, setBuilds] = useState([]);
  const navigate = useNavigate();

  const storedUsername = localStorage.getItem("username") || "Username";
  const storedName = localStorage.getItem("name") || "Name";
  const storedBio = localStorage.getItem("bio") || "Short bio or description about the user.";

  useEffect(() => {
    const fetchBuilds = async () => {
      try {

        const res = await fetch(`/api/builds`, {
          credentials: "include", // Include cookies to authenticate user
        });
        const data = await res.json();
        if (data.success) {
          setBuilds(data.builds);
        } else {
          console.error("Failed to fetch builds:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchBuilds();
    console.log("Document cookie:", document.cookie);
  }, []);

  const renderImages = () => {
    const displayedBuilds = activeTab === "current" ? builds.slice(0, 6) : builds;
    return displayedBuilds.map((build) => (
      <div
        key={build.id}
        className="build-placeholder"
        onClick={() => navigate(`/car-build/${build.id}`)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={resolveImageUrl(build.cover_image)}
          alt={build.car_name}
          className="car-thumbnail"
        />
        <span>{build.car_name}</span>
      </div>
    ));
  };

  return (
    <>
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar" onClick={() => navigate("/menu")}>GearGrid</div>
          <div className="profile-main-info">
            <div className="username-row">
              <h2 className="profile-username">{storedUsername}</h2>
              <button className="profile-action-btn" onClick={() => navigate("/edit-profile")}>
                Edit Profile
              </button>
            </div>
            <div className="profile-stats">
              <span><strong>_</strong> Followers</span>
              <span><strong>_</strong> Following</span>
            </div>
            <div className="profile-name">{storedName}</div>
            <div className="profile-bio">{storedBio}</div>
          </div>
        </div>

        {/* Divider */}
        <hr className="profile-divider" />

        {/* Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-button ${activeTab === "current" ? "active" : ""}`}
            onClick={() => setActiveTab("current")}
          >
            CURRENT CARS
          </button>
          <button 
            className={`tab-button ${activeTab === "previous" ? "active" : ""}`}
            onClick={() => setActiveTab("previous")}
          >
            PREVIOUSLY OWNED
          </button>
        </div>

        {/* Car Builds */}
        <div className="profile-builds-container">
          <div className="profile-builds">
            {renderImages()}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-nav">
        <div className="nav-icon" onClick={() => navigate("/")}>🏠</div>
        <div className="nav-icon">🔍</div>
        <div className="nav-icon" onClick={() => navigate("/add-build")}>➕</div>
        <div className="nav-icon">❤️</div>
      </div>
    </>
  );
};

export default Profile;
