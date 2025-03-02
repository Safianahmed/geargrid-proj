import React from 'react';
import '../styles.css';

const events = [
  {
    image: 'carevent1.jpg',
    name: 'Event 1',
    description: 'Description for Event 1',
    time: '10:00 AM - 2:00 PM',
    location: 'Location 1',
    theme: 'Theme 1'
  },
  {
    image: 'carevent2.jpg',
    name: 'Event 2',
    description: 'Description for Event 2',
    time: '3:00 PM - 6:00 PM',
    location: 'Location 2',
    theme: 'Theme 2'
  },
  // Add more events as needed
];

const Events = () => {
  return (
    <div className="events-container">
      {events.map((event, index) => (
        <div key={index} className="event">
          <img src={event.image} alt={event.name} className="event-image" />
          <div className="event-details">
            <h2 className="event-name">{event.name}</h2>
            <p className="event-description">{event.description}</p>
            <p className="event-time">{event.time}</p>
            <p className="event-location">{event.location}</p>
            <p className="event-theme">{event.theme}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Events;