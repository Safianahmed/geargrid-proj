import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/CarBuild.css';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import carImage1 from '../images/911_GT3_R_.avif';
import carImage2 from '../images/interior.jpeg';
import carImage3 from '../images/turbo.jpg.webp';
import carImage4 from '../images/ECUtune.jpg.webp';
import carImage5 from '../images/fiberhood.jpg';

const CarBuild = ({ car }) => {
    const navigate = useNavigate();
    
    const defaultCar = {
        name: "Porsche 911",
        model: "GT3 RS",
        images: [
            carImage1, 
            carImage2
        ],
        description: "This build showcases a high-performance Porsche 911 GT3 RS with carefully selected modifications to enhance both aesthetics and performance.",
        categories: [
            {
                name: "Performance Upgrades",
                mods: [
                    { name: "Turbo Upgrade", description: "Increased boost pressure", image: carImage3 },
                    { name: "ECU Tune", description: "Improved fuel mapping", image: carImage4 }
                ]
            },
            {
                name: "Exterior Mods",
                mods: [
                    { name: "Carbon Fiber Hood", description: "Lighter weight for better performance", image: carImage5 }
                ]
            }
        ],
        gallery: [
            "https://via.placeholder.com/300x200?text=Gallery+Image+1",
            "https://via.placeholder.com/300x200?text=Gallery+Image+2",
            "https://via.placeholder.com/300x200?text=Gallery+Image+3",
            "https://via.placeholder.com/300x200?text=Gallery+Image+4",
            "https://via.placeholder.com/300x200?text=Gallery+Image+5",
            "https://via.placeholder.com/300x200?text=Gallery+Image+6"
        ]
    };

    const carData = car || defaultCar;

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,  
        slidesToScroll: 1,
        adaptiveHeight: true,
        responsive: [
            {
                breakpoint: 768, // For mobile, show 1 image
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };    

    return (
        <div className="car-build-page">
            <div className="car-header">
                <h1>{carData.name} {carData.model}</h1>
            </div>
            
            <Slider {...settings} className="car-image-slider">
                {carData.images.map((image, index) => (
                    <div key={index} className="slider-item">
                        <img src={image} alt={`Car build ${index}`} className="car-image" />
                    </div>
                ))}
            </Slider>

            <button className="edit-button">Edit Build</button>
            
            <div className="description-section">
                <h2 className="section-title">Description</h2>
                <textarea className="car-description" defaultValue={carData.description} />
            </div>

            <div className="modifications">
                {carData.categories.map((category, index) => (
                    <div key={index} className="category">
                        <h2>{category.name}</h2>
                        <div className="mods-container">
                            {category.mods.map((mod, modIndex) => (
                                <div key={modIndex} className="mod-item">
                                    <img src={mod.image} alt={mod.name} className="mod-image" />
                                    <div className="mod-info">
                                        <h3>{mod.name}</h3>
                                        <p>{mod.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="gallery-section">
                <h2 className="gallery-title">Gallery</h2>
                <div className="gallery-grid">
                    {carData.gallery.map((image, index) => (
                        <img key={index} src={image} alt={`Gallery ${index}`} className="gallery-image" />
                    ))}
                </div>
            </div>

            <button className="username-button" onClick={() => navigate('/profile')}>Back to Profile</button>
        </div>
    );
};

export default CarBuild;
