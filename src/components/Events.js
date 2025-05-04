import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Events.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        
        const response = await fetch('http://localhost:3001/api/events' , {
          credentials: 'include',
        });
        
        const data = await response.json();
        if (data.success) {
          setEvents(data.events);
        } else {
          console.error('Failed to fetch events:', data.message);
        }
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="events-page">
      <h1 className="events-title">🔥 Upcoming Car Events</h1>

      <div className="events-container">
        {events.map((event, index) => (
          <div key={index} className="event">
            <img src={event.image_url} alt={event.name} className="event-image" />
            <div className="event-details">
              <h2 className="event-name">{event.name}</h2>
              <p className="event-description">{event.description}</p>
              <div className="event-info">
                <span>⏰ {event.time}</span>
                <span>📍 {event.location}</span>
                <span>👥 {event.attendees}</span>
                <span>🏆 {event.organizer}</span>
              </div>
              <button
                className="register-button"
                onClick={() => navigate("/register", { state: { event } })} 
              >
                Register Now 🚗
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;
