import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [isSearching, setIsSearching] = useState(false);

  const { viewedUserId } = useParams();
  const navigate = useNavigate();

  const loggedInUserId = localStorage.getItem("userId");
  const targetUserId = viewedUserId || loggedInUserId;
  const isOwnProfile = !viewedUserId || viewedUserId === loggedInUserId;
  const [profileData, setProfileData] = useState({
    username: "",
    displayName: "",
    bio: "",
    avatarUrl: null,
  });
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const userId = localStorage.getItem("userId");
  const storedUsername = localStorage.getItem("username") || "Username";
  const storedName = localStorage.getItem("name") || "Name";

  const storedDisplayName = localStorage.getItem("displayName") || localStorage.getItem("name") || storedUsername;
  const storedBio = localStorage.getItem("bio") || "Short bio or description about the user.";

  const [avatarUrl, setAvatarUrl] = useState(localStorage.getItem("avatar") || "");


  useEffect(() => {
    if (!targetUserId) {
      setIsLoadingProfile(false);
      return;
    }

    const fetchUserProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const response = await fetch(`http://localhost:3001/api/user-profile/${targetUserId}`, {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.success && data.user) {
          setProfileData({
            username: data.user.username,
            displayName: data.user.display_name || data.user.username,
            bio: data.user.bio || "",
            avatarUrl: data.user.avatar_url || null,
          });
        } else {
          console.error("Failed to fetch user profile:", data.message);
        }
      } catch (err) {
        console.error("Error fetching user profile:", err);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, [targetUserId, navigate, loggedInUserId]);

  useEffect(() => {
    if (!targetUserId) return;

    const fetchBuilds = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/builds?userId=${targetUserId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (data.success) {
          setCurrentBuilds(data.currentBuilds || []);
          setPreviousBuilds(data.previousBuilds || []);
        } else {
          console.error("Failed to fetch builds:", data.message);
        }
      } catch (err) {
        console.error("Fetch builds error:", err);
      }
    };
    fetchBuilds();
  }, [targetUserId]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    const timerId = setTimeout(async () => {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          const combined = [
            ...(data.users || []).map(u => ({ ...u, resultType: 'user' })),
            ...(data.builds || []).map(b => ({ ...b, resultType: 'build' }))
          ];
          setSearchResults(combined);
        } else {
          console.error("Search API error:", data.message);
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(timerId);
  }, [searchQuery]);

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
              {profileData.avatarUrl ? (
                <img src={resolveImageUrl(profileData.avatarUrl, 'avatar')} alt="avatar" />
              ) : (
                <div className="avatar-placeholder-text">
                  {isOwnProfile ? "Upload profile picture here" : "No Picture"}
                </div>
              )}
            </div>
          </div>
          <div className="profile-main-info">
            <div className="username-row">
              <h2 className="profile-username">{profileData.username}</h2>
              {isOwnProfile && (
                <button className="profile-action-btn" onClick={() => navigate("/edit-profile")}>
                  Edit Profile
                </button>
              )}
            </div>
            <div className="profile-stats">
              <span><strong>_</strong> Followers</span>
              <span><strong>_</strong> Following</span>
            </div>
            <div className="profile-name">{profileData.displayName}</div>
            <div className="profile-bio">{profileData.bio || (isOwnProfile ? "Add a bio..." : "No bio yet.")}</div>
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
              placeholder="Search users or car builds..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <span className="clear-btn" onClick={() => setSearchQuery("")}>x</span>
            )}
          </div>
          <div className="search-results-panel">
            {isSearching && <p>Searching...</p>}
            {!isSearching && searchResults.length === 0 && searchQuery.trim() !== "" && <p>No results found.</p>}
            {!isSearching && searchResults.map((result, idx) => {
              if (result.resultType === 'user') {
                return (
                  <div
                    key={`user-${result.id}-${idx}`}
                    className="search-result-item user-result"
                    onClick={() => navigate(`/user/${result.id}`)}
                  >
                    <img src={resolveImageUrl(result.avatar_url, 'avatar')} alt={result.display_name || result.username} className="search-result-avatar" />
                    <div className="search-result-info">
                      <strong>{result.display_name || result.username}</strong>
                      <span>@{result.username}</span>
                    </div>
                    <span className="search-result-type-label">User</span>
                  </div>
                );
              } else if (result.resultType === 'build') {
                return (
                  <div
                    key={`build-${result.id}-${idx}`}
                    className="search-result-item build-result"
                    onClick={() => navigate(`/car-build/${result.id}`)}
                  >
                    <img src={resolveImageUrl(result.cover_image)} alt={result.car_name} className="search-result-thumbnail" />
                    <div className="search-result-info">
                      <strong>{result.car_name}</strong>
                      <span>by {result.owner_display_name || result.owner_username}</span>
                    </div>
                    <span className="search-result-type-label">Build</span>
                  </div>
                );
              }
              return null;
            })}
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