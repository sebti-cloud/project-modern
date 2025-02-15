import React from 'react';
import './Slider.css';

const Slider = ({ slides }) => {
  return (
    <div className="slider">
      {slides.map((slide, index) => (
        <div key={index} className="slide">
          <img src={slide.image_url} alt={`Slide ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default Slider;
