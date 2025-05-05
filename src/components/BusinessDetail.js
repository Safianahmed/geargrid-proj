// src/components/BusinessDetail.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../css/BusinessDetail.css";

// hardcoded sample businesses
// const businesses = [
//   {
//     name: "Joe's Auto Repair",
//     category: "Automotive",
//     address: "123 Main St, USA",
//     description: "Expert auto repair services.",
//   },
//   {
//     name: "Good Year",
//     category: "Automotive",
//     address: "1234 Main St, USA",
//     description: "Expert auto repair services.",
//   },
//   {
//     name: "Michelin",
//     category: "Manufacturing",
//     address: "12345 Main St, USA",
//     description: "Tires and car products.",
//   },
// ];

// main component for displaying individual business page
const BusinessDetail = () => {
  const { name } = useParams();
  const [business, setBusiness] = useState(null);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/businesses/${encodeURIComponent(name)}`);
        const data = await response.json();
        if (data.success) {
          setBusiness(data.business);
        } else {
          console.error('Failed to fetch business:', data.message);
        }
      } catch (error) {
        console.error('Error fetching business:', error);
      }
    };

    fetchBusiness();
  }, [name]);
  
  // if business not found, display message 
  if (!business) {
    return <h2>Business not found</h2>;
  }

  // // map business categories to corresponding banner image paths
  // const categoryBanners = {
  //   Automotive: "/banners/automotive.jpg",
  //   Manufacturing: "/banners/manufacture.jpg",
  //   "Home Services": "/banners/homeservice.webp",
  // };
  
  // // dynamically select banner image based on business category
  // const bannerSrc = categoryBanners[business.category] || "/banners/default.jpg";
    
  // handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();

    // add comment to comments if not empty
    if (comment.trim()) {
      const newComment = { text: comment, stars: rating, image: image ? URL.createObjectURL(image) : null }; //create temporary url if image uploaded
      setComments([...comments, newComment]);
      setComment(""); //reset comment box
      setRating(0); //reset rating
      setImage(null); //reset uploaded image
    }
  };

    // calculate average rating based on submitted reviews
    const averageRating = comments.length > 0
    ? (comments.reduce((sum, c) => sum + c.stars, 0) / comments.length).toFixed(1)
    : "0"; // if no comments show 0

  return (
    <div className="business-detail-container">
      {/* display the banner image */}
      <img
        src={business.image_url || "/banners/default.jpg"} // use the banner URL from the business object
        alt={`${business.category} banner`}
        className="business-banner"
      />

      {/* display business details */}
      <h1>{business.name}</h1>
      <p><strong>Category:</strong> {business.category}</p>
      <p><strong>Address:</strong> {business.address}</p>
      <p>{business.description}</p>

      {/* services List */}
      <div className="services-list">
        <h3>Services Offered</h3>
        {business.services ? (
          <ul>
            {business.services.split(',').map((service, idx) => (
              <li key={idx}>{service.trim()}</li> // split services string into list
            ))}
          </ul>
        ) : (
          <p>No services listed.</p>
        )}
      </div>

      {/* <div className="rating-overview">
        Average Rating: {averageRating} out of 5
      </div> */}

      {/* section to submit a review */}
      <div className="review-section">
        <h3>Leave a Review</h3>

        {/* star rating selection */}
        <div className="star-rating">
          {[...Array(5)].map((_, index) => {
            const starValue = index + 1;
            return (
              <button
                key={index}
                className={starValue <= (hover || rating) ? "on" : "off"} // color star gold if hovered or clicked
                onClick={() => setRating(starValue)}  // set rating
                onMouseEnter={() => setHover(starValue)}  //highlight on hover
                onMouseLeave={() => setHover(0)}  // unhighlight when mouse leaves
              >
                ★
              </button>
            );
          })}
        </div>

        {/* comment input form */}
        <form onSubmit={handleCommentSubmit}>
          <textarea
            placeholder="Write a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}  //update comment state as user types
            required
          ></textarea>

          {/* upload optional image */}
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button type="submit">Submit Review</button>
        </form>
      </div>

      {/* section to display reviews */}
      <div className="comments-section">
        <h3>Reviews</h3>

          {/* reviews summary showing average rating */}
        <div className="reviews-summary">
          <div className="average-rating">
            <h1>{averageRating} <span>out of 5</span></h1>
            <p>{comments.length} Ratings</p>
          </div>
        </div>

        {/* if no reviews yet */}
        {comments.length === 0 ? (
          <p>No comments yet.</p>
        ) : (
          <div className="reviews-grid">
            {/* display each review card */}
            {comments.map((c, idx) => (
              <div key={idx} className="review-card">
                <div className="review-header">
                  <div className="stars">{"★".repeat(c.stars)}{"☆".repeat(5 - c.stars)}</div> {/* show filled and empty stars */}
                  <div className="review-date">{new Date().toLocaleDateString()}</div> {/* temporary todays date */}
                </div>
                <p className="review-text">{c.text}</p>
                {/* display uploaded image if exists */}
                {c.image && <img src={c.image} alt="Review Upload" className="review-image" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessDetail;
