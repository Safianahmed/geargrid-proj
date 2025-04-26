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
  
  // if not found, display message 
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
        setComments([...comments, { text: comment, stars: rating }]);
        setComment(""); //reset comment box
        setRating(0); //reset rating
      }
    };
    
    return (
      <div className="business-detail-container">
        {/* display the banner image */}
        <img
          src={business.image_url} // use the banner URL from the business object
          alt={`${business.category} banner`}
          className="business-banner"
        />
        {/* display business details */}
        <h1>{business.name}</h1>
        <p><strong>Category:</strong> {business.category}</p>
        <p><strong>Address:</strong> {business.address}</p>
        <p>{business.description}</p>
  
         {/* review submission section */}
        <div className="review-section">
          <h3>Leave a Review</h3>

          {/* star rating */}
          <div className="star-rating">
            {[...Array(5)].map((_, index) => {
              const starValue = index + 1;
              return (
                <button
                  key={index}
                  className={starValue <= (hover || rating) ? "on" : "off"}
                  onClick={() => setRating(starValue)}  // set rating
                  onMouseEnter={() => setHover(starValue)}  //highlight on hover 
                  onMouseLeave={() => setHover(0)}      // unhighlight when mouse leaves 
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
            <button type="submit">Submit</button>
          </form>
  
          {/* display list of submitted comments */}
          <div className="comments-section">
            <h4>Comments</h4>
            {comments.length === 0 ? (
              <p>No comments yet.</p>
            ) : (
              comments.map((c, idx) => (
                <div key={idx} className="comment">
                  <p>{c.text}</p>
                  <div>{"★".repeat(c.stars)}</div> {/* show star rating next to comment */}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };
  
  export default BusinessDetail;