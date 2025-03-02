import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Profile.css"; // 
const Profile = () => {
  const navigate = useNavigate(); 
  const [activeTab, setActiveTab] = useState("posts"); 
  // Renders different image counts based on selected tab
  const renderImages = () => {
    let count = activeTab === "posts" ? 6 : 9; 
    return Array.from({ length: count }, (_, index) => (
      <div key={index} className="build-placeholder"></div>
    ));
  };

  return (
    <div className="profile-container">
      {/* Header Section */}
      <div className="profile-header">
        <div className="profile-avatar" onClick={() => navigate("/menu")}> 
          GearGrid
        </div>
        <div className="profile-info">
          <h2 className="profile-username">Username</h2>
          <p className="profile-bio">Short bio or description about the user.</p>
        </div>
      </div>

      {/* Stats & Actions */}
      <div className="profile-stats-container">
        <div className="profile-stats">
          <span><strong>10</strong> Posts</span>
          <span><strong>362</strong> Followers</span>
          <span><strong>380</strong> Following</span>
        </div>
        <div className="profile-actions">
          <button className="edit-btn">Edit Profile</button>
          <button className="archive-btn">View Archive</button>
        </div>
      </div>

      <hr className="profile-divider" />

      {/* Tabs for Posts, Saved, Tagged */}
      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === "posts" ? "active" : "inactive"}`}
          onClick={() => setActiveTab("posts")}
        >
          POSTS
        </button>
        <button 
          className={`tab-button ${activeTab === "saved" ? "active" : "inactive"}`}
          onClick={() => setActiveTab("saved")}
        >
          SAVED
        </button>
        <button 
          className={`tab-button ${activeTab === "tagged" ? "active" : "inactive"}`}
          onClick={() => setActiveTab("tagged")}
        >
          TAGGED
        </button>
      </div>

     
      <div className="profile-builds-container">
        <div className="profile-builds">{renderImages()}</div>
      </div>
    </div>
  );
};

export default Profile;
