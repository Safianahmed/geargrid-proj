// import React, { useEffect, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import axios from 'axios';
// import Slider from 'react-slick';
// import '../css/CarBuild.css';
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const CarBuild = () => {
//   const { id } = useParams(); 
//   const navigate = useNavigate();
//   const [build, setBuild] = useState(null);
//   const [mods, setMods] = useState({});
//   const [gallery, setGallery] = useState([]); 

//   const loggedInUserId = 1; 

//   useEffect(() => {
//     const fetchBuild = async () => {
//       try {
//         const { data } = await axios.get(
//           `http://localhost:3001/api/builds/${id}`,
//           { withCredentials: true }
//         );
//         console.log('Build response:', data);
  
//         if (!data.success) {
//           throw new Error(data.message || 'Build fetch failed');
//         }
  
//         setBuild(data.build);
//         setMods(data.mods);
//         setGallery(data.build.galleryImages || []);
//       } catch (err) {
//         console.error('Failed to load build', err);
//         // you could set an error state here and render it
//       }
//     };
  
//     fetchBuild();
//   }, [id]);
  

//   const sliderSettings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     adaptiveHeight: true
//   };

//   if (!build) return <div>Loading build...</div>;

//   return (
//     <div className="car-build-page">
//       <div className="car-header">
//         <h1>{build.car_name} {build.model}</h1>
//       </div>

//       <Slider {...sliderSettings} className="car-image-slider">
//         <div className="slider-item">
//           <img src={build.cover_image || "https://via.placeholder.com/600x400"} alt="Cover 1" className="car-image" />
//         </div>
//         {/* Optional second image - for now repeat */}
//         <div className="slider-item">
//           <img src={build.cover_image || "https://via.placeholder.com/600x400"} alt="Cover 2" className="car-image" />
//         </div>
//       </Slider>

//       {loggedInUserId === build.user_id && (
//         <button className="edit-button" onClick={() => navigate(`/edit-build/${build.id}`)}>
//           Edit Build
//         </button>
//       )}

//       <div className="description-section">
//         <h2 className="section-title">Description</h2>
//         <textarea className="car-description" defaultValue={build.description || ''} readOnly />
//       </div>

//       <div className="modifications">
//         {Object.entries(mods).map(([category, modsInCategory]) => (
//           <div key={category} className="category">
//             <h2>{category}</h2>
//             <div className="mods-container">
//               {modsInCategory.map((mod, index) => (
//                 <div key={index} className="mod-item">
//                   {mod.image_url && <img src={mod.image_url} alt={mod.mod_name} className="mod-image" />}
//                   <div className="mod-info">
//                     <h3>{mod.mod_name}</h3>
//                     <p>{mod.mod_note}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="gallery-section">
//         <h2 className="gallery-title">Gallery</h2>
//         <div className="gallery-grid">
//           {gallery.map((src, idx) => (
//             <img key={idx} src={src} alt={`Gallery ${idx+1}`} className="gallery-image" />
//           ))}
//         </div>
//       </div>

//       <button className="username-button" onClick={() => navigate('/profile')}>Back to Profile</button>
//     </div>
//   );
// };

// export default CarBuild;








import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import '../css/CarBuild.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { API_BASE, resolveImageUrl } from '../utils/imageUrl';

const CarBuild = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [build, setBuild]   = useState(null);
  const [mods, setMods]     = useState([]);    // flat array
  const [gallery, setGallery] = useState([]);

  // TODO: pull this from your auth context
  const loggedInUserId = 1;
  

  // helper to ensure mods is always an array
  const normalizeMods = (m) => {
    console.log('groupedMods:', groupedMods);

    if (Array.isArray(m)) return m;
    return Object.values(m).flat();
  };

  useEffect(() => {
    const fetchBuild = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/builds/${id}`,
          { withCredentials: true }
        );
        if (!data.success) throw new Error(data.message);
        setBuild(data.build);
        setMods(normalizeMods(data.mods || []));
        setGallery(data.build.galleryImages || []);
      } catch (err) {
        console.error('Failed to load build:', err);
      }
    };
    fetchBuild();
  }, [id]);

  const groupedMods = useMemo(() => {
    return mods.reduce((cats, mod) => {
      const cat = mod.category || 'Uncategorized';
      const sub = mod.sub_category || 'Other';
      if (!cats[cat]) cats[cat] = {};
      if (!cats[cat][sub]) cats[cat][sub] = [];
      cats[cat][sub].push(mod);
      return cats;
    }, {});
  }, [mods]);

  const sliderSettings = { dots:true, infinite:true, speed:400, slidesToShow:1, adaptiveHeight:true };

  if (!build) return <div>Loading build…</div>;

  return (
    <div className="car-build-page">
      <header className="car-header">
        <h1 className="car-title">{build.car_name}</h1>
        {build.body_style && <p className="body-style">{build.body_style}</p>}
        {loggedInUserId === build.user_id && (
          <button className="edit-button" onClick={() => navigate(`/edit-build/${build.id}`)}>
            Edit Build
          </button>
        )}
      </header>

     <Slider {...sliderSettings} className="car-image-slider">
  {[
    // always two entries: first uses cover_image, second falls back to cover_image
    build.cover_image,
    build.cover_image2 ?? build.cover_image
  ].map((rawSrc, idx) => {
    // rawSrc may be null or a string; resolveImageUrl will give default if null
    const src = resolveImageUrl(rawSrc);
    return (
      <div key={idx} className="slider-item">
        <img
          src={src}
          alt={`Cover ${idx + 1}`}
          className="car-image"
        />
      </div>
    );
  })}
</Slider>


      <section className="description-section">
        <h2 className="section-title">Description</h2>
        <p className="car-description">
          {build.description || 'No description provided.'}
        </p>
      </section>

      <section className="modifications">
        <h2 className="section-title">Modifications</h2>
        {mods.length === 0 && <p>No modifications added.</p>}
        {Object.entries(groupedMods).map(([category, subs]) => (
          <div key={category} className="category-block">
            <h3 className="category-title">{category}</h3>
            {Object.entries(subs).map(([sub, items]) => (
              <div key={sub} className="sub-category-block">
                <h4 className="sub-title">{sub}</h4>
                <div className="mods-container">
                  {items.map(mod => (
                    <div key={mod.id} className="mod-item">
                      {mod.image_url && (
                        <img
                          src={mod.image_url}
                          alt={mod.mod_name}
                          className="mod-image"
                        />
                      )}
                      <div className="mod-info">
                        <strong className="mod-name">{mod.mod_name}</strong>
                        {mod.mod_note && <p className="mod-note">{mod.mod_note}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>

      <section className="gallery-section">
  <h2 className="section-title">Gallery</h2>
  {gallery.length === 0 ? (
    <p>No gallery images uploaded.</p>
  ) : (
    <div className="gallery-grid">
      {gallery.slice(0, 10).map((rawUrl, idx) => {
        const src = resolveImageUrl(rawUrl);
        return (
          <img
            key={idx}
            src={src}
            alt={`Gallery ${idx + 1}`}
            className="gallery-image"
          />
        );
      })}
    </div>
  )}
</section>

      <button className="username-button" onClick={() => navigate('/profile')}>
        Back to Profile
      </button>
    </div>
  );
};

export default CarBuild;
