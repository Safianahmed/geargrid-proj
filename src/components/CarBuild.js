import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import '../css/CarBuild.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CarBuild = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [build, setBuild] = useState(null);
  const [mods, setMods] = useState({});
  const [gallery, setGallery] = useState([]); 

  const loggedInUserId = 1; 

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/builds/${id}`,
          { withCredentials: true }
        );
        console.log('Build response:', data);
  
        if (!data.success) {
          throw new Error(data.message || 'Build fetch failed');
        }
  
        setBuild(data.build);
        setMods(data.mods);
        setGallery(data.build.galleryImages || []);
      } catch (err) {
        console.error('Failed to load build', err);
        // you could set an error state here and render it
      }
    };
  
    fetchBuild();
  }, [id]);
  

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    adaptiveHeight: true
  };

  if (!build) return <div>Loading build...</div>;

  return (
    <div className="car-build-page">
      <div className="car-header">
        <h1>{build.car_name} {build.model}</h1>
      </div>

      <Slider {...sliderSettings} className="car-image-slider">
        <div className="slider-item">
          <img src={build.cover_image || "https://via.placeholder.com/600x400"} alt="Cover 1" className="car-image" />
        </div>
        {/* Optional second image - for now repeat */}
        <div className="slider-item">
          <img src={build.cover_image || "https://via.placeholder.com/600x400"} alt="Cover 2" className="car-image" />
        </div>
      </Slider>

      {loggedInUserId === build.user_id && (
        <button className="edit-button" onClick={() => navigate(`/edit-build/${build.id}`)}>
          Edit Build
        </button>
      )}

      <div className="description-section">
        <h2 className="section-title">Description</h2>
        <textarea className="car-description" defaultValue={build.description || ''} readOnly />
      </div>

      <div className="modifications">
        {Object.entries(mods).map(([category, modsInCategory]) => (
          <div key={category} className="category">
            <h2>{category}</h2>
            <div className="mods-container">
              {modsInCategory.map((mod, index) => (
                <div key={index} className="mod-item">
                  {mod.image_url && <img src={mod.image_url} alt={mod.mod_name} className="mod-image" />}
                  <div className="mod-info">
                    <h3>{mod.mod_name}</h3>
                    <p>{mod.mod_note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="gallery-section">
        <h2 className="gallery-title">Gallery</h2>
        <div className="gallery-grid">
          {gallery.map((src, idx) => (
            <img key={idx} src={src} alt={`Gallery ${idx+1}`} className="gallery-image" />
          ))}
        </div>
      </div>

      <button className="username-button" onClick={() => navigate('/profile')}>Back to Profile</button>
    </div>
  );
};

export default CarBuild;
