import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/AddBuild.css';

const carOptions = [
  { make: "Porsche", model: "911 GT3 RS" },
  { make: "Nissan", model: "GTR R35" },
  { make: "BMW", model: "M4 Competition" },
  { make: "Toyota", model: "Supra MK5" }
];

const presetCategories = [
  {
    name: "Performance",
    mods: [
      "ECU Tune", "Turbo Upgrade", "Cold Air Intake", "Exhaust System"
    ]
  },
  {
    name: "Exterior",
    mods: [
      "Carbon Fiber Hood", "Widebody Kit", "Rear Diffuser", "Spoiler"
    ]
  },
  {
    name: "Interior",
    mods: [
      "Bucket Seats", "Roll Cage", "Steering Wheel", "Shift Knob"
    ]
  }
];

const AddBuild = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    description: '',
    selectedMods: {},
    gallery: []
  });

  const handleCarChange = (e) => {
    const [make, model] = e.target.value.split('|');
    setFormData({ ...formData, make, model });
  };

  const handleDescriptionChange = (e) => {
    setFormData({ ...formData, description: e.target.value });
  };

  const handleModToggle = (category, mod) => {
    const currentMods = formData.selectedMods[category] || [];
    const updatedMods = currentMods.includes(mod)
      ? currentMods.filter(m => m !== mod)
      : [...currentMods, mod];

    setFormData({
      ...formData,
      selectedMods: { ...formData.selectedMods, [category]: updatedMods }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting Build:', formData);

    // You'll send this to backend next week
    navigate('/profile');
  };

  return (
    <div className="add-build-container">
      <h1>Add a New Car Build</h1>
      <form className="add-build-form" onSubmit={handleSubmit}>
        <label>
          Select Car:
          <select onChange={handleCarChange} defaultValue="">
            <option value="" disabled>Select a car</option>
            {carOptions.map((car, index) => (
              <option key={index} value={`${car.make}|${car.model}`}>
                {car.make} {car.model}
              </option>
            ))}
          </select>
        </label>

        <label>
          Description:
          <textarea value={formData.description} onChange={handleDescriptionChange} />
        </label>

        <div className="mod-section">
          <h2>Choose Mods by Category</h2>
          {presetCategories.map((category, i) => (
            <div key={i} className="mod-category">
              <h3>{category.name}</h3>
              <div className="mod-options">
                {category.mods.map((mod, j) => (
                  <label key={j}>
                    <input
                      type="checkbox"
                      checked={formData.selectedMods[category.name]?.includes(mod) || false}
                      onChange={() => handleModToggle(category.name, mod)}
                    />
                    {mod}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* For now skip image upload, add later */}
        <button type="submit">Create Build</button>
      </form>
    </div>
  );
};

export default AddBuild;
