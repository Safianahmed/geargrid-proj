import React, { useState } from 'react';
import { vehicleData } from '../data/vehicleData';
import '../css/AddBuild.css';

const AddBuild = () => {
  const [vehicleType, setVehicleType] = useState('');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [bodyStyle, setBodyStyle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const buildData = { vehicleType, brand, model, bodyStyle, description };
    console.log("Submitting build:", buildData);
    // TODO: Submit buildData to backend via axios
  };

  return (
    <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center' }}>Add a New Build</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Vehicle Type */}
        <div>
          <label>Vehicle Type</label>
          <select
            value={vehicleType}
            onChange={(e) => {
              setVehicleType(e.target.value);
              setBrand('');
              setModel('');
            }}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">-- Select Type --</option>
            {Object.keys(vehicleData).map((type) => (
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
              onChange={(e) => {
                setBrand(e.target.value);
                setModel('');
              }}
              style={{ width: '100%', padding: '8px' }}
            >
              <option value="">-- Select Brand --</option>
              {Object.keys(vehicleData[vehicleType]).map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
        )}

        {/* Model + Custom Input */}
        {brand && (
          <div>
            <label>Model</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={{ flex: 1, padding: '8px' }}
              >
                <option value="">-- Select Model --</option>
                {vehicleData[vehicleType][brand].map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Or type model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                style={{ flex: 1, padding: '8px' }}
              />
            </div>
          </div>
        )}

        {/* Body Style */}
        <div>
          <label>Body Style</label>
          <select
            value={bodyStyle}
            onChange={(e) => setBodyStyle(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="">-- Select Body Style --</option>
            <option value="Coupe">Coupe</option>
            <option value="Sedan">Sedan</option>
            <option value="Hatchback">Hatchback</option>
            <option value="SUV">SUV</option>
            <option value="Wagon">Wagon</option>
            <option value="Convertible">Convertible</option>
            <option value="Pickup Truck">Pickup Truck</option>
            <option value="Van">Van</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your build..."
            rows="4"
            style={{ width: '100%', padding: '10px' }}
          />
        </div>

        <button type="submit" style={{ padding: '10px', backgroundColor: '#111', color: 'white', border: 'none' }}>
          Submit Build
        </button>
      </form>
    </div>
  );
};

export default AddBuild;
