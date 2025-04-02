import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../css/EditBuild.css';

const EditBuild = () => {
  const { id } = useParams(); // get build ID from URL
  const navigate = useNavigate();

  // state for build info
  const [build, setBuild] = useState({
    name: '',
    model: '',
    description: ''
  });

  // MOCK: fetch build data (replace with real fetch later)
  useEffect(() => {
    // Simulate backend call
    const fakeBuildData = {
      name: 'Porsche 911',
      model: 'GT3 RS',
      description: 'This is the editable description for the build.'
    };

    setBuild(fakeBuildData);
  }, [id]);

  const handleChange = (e) => {
    setBuild({ ...build, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // You’ll send a PUT request here next week
    console.log('Build to update:', build);
    navigate(`/build/${id}`); // or back to profile
  };

  return (
    <div className="edit-build-container">
      <h1>Edit Build</h1>
      <form onSubmit={handleSubmit} className="edit-build-form">
        <label>
          Car Name:
          <input
            type="text"
            name="name"
            value={build.name}
            onChange={handleChange}
          />
        </label>

        <label>
          Model:
          <input
            type="text"
            name="model"
            value={build.model}
            onChange={handleChange}
          />
        </label>

        <label>
          Description:
          <textarea
            name="description"
            value={build.description}
            onChange={handleChange}
          />
        </label>

        <button type="submit">Save Changes</button>
        <button type="button" onClick={() => navigate(-1)}>Cancel</button>
      </form>
    </div>
  );
};

export default EditBuild;
