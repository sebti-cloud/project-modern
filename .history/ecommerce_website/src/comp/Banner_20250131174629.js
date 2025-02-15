import React from 'react';

const Banner = ({ image, link }) => {
  return (
    <div className="banner">
      <a href={link} target="_blank" rel="noopener noreferrer">
        <img src={image} alt="Banner" />
      </a>
    </div>
  );
};

export default Banner;
