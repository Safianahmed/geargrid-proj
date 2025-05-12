import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./cropImage";
import "../css/Profile.css";
import { resolveImageUrl } from '../utils/imageUrl';

const Profile = () => {
  const [currentBuilds, setCurrentBuilds] = useState([]);
  const [previousBuilds, setPreviousBuilds] = useState([]);
  const [activeTab, setActiveTab] = useState("current");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [viewingFollowRequests, setViewingFollowRequests] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId") || 1;
  const storedUsername = localStorage.getItem("username") || "Username";
  const storedName = localStorage.getItem("name") || "Name";
  const storedBio = localStorage.getItem("bio") || "Short bio or description about the user.";
  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem("avatar") || "");

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/builds?userId=${userId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setCurrentBuilds(data.currentBuilds);
          setPreviousBuilds(data.previousBuilds);
        } else {
          console.error("Failed to fetch builds:", data.message);
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchBuilds();
  }, [userId]);

  useEffect(() => {
    const allItems = [
      ...currentBuilds.map(b => b.car_name),
      ...previousBuilds.map(b => b.car_name),
      storedUsername
    ];
    const filtered = allItems.filter(item =>
      item.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery, currentBuilds, previousBuilds, storedUsername]);

  const renderImages = list =>
    list.map(b => (
      <div
        key={b.id}
        className="build-placeholder"
        onClick={() => navigate(`/car-build/${b.id}`)}
        style={{ cursor: "pointer" }}
      >
        <img
          src={resolveImageUrl(b.cover_image)}
          alt={b.car_name}
          className="car-thumbnail"
        />
        <span>{b.car_name}</span>
      </div>
    ));

  return (
    <>
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" />
              ) : (
                <div className="avatar-placeholder-text">Upload profile picture here</div>
              )}
            </div>
          </div>
          <div className="profile-main-info">
            <div className="username-row">
              <h2 className="profile-username">{storedUsername}</h2>
              <button className="profile-action-btn" onClick={() => navigate("/edit-profile")}>Edit Profile</button>
            </div>
            <div className="profile-stats">
              <span><strong>_</strong> Followers</span>
              <span><strong>_</strong> Following</span>
            </div>
            <div className="profile-name">{storedName}</div>
            <div className="profile-bio">{storedBio}</div>
          </div>
        </div>

        <hr className="profile-divider" />

        <div className="profile-tabs">
          <button className={`tab-button ${activeTab === "current" ? "active" : ""}`} onClick={() => setActiveTab("current")}>CURRENT CARS</button>
          <button className={`tab-button ${activeTab === "previous" ? "active" : ""}`} onClick={() => setActiveTab("previous")}>PREVIOUSLY OWNED</button>
        </div>

        <div className="profile-builds-container">
          <div className="profile-builds">
            {activeTab === "current"
              ? (currentBuilds.length ? renderImages(currentBuilds) : <p>No current builds.</p>)
              : (previousBuilds.length ? renderImages(previousBuilds) : <p>No previous builds.</p>)}
          </div>
        </div>
      </div>

      {showSearchBar && (
        <div className="search-panel">
          <div className="notification-header back">
            <span onClick={() => setShowSearchBar(false)}>&larr;</span>
            <h2>Search</h2>
          </div>
          <div className="search-input-wrapper">
            <input
              type="text"
              className="search-bar-input"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <span className="clear-btn" onClick={() => setSearchQuery("")}>×</span>
            )}
          </div>
          <h4 className="search-recent-title">Recent</h4>
          <div className="search-results-panel">
            {searchResults.length ? (
              searchResults.map((result, idx) => (
                <div key={idx} className="search-result-item">{result}</div>
              ))
            ) : (
              <p className="no-recent">No recent searches.</p>
            )}
          </div>
        </div>
      )}

      {showNotifications && (
        <div className="notification-panel">
          {!viewingFollowRequests ? (
            <>
              <div className="notification-header back">
                <span onClick={() => setShowNotifications(false)}>&larr;</span>
                <h2>Notifications</h2>
              </div>
              <div className="notification-requests" onClick={() => setViewingFollowRequests(true)}>
                <div className="notification-avatar" />
                <div className="notification-text">
                  <strong>Follow requests</strong><br />
                  No new requests
                </div>
              </div>
              <div className="notification-section">
                <h4>This Week</h4>
                <div className="no-requests-text">No new activity this week.</div>
              </div>
            </>
          ) : (
            <>
              <div className="notification-header back">
                <span onClick={() => setViewingFollowRequests(false)}>&larr;</span>
                <h2>Follow requests</h2>
              </div>
              <div className="no-requests-text">No follow requests.</div>
            </>
          )}
        </div>
      )}

      <div className="bottom-nav">
        <div className="nav-item" onClick={() => {
          setShowSearchBar(true);
          setShowNotifications(false);
        }}>
          🔍
          <span className="nav-label">Search</span>
        </div>
        <div className="nav-item" onClick={() => navigate("/add-build")}>➕<span className="nav-label">Create</span></div>
        <div className="nav-item" onClick={() => {
          setShowNotifications(true);
          setShowSearchBar(false);
        }}>
          ❤️<span className="nav-label">Notifications</span>
        </div>
      </div>
    </>
  );
};

export default Profile;