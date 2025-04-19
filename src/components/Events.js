import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Events.css";

// const events = [
//   {
//     image: "carevent1.jpg",
//     name: "Classic Car Meet",
//     description: "Join us for a nostalgic gathering of vintage car lovers, where classic muscle cars, lowriders, and restored beauties take center stage.",
//     time: "10:00 AM - 2:00 PM",
//     location: "📍 Sunset Park, CA",
//     theme: "🚗 Classic Cars",
//     attendees: "500+ Registered",
//     organizer: "Hosted by Classic Car Club",
//   },
//   {
//     image: "carevent2.jpg",
//     name: "Tuner Expo 2024",
//     description: "The biggest showcase of modified imports, street racers, and custom-built track beasts. Meet top tuners and see jaw-dropping mods!",
//     time: "3:00 PM - 6:00 PM",
//     location: "📍 Downtown LA",
//     theme: "🏁 Tuner Cars",
//     attendees: "1.2K Registered",
//     organizer: "Organized by Speed Society",
//   },
//   {
//     image: "carevent3.jpg",
//     name: "Supercar Rally",
//     description: "An exclusive rally where luxury and performance meet. Get a chance to drive alongside some of the world's most iconic supercars.",
//     time: "7:00 PM - 10:00 PM",
//     location: "🏎️ Beverly Hills",
//     theme: "💎 Supercars",
//     attendees: "Limited to 50 Owners",
//     organizer: "Presented by Luxury Motors Club",
//   },
// ];

const Events = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const token = localStorage.getItem('token'); //retrives the token
        if (!token) {
          console.error('No token found.');
          return;
        }

        const response = await fetch('http://localhost:3001/api/events' , {
          headers: {
            Authorization: `Bearer ${token}` //adds the token to the header of the request
          }
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
                onClick={() => navigate("/register")} 
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
