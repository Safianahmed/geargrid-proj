import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cropper from "react-easy-crop";
import "../css/EditProfile.css";

const EditProfile = () => {
  const [formData, setFormData] = useState({ username: "", name: "", bio: "" });
  const [avatar, setAvatar] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAvatar = localStorage.getItem("avatar");
    const storedUsername = localStorage.getItem("username") || "";
    const storedName = localStorage.getItem("name") || "";
    const storedBio = localStorage.getItem("bio") || "";
    if (storedAvatar) setAvatar(storedAvatar);
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
    navigate("/profile");
  };

  const handlePhotoClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Please upload a valid image file.");
    }
  };

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const getCroppedImage = (imageSrc, cropPixels) => {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = imageSrc;
      image.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = cropPixels.width;
        canvas.height = cropPixels.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          image,
          cropPixels.x,
          cropPixels.y,
          cropPixels.width,
          cropPixels.height,
          0,
          0,
          cropPixels.width,
          cropPixels.height
        );
        resolve(canvas.toDataURL("image/jpeg"));
      };
    });
  };

  const handleCropSave = async () => {
    try {
      const croppedImg = await getCroppedImage(imageSrc, croppedAreaPixels);
      setAvatar(croppedImg);
      localStorage.setItem("avatar", croppedImg);
      setImageSrc(null);
    } catch (err) {
      console.error("Cropping failed", err);
    }
  };

  const handleRemovePhoto = () => {
    setAvatar(null);
    localStorage.removeItem("avatar");
  };

  return (
    <div className="edit-profile-container">
      <div className="profile-top-card">
        <div className="profile-preview centered">
          <div className="avatar-wrapper">
            {avatar ? (
              <img src={avatar} alt="avatar" className="avatar-preview" />
            ) : (
              <div className="avatar-preview">
                <span className="avatar-placeholder-text">Upload profile picture here</span>
              </div>
            )}
          </div>

          <div className="avatar-controls">
            <button className="change-photo-btn" onClick={handlePhotoClick}>
              {avatar ? "Change Photo" : "Upload Photo"}
            </button>
            {avatar && (
              <button className="remove-photo-btn" onClick={handleRemovePhoto}>
                Remove Photo
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      {/* Back to Profile Button */}
      <button className="back-btn" onClick={() => navigate("/profile")}>
        ← Back to Profile
      </button>

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

      <form className="edit-profile-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" />
        </div>

        <button type="submit" className="save-btn">Submit</button>
      </form>
    </div>
  );
};

export default EditProfile;
