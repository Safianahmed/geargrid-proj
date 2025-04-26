import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../css/RegisterEvent.css";

const RegisterEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const event = location.state?.event;

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    make: "",
    model: "",
    year: "",
    color: "",
    mileage: "",
    modified: "",
    clubMember: "",
    agree: false,
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Simulate checking for duplicate registration via localStorage
    const key = `event_${event.name}_email_${formData.email}`;
    if (localStorage.getItem(key)) {
      setError("🚫 This email has already been used to register for this event.");
      return;
    }

    // Simulate saving to database by storing in localStorage
    localStorage.setItem(key, JSON.stringify(formData));
    setSuccess(true);
  };

  if (!event) return <p>No event selected.</p>;

  return (
    <div className="register-event-container wide">
      <div className="register-card wide-card">
        {!success ? (
          <>
            <h2 className="wide-title">Register for {event.name}</h2>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="register-form two-column">
              {[
                ["firstName", "First Name"],
                ["lastName", "Last Name"],
                ["email", "Email"],
                ["phone", "Phone"],
                ["make", "Car Make"],
                ["model", "Car Model"],
                ["color", "Color"],
                ["mileage", "Mileage"],
              ].map(([name, label]) => (
                <div key={name} className="form-group">
                  <label>{label}:</label>
                  <input
                    type={name === "email" ? "email" : name === "mileage" ? "number" : "text"}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              <div className="form-group">
                <label>Year:</label>
                <select name="year" value={formData.year} onChange={handleChange} required>
                  <option value="">Select Year</option>
                  {[...Array(40)].map((_, i) => {
                    const year = 2024 - i;
                    return <option key={year} value={year}>{year}</option>;
                  })}
                </select>
              </div>

              <div className="form-group full-width">
                <label>Is this a modified vehicle?</label>
                <div className="radio-group">
                  <label><input type="radio" name="modified" value="Yes" onChange={handleChange} required /> Yes</label>
                  <label><input type="radio" name="modified" value="No" onChange={handleChange} /> No</label>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Are you part of a car club?</label>
                <div className="radio-group">
                  <label><input type="radio" name="clubMember" value="Yes" onChange={handleChange} required /> Yes</label>
                  <label><input type="radio" name="clubMember" value="No" onChange={handleChange} /> No</label>
                </div>
              </div>

              <div className="form-group full-width checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="agree"
                    checked={formData.agree}
                    onChange={handleChange}
                    required
                  /> I agree to have my build featured publicly if selected
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">Submit</button>
                <button type="button" className="cancel-btn" onClick={() => window.history.back()}>Cancel</button>
              </div>
            </form>
          </>
        ) : (
          <div className="confirmation-box receipt">
            <h2>✅✅ Registration Confirmed!</h2>
            <p>Thank you, <strong>{formData.firstName} {formData.lastName}</strong>.</p>
            <p>You're officially registered for <strong>{event.name}</strong>.</p>
            <div className="receipt-details">
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Phone:</strong> {formData.phone}</p>
              <p><strong>Event Date:</strong> {event.time}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Car:</strong> {formData.year} {formData.make} {formData.model} ({formData.color})</p>
              <p><strong>Mileage:</strong> {formData.mileage} miles</p>
              <p><strong>Modified Vehicle:</strong> {formData.modified}</p>
              <p><strong>Car Club Member:</strong> {formData.clubMember}</p>
              <p><strong>Consent to Feature:</strong> {formData.agree ? "Yes" : "No"}</p>
            </div>
            <button className="submit-btn" onClick={() => navigate("/events")}>Back to Events</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterEvent;
