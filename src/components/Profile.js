import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "./cropImage";
import "../css/Profile.css";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [builds, setBuilds] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId") || 1;
  const storedUsername = localStorage.getItem("username") || "Username";
  const storedName = localStorage.getItem("name") || "Name";
  const storedBio = localStorage.getItem("bio") || "Short bio or description about the user.";

  useEffect(() => {
    const storedAvatar = localStorage.getItem("avatar");
    if (storedAvatar) {
      setAvatarUrl(storedAvatar);
    }
  }, []);

  useEffect(() => {
    const fetchBuilds = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/builds?userId=${userId}`, {
          credentials: "include",
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
  }, [userId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setShowAvatarMenu(false); // closes modal immediately
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleCropSave = async () => {
    try {
      const croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
      setAvatarUrl(croppedImageUrl);
      localStorage.setItem("avatar", croppedImageUrl);
      setImageSrc(null);
      setShowAvatarMenu(false);
    } catch (err) {
      console.error("Failed to crop image:", err);
    }
  };

  const removeAvatar = () => {
    setAvatarUrl("");
    localStorage.removeItem("avatar");
    setShowAvatarMenu(false);
  };

  const handleAvatarClick = () => {
    setShowAvatarMenu(true);
  };

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
          src={build.cover_image || "/default-car.jpg"}
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
        <div className="profile-header">
          <div className="profile-avatar-wrapper">
            <div className="profile-avatar" onClick={handleAvatarClick}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" />
              ) : (
                <div className="avatar-placeholder-text">
                  Upload profile picture here
                </div>
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

        {imageSrc && (
          <div className="cropper-overlay">
            <div className="cropper-container">
              <div className="cropper-box">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="round"
                  showGrid={false}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <div className="cropper-controls-side">
                <label>Zoom</label>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(e.target.value)}
                  className="zoom-slider"
                />
                <button className="save-btn" onClick={handleCropSave}>Save</button>
                <button className="cancel-btn" onClick={() => setImageSrc(null)}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {showAvatarMenu && (
          <div className="avatar-menu-overlay" onClick={() => setShowAvatarMenu(false)}>
            <div className="avatar-menu-box" onClick={(e) => e.stopPropagation()}>
              <h3>Change Profile Photo</h3>
              <button className="avatar-menu-option upload" onClick={() => fileInputRef.current.click()}>
                Upload Photo
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              {avatarUrl && (
                <button className="avatar-menu-option remove" onClick={removeAvatar}>
                  Remove Current Photo
                </button>
              )}
              <button className="avatar-menu-option cancel" onClick={() => setShowAvatarMenu(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <hr className="profile-divider" />

        <div className="profile-tabs">
          <button className={`tab-button ${activeTab === "current" ? "active" : ""}`} onClick={() => setActiveTab("current")}>CURRENT CARS</button>
          <button className={`tab-button ${activeTab === "previous" ? "active" : ""}`} onClick={() => setActiveTab("previous")}>PREVIOUSLY OWNED</button>
        </div>

        <div className="profile-builds-container">
          <div className="profile-builds">
            {renderImages()}
          </div>
        </div>
      </div>

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
