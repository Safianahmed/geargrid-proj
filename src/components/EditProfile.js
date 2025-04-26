import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/EditProfile.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    username: "",
    bio: ""
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "";
    const storedBio = localStorage.getItem("bio") || "";
    setFormData({ username: storedUsername, bio: storedBio });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("username", formData.username);
    localStorage.setItem("bio", formData.bio);
    setSuccess(true);
    setTimeout(() => navigate("/profile"), 1500);
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Your Profile</h2>
      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Bio:
          <input
            type="text"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Save Changes</button>
      </form>
      {success && <p className="success-message">Profile updated successfully!</p>}
    </div>
  );
};

export default EditProfile;
