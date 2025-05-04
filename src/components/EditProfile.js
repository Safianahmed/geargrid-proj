import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/EditProfile.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    bio: ""
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedName = localStorage.getItem("name") || "";
    const storedBio = localStorage.getItem("bio") || "";
    setFormData({ username: storedUsername, name: storedName, bio: storedBio });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("username", formData.username);
    localStorage.setItem("name", formData.name);
    localStorage.setItem("bio", formData.bio);
    setSuccess(true);
    setTimeout(() => navigate("/profile"), 1500);
  };

  return (
    <div className="edit-profile-container">
      {/* Top Section */}
      <div className="profile-top-card">
        <div className="profile-preview">
          <div className="avatar-preview">GG</div>
          <div className="user-info">
            <div className="user-username">{formData.username || "Username"}</div>
            <div className="user-name">{formData.name || "Name"}</div>
          </div>
          <button className="change-photo-btn">Change Photo</button>
        </div>
      </div>

      {/* Form */}
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
          />
        </div>

        <button type="submit" className="save-btn">Submit</button>
        {success && <p className="success-message">Profile updated successfully!</p>}
      </form>
    </div>
  );
};

export default EditProfile;
