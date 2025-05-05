import React, { useState } from 'react';
import { useNavigate }     from 'react-router-dom';
import { vehicleData }     from '../data/vehicleData';
import { modCategories }   from '../data/modCategories';
import '../css/AddBuild.css';

const AddBuild = () => {
  const [vehicleType, setVehicleType]     = useState('');
  const [brand, setBrand]                 = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [customModel, setCustomModel]     = useState('');
  const [bodyStyle, setBodyStyle]         = useState('');
  const [description, setDescription]     = useState('');
  const [coverFiles, setCoverFiles]       = useState([]);
  const [galleryFiles, setGalleryFiles]   = useState([]);
  const [currentMain, setCurrentMain]     = useState('');
  const [currentSub, setCurrentSub]       = useState('');
  const [mods, setMods]                   = useState([]); 
  const [customSubs, setCustomSubs] = useState({});
  const [customModInput, setCustomModInput] = useState('');
  const [newSubInputs, setNewSubInputs] = useState({});

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalModel = customModel || selectedModel;

    const formData = new FormData();
    formData.append('car_name', `${brand} ${finalModel}`.trim());
    formData.append('model', finalModel);
    formData.append('bodyStyle', bodyStyle);
    formData.append('description', description);
    //formData.append('mods', JSON.stringify(mods.map(({ main, sub, name, details }) => ({ main, sub, name, details })) ));
    
    const modsPayload = mods.map(({ main, sub, name, details }) => ({ 
      main, sub, name, details 
    }));
    formData.append('mods', JSON.stringify(modsPayload));

    // Append each mod image
    mods.forEach(mod => {
      if (mod.image) { formData.append(`modImages`, mod.image); }
    });

    // Append cover images
    coverFiles.slice(0, 2).forEach(file => {
      if (file) { formData.append('coverImages', file);}
    });

     // Append gallery images
     galleryFiles.forEach(file => {
      if (file) { formData.append('galleryImages', file);}
    });

    try {
      const res = await fetch('/api/builds', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await res.json();
      if (data.success) navigate('/profile');
      else console.error('Server error:', data.message);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Add a New Build</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
      >
        {/* Vehicle Type */}
        <div>
          <label>Vehicle Type</label>
          <select
            value={vehicleType}
            onChange={e => {
              setVehicleType(e.target.value);
              setBrand('');
              setSelectedModel('');
              setCustomModel('');
              setBodyStyle('');
            }}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">-- Select Type --</option>
            {Object.keys(vehicleData).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Brand */}
        {vehicleType && (
          <div>
            <label>Brand</label>
            <select
              value={brand}
              onChange={e => {
                setBrand(e.target.value);
                setSelectedModel('');
                setCustomModel('');
              }}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">-- Select Brand --</option>
              {Object.keys(vehicleData[vehicleType]).map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        )}

        {/* Model */}
        {brand && (
          <div>
            <label>Model</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={selectedModel}
                onChange={e => setSelectedModel(e.target.value)}
                style={{ flex: 1, padding: '8px' }}
              >
                <option value="">-- Select Model --</option>
                {vehicleData[vehicleType][brand].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Type manually (optional)"
                value={customModel}
                onChange={e => setCustomModel(e.target.value)}
                style={{ flex: 1, padding: '8px' }}
              />
            </div>
          </div>
        )}

        {/* Body Style */}
        {(selectedModel || customModel) && (
          <div>
            <label>Body Style</label>
            <select
              value={bodyStyle}
              onChange={e => setBodyStyle(e.target.value)}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">-- Select Body Style --</option>
              {[
                'Coupe','Sedan','Hatchback','SUV',
                'Wagon','Convertible','Pickup Truck',
                'Van','Motorcycle','Other'
              ].map(style => (
                <option key={style} value={style}>{style}</option>
              ))}
            </select>
          </div>
        )}

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your build..."
            rows="4"
            style={{ width: '100%', padding: '10px' }}
          />
        </div>
        
        <div className="mods-main-cats">
        {Object.keys(modCategories).map(main => {
          const builtIns             = Object.keys(modCategories[main]);
          const customs              = customSubs[main] || [];
          const allSubs              = [...builtIns, ...customs];
          const hasSelectedUnderMain = mods.some(m => m.main === main);
          const isMainOpen           = currentMain === main || hasSelectedUnderMain;
        
          return (
            <div key={main} className={`mod-main-group ${isMainOpen ? 'open' : ''}`}>

              {/* MAIN CATEGORY BUTTON */}
              <button
                type="button"
                className={`mod-main-btn ${currentMain === main ? 'active' : ''}`}
                onClick={() => {
                  if (currentMain === main) {
                    setCurrentMain('');    // close it
                    setCurrentSub('');
                  } else {
                    setCurrentMain(main);  // open it
                    setCurrentSub('');
                  }
                }}
              >
                {main}
              </button>
              
              {/* SUB-CATEGORIES */}
              {isMainOpen && (
                <div className="mods-sub-cats">
                  {allSubs.map(sub => {
                    const isCustomSub = Array.isArray(customSubs[main]) && customSubs[main].includes(sub)
                    const hasSelectedSub = mods.some(m => m.main === main && m.sub === sub);
                    const isSubOpen      = currentSub === sub || hasSelectedSub;
                  
                    return (
                      <div key={sub} className={`mod-sub-group ${isSubOpen ? 'open' : ''}`}>
                        <button
                          type="button"
                          className={`mod-sub-btn ${currentSub === sub ? 'active' : ''}`}
                          onClick={() => {
                            if (currentSub === sub) {
                              setCurrentSub('');  // close it
                            } else {
                              setCurrentSub(sub); // open it
                            }
                          }}
                        >
                          {sub}
                        </button>
                        
              {/* DELETE CUSTOM SUB-CATEGORY BUTTON
                  Only show if it's a custom sub-category */}
              {isCustomSub && (
                <button
                  type="button"
                  className="mod-sub-delete"
                  onClick={() => {
                    // ask first
                    if (!window.confirm(`Delete sub-category “${sub}”?`)) return
                    // remove it
                    setCustomSubs(cs => {
                      const arr = Array.isArray(cs[main]) ? cs[main] : []
                      return { ...cs, [main]: arr.filter(s => s !== sub) }
                    })
                    // if it was open, close it
                    if (currentSub === sub) setCurrentSub('')
                  }}
                >
                  ×
                </button>
              )}

              {/* ITEMS FOR THIS SUB */}
              {isSubOpen && (
                <div className="mods-items">
                  {/* MODS IN THIS SUB */}
                  {[
                    ...(modCategories[main][sub] || []),
                    ...mods
                      .filter(m => m.main === main && m.sub === sub &&
                                   !(modCategories[main][sub]||[]).includes(m.name))
                      .map(m => m.name)
                  ].map(item => {
                    const isChecked = mods.some(
                      m => m.main===main && m.sub===sub && m.name===item
                    );
                    return (
                      <div key={item} className="mod-item-row">
                        <label>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              if (isChecked) {
                                setMods(ms =>
                                  ms.filter(x =>
                                    !(x.main===main && x.sub===sub && x.name===item)
                                  )
                                );
                              } else {
                                setMods(ms => [
                                  ...ms,
                                  { main, sub, name: item, details: '', image: null }
                                ]);
                              }
                            }}
                          />
                          {item}
                        </label>
                          
              {/* DETAILS + IMAGE BELOW */}
              {isChecked && (
                <div className="mod-item-extras">
                  <input
                    type="text"
                    placeholder="Details (optional)"
                    value={mods.find(x =>
                      x.main===main && x.sub===sub && x.name===item
                    )?.details || ''}
                    onChange={e => {
                      const val = e.target.value;
                      setMods(ms =>
                        ms.map(x =>
                          x.main===main && x.sub===sub && x.name===item
                            ? { ...x, details: val }
                            : x
                        )
                      );
                    }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => {
                      const file = e.target.files[0] || null;
                      setMods(ms =>
                        ms.map(x =>
                          x.main===main && x.sub===sub && x.name===item
                            ? { ...x, image: file }
                            : x
                        )
                      );
                    }}
                  />
                </div>
              )}
        </div>
      );
    })}                            
                    {/* “Other mod” input, aligned with items */}
                          <div className="custom-mod">
                            <input
                              type="text"
                              placeholder="Other mod name"
                              value={customModInput}
                              onChange={e => setCustomModInput(e.target.value)}
                            />
                            <button
                              type="button"
                              disabled={!customModInput.trim()}
                              onClick={() => {
                                setMods(ms => [
                                  ...ms,
                                  { main, sub, name: customModInput.trim(), details:'', image:null }
                                ]);
                                setCustomModInput('');
                              }}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              {/* ADD A NEW SUB-CATEGORY */}
              <div className="mod-sub-group custom-sub">
                <input
                  type="text"
                  placeholder="New sub-category"
                  value={newSubInputs[main] || ''}
                  onChange={e => {
                    const v = e.target.value;
                    setNewSubInputs(inp => ({ ...inp, [main]: v }));
                  }}
                />
                <button
                  type="button"
                  disabled={!newSubInputs[main]?.trim()}
                  onClick={() => {
                    const next = newSubInputs[main].trim();
                    // append to customSubs[main] array (or start a new array)
                    setCustomSubs(cs => ({
                      ...cs,
                      [main]: [...(Array.isArray(cs[main]) ? cs[main] : []), next]
                    }));
                    // clear the input
                    setNewSubInputs(inp => ({ ...inp, [main]: '' }));
                  }}
                  >
                    Add Sub-category
                  </button>
                </div>
            </div>
          )}

              {/* SEPARATOR LINE WHEN MAIN IS OPEN */}
              {isMainOpen && <hr className="mod-main-separator" />}
              </div>
            );
         })}
      </div>

          {/* File Uploads Section */}
          <div className="upload-box">
            {/* Cover Image Upload */}
            <div>
              <label>Cover Image</label>
              <input
                type="file"
                name = "coverImages"
                accept="image/*"
                multiple
                onChange={e => { const files = Array.from(e.target.files).slice(0, 2);
                setCoverFiles(files);
              }}            
            />
            </div>
              
            {/* Gallery Images Upload */}
            <div style={{ marginTop: '12px' }}>
              <label>Gallery Images (optional)</label>
              <input
                type="file"
                name = "galleryImages"
                accept="image/*"
                multiple
                onChange={e => setGalleryFiles(Array.from(e.target.files))}
              />
            </div>
          </div>

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#111',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Submit Build
        </button>
      </form>
    </div>
  );
};

export default AddBuild;
