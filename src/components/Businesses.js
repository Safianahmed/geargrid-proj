import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "../css/Businesses.css";

const businesses = [
  {
    name: "Joe's Auto Repair",
    category: "Automotive",
    address: "123 Main St, USA",
    description: "Expert auto repair services.",
  },
  {
    name: "Good Year",
    category: "Automotive",
    address: "1234 Main St, USA",
    description: "Expert auto repair services.",
  },
  {
    name: "Michelin",
    category: "Manufacturing",
    address: "12345 Main St, USA",
    description: "Tires and car products.",
  },
];

const Businesses = () => {
  const [address, setAddress] = useState("");
  const [category, setCategory] = useState("");
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleSearch = () => {
    const filtered = businesses.filter(
      (business) => business.category.toLowerCase() === category.toLowerCase()
    );
    setFilteredBusinesses(filtered);
  };

  return (
    <div className="businesses-container">
      <h2>Find a Business</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Enter your address"
          value={address}
          onChange={handleAddressChange}
          className="address-input"
        />
        <select
          value={category}
          onChange={handleCategoryChange}
          className="category-select"
          required
        >
          <option value="">Select a service category</option>
          <option value="Automotive">Automotive</option>
          <option value="Home Services">Home Services</option>
          <option value="Manufacturing">Manufacturing</option>
        </select>
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      <div className="businesses-list">
      {filteredBusinesses.map((business, index) => (
        <div key={index} className="business-card">
          <h3>
            <Link to={`/businesses/${encodeURIComponent(business.name)}`}> {/* link to the individual business page using business name */}
              {business.name}
            </Link>
          </h3>
          <p>
            <strong>Category:</strong> {business.category}
          </p>
          <p>
            <strong>Address:</strong> {business.address}
          </p>
          <p>{business.description}</p>
        </div>
      ))}

      </div>
    </div>
  );
};

export default Businesses;