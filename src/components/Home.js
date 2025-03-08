import React, { useEffect } from "react";
import "../css/Home.css"; 

const Home = () => {
  useEffect(() => {
    document.body.classList.add("home-page"); 
    return () => document.body.classList.remove("home-page"); 
  }, []);

  return (
    <div className="home-container">
      <div className="overlay"></div> 
      <div className="content">
        <h1 className="fade-in">GEARGRID</h1>
        <h2 className="fade-in">THE ONLY CAR EVENT PLATFORM YOU’LL EVER NEED</h2>
        <p className="fade-in">THE FUTURE OF CAR EVENTS & COMMUNITY</p>
        <p className="fade-in last-line">—BUILT FOR ENTHUSIASTS, BY ENTHUSIASTS.</p>
      </div>
    </div>
  );
};

export default Home;
