// remodeled for testing purposes
// This component allows users to add a car build with various details and modifications.
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const carData = {
  BMW: ['M3', 'M4 Competition'],
  Porsche: ['911 GT3 RS', 'Cayman S'],
  Toyota: ['Supra MK5', 'Supra MK4'],
  Nissan: ['GTR R35']
};

const exteriorMods = [
  'Widebody Kit',
  'Carbon Fiber Hood',
  'Spoiler',
  'Aftermarket Bumper',
  'Underglow Lights'
];

const AddBuild = () => {
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMods, setSelectedMods] = useState([]);
  const [userId] = useState(1); 
  const navigate = useNavigate();

  const handleModChange = (mod) => {
    setSelectedMods((prev) =>
      prev.includes(mod) ? prev.filter((m) => m !== mod) : [...prev, mod]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mods = {
      Exterior: selectedMods.map(mod => ({
        mod_name: mod,
        image_url: '',
        mod_note: ''
      }))
    };

    const formData = new FormData();
    formData.append('user_id', userId);
    formData.append('car_name', brand);
    formData.append('model', model);
    formData.append('description', description);
    formData.append('mods', JSON.stringify(mods));

    try {
      await axios.post('http://localhost:3001/api/builds', formData);
      navigate('/profile');
    } catch (err) {
      console.error('Submit Error:', err.response?.data || err.message);
      alert('Failed to submit build');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '500px', width: '100%' }}>
        <h2 style={{ textAlign: 'center' }}>Add a Car Build</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label>Car Brand</label>
          <select value={brand} onChange={(e) => {
            setBrand(e.target.value);
            setModel('');
          }} required style={{ width: '100%', marginBottom: '1rem' }}>
            <option value="">-- Select Brand --</option>
            {Object.keys(carData).map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <label>Car Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} required disabled={!brand}
            style={{ width: '100%', marginBottom: '1rem' }}>
            <option value="">-- Select Model --</option>
            {brand && carData[brand].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: '100%', marginBottom: '1rem' }}
          />

          <h4>Exterior Mods</h4>
          {exteriorMods.map((mod) => (
            <div key={mod}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedMods.includes(mod)}
                  onChange={() => handleModChange(mod)}
                />{' '}
                {mod}
              </label>
            </div>
          ))}

          <br />
          <button type="submit" style={{ marginTop: '1rem' }}>Submit Build</button>
        </form>
      </div>
    </div>
  );
};

export default AddBuild;
