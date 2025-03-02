// import React from "react";
// import Navbar from "./Navbar";
// import "../styles.css";

// const Home = () => {
//   return (
//     <div className="home-container">
//       <Navbar />
//       <div className="feed">
//         <h2>Welcome to GearGrid</h2>
//         <div className="post">
//           <img src="https://via.placeholder.com/600x400" alt="Post" />
//           <p>This is a sample post caption.</p>
//         </div>
//       </div>
//       <div className="right-sidebar">
//         <div className="profile">
//           <img src="https://via.placeholder.com/50" alt="Profile" className="profile-pic" />
//           <div className="profile-info">
//             <p className="username">yerr_its.ahmed</p>
//             <p className="switch"><a href="#">Switch</a></p>
//           </div>
//         </div>
//         <div className="suggestions">
//           <h4>Suggested for you</h4>
//           <ul>
//             <li><a href="#">User1</a></li>
//             <li><a href="#">User2</a></li>
//             <li><a href="#">User3</a></li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;


import React from "react";
import Navbar from "./Navbar";
import "../styles.css";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar /> {/* Navbar now correctly placed at the top */}
      <div className="hero">
        <h1>THE ONLY CAR EVENT PLATFORM YOU'LL EVER NEED</h1>
        <p>- BUILT FOR ENTHUSIASTS, BY ENTHUSIASTS</p>
        <img src="https://via.placeholder.com/800x400" alt="Landing" />

      </div>
    </div>
  );
};

export default Home;


