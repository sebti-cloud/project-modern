import React, { useState } from 'react';
import './TrackOrder.css';

const TrackOrder = () => {
  const [activeStep, setActiveStep] = useState(1);

  const handleStepClick = (step) => {
    setActiveStep(step);
  };

  return (
    <div className="main">
      <div className="head">
        <p className="head_1">Animated Step <span>Progress Bar</span></p>
        <p className="head_2">Using Html, Css & JavaScript</p>
      </div>

      <ul>
        <li onClick={() => handleStepClick(1)}>
          <div className={`progress one ${activeStep >= 1 ? 'active' : ''}`}>
            <i className="icon uil uil-capture"></i>
            <p>1</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Add To Cart</p>
        </li>
        <li onClick={() => handleStepClick(2)}>
          <div className={`progress two ${activeStep >= 2 ? 'active' : ''}`}>
            <i className="icon uil uil-clipboard-notes"></i>
            <p>2</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Fill Details</p>
        </li>
        <li onClick={() => handleStepClick(3)}>
          <div className={`progress three ${activeStep >= 3 ? 'active' : ''}`}>
            <i className="icon uil uil-credit-card"></i>
            <p>3</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Make Payment</p>
        </li>
        <li onClick={() => handleStepClick(4)}>
          <div className={`progress four ${activeStep >= 4 ? 'active' : ''}`}>
            <i className="icon uil uil-exchange"></i>
            <p>4</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Order in Progress</p>
        </li>
        <li onClick={() => handleStepClick(5)}>
          <div className={`progress five ${activeStep >= 5 ? 'active' : ''}`}>
            <i className="icon uil uil-map-marker"></i>
            <p>5</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Order Arrived</p>
        </li>
      </ul>
    </div>
  );
};

export default TrackOrder;
