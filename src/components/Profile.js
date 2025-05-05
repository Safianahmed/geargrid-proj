// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../css/Profile.css";

// const Profile = () => {
//   const [activeTab, setActiveTab] = useState("posts");
//   const navigate = useNavigate();

//   // Renders different image counts based on selected tab
//   const renderImages = () => {
//     let count = activeTab === "posts" ? 6 : 9; 
//     return Array.from({ length: count }, (_, index) => (
//       <div key={index} className="build-placeholder" onClick={() => navigate("/car-build")}
//       style={{cursor: "pointer"}} >Image Placeholder</div>
//     ));
//   };

//   return (
//     <div className="profile-container">
//       {/* Header Section */}
//       <div className="profile-header">
//         <div className="profile-avatar" onClick={() => navigate("/menu")}>
//           GearGrid
//         </div>
//         <div className="profile-info">
//           <h2 className="profile-username">Username</h2>
//           <p className="profile-bio">Short bio or description about the user.</p>
//         </div>
//       </div>

//       {/* Stats & Actions */}
//       <div className="profile-stats-container">
//         <div className="profile-stats">
//           <span><strong>_</strong> Posts</span>
//           <span><strong>_</strong> Followers</span>
//           <span><strong>_</strong> Following</span>
//         </div>
//         <div className="profile-actions">
//           <button className="profile-btn">Edit Profile</button>
//           <button className="profile-btn" onClick={() => navigate("/archive")}>
//             View Archive
//           </button>
//         </div>
//       </div>

//       {/* Divider Below Stats */}
//       <hr className="profile-image-divider" />

//       {/* Tabs for Posts, Saved, Tagged */}
//       <div className="profile-tabs">
//   <div className="tab-left-section">
//     <button 
//       className={`tab-button ${activeTab === "posts" ? "active" : "inactive"}`}
//       onClick={() => setActiveTab("posts")}
//     >
//       POSTS
//     </button>

//     {/* ➕ Add Car Button */}
//     <button 
//       className="add-car-button" 
//       onClick={() => navigate(`/car-build/${build.id}`)}
//       title="Add Car Build"
//     >
//       +
//     </button>
//   </div>

//   <button 
//     className={`tab-button ${activeTab === "saved" ? "active" : "inactive"}`}
//     onClick={() => setActiveTab("saved")}
//   >
//     SAVED
//   </button>
//   <button 
//     className={`tab-button ${activeTab === "tagged" ? "active" : "inactive"}`}
//     onClick={() => setActiveTab("tagged")}
//   >
//     TAGGED
//   </button>
// </div>


//       {/* Dynamic Image Grid */}
//       <div className="profile-builds-container">
//         <div className="profile-builds">{renderImages()}</div>
//       </div>
//     </div>
//   );
// };


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
  const [activeTab, setActiveTab] = useState("posts");
  const [builds, setBuilds] = useState([]);
  const navigate = useNavigate();

  // Fetch builds from backend
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

  // Render image grid
  const renderImages = () => {
    const displayedBuilds = activeTab === "posts" ? builds.slice(0, 6) : builds;

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
          <span><strong>_</strong> Posts</span>
          <span><strong>_</strong> Followers</span>
          <span><strong>_</strong> Following</span>
        </div>
        <div className="profile-actions">
          <button className="profile-btn">Edit Profile</button>
          <button className="profile-btn" onClick={() => navigate("/archive")}>
            View Archive
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="profile-image-divider" />

      {/* Tabs */}
      <div className="profile-tabs">
        <div className="tab-left-section">
          <button 
            className={`tab-button ${activeTab === "posts" ? "active" : "inactive"}`}
            onClick={() => setActiveTab("posts")}
          >
            POSTS
          </button>

          <button 
            className="add-car-button" 
            onClick={() => navigate("/add-build")} 
            title="Add Car Build"
          >
            +
          </button>
        </div>

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

      {/* Builds Grid */}
      <div className="profile-builds-container">
        <div className="profile-builds">{renderImages()}</div>
      </div>
    </div>
  );
};

export default Profile;