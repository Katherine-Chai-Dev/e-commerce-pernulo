import React, { useEffect, useRef, useState } from "react";
import "./Slider.css";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(1); 
  const [isTransitioning, setIsTransitioning] = useState(true);
  const intervalRef = useRef(null);

  const slideData = [
    {
      image: "/images/slider1.jpeg",
      title: "Elegant Pearl Collection",
      subtitle: "Discover timeless beauty",
      position: "center"
    },
    {
      image: "/images/slider5.png",
      title: "Handcrafted Jewelry",
      subtitle: "Made with love and care",
      position: "top-left"
    },
    {
      image: "/images/slider3.jpeg",
      title: "Luxury Designs",
      subtitle: "For every special moment",
      position: "bottom-right"
    },
    {
      image: "/images/slider7.png",
      title: "Premium Quality",
      subtitle: "Excellence in every detail",
      position: "top-right"
    },
    {
      image: "/images/slider3.png",
      title: "Natural Pearls",
      subtitle: "Authentic and rare",
      position: "bottom-left"
    }
  ];

 
  const extendedSlides = [
    slideData[slideData.length - 1], 
    ...slideData,                     
    slideData[0]                      
  ];


  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev + 1);
    }, 4000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);


  useEffect(() => {
    if (currentSlide === extendedSlides.length - 1) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(1);
      }, 600); 
    } else if (currentSlide === 0) {
      setTimeout(() => {
        setIsTransitioning(false);
        setCurrentSlide(slideData.length);
      }, 600);
    }
  }, [currentSlide, extendedSlides.length, slideData.length]);


  const handleDotClick = (index) => {
    setIsTransitioning(true);
    setCurrentSlide(index + 1); 
    

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setIsTransitioning(true);
      setCurrentSlide((prev) => prev + 1);
    }, 4000);
  };


  const getRealIndex = () => {
    if (currentSlide === 0) return slideData.length - 1;
    if (currentSlide === extendedSlides.length - 1) return 0;
    return currentSlide - 1;
  };

  return (
    <div>
      <div className="slider">
        <div 
          className="slides"
          style={{ 
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: isTransitioning ? 'transform 0.6s ease-in-out' : 'none'
          }}
        >
          {extendedSlides.map((slide, index) => (
            <div 
              key={index} 
              className="slide-wrapper"
            >
              <img src={slide.image} className="slide" alt={slide.title} />
              <div className={`slide-text-overlay position-${slide.position}`}>
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-subtitle">{slide.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="indicators">
        {slideData.map((_, index) => (
          <span 
            key={index} 
            className={`dot ${index === getRealIndex() ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
}

export default Slider;
