import React, { useState } from 'react';
import { FaCartPlus, FaClipboardList, FaCreditCard, FaTruckLoading, FaMapMarkerAlt } from 'react-icons/fa';
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
            <FaCartPlus className="icon" />
            <p>1</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Add To Cart</p>
        </li>
        <li onClick={() => handleStepClick(2)}>
          <div className={`progress two ${activeStep >= 2 ? 'active' : ''}`}>
            <FaClipboardList className="icon" />
            <p>2</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Fill Details</p>
        </li>
        <li onClick={() => handleStepClick(3)}>
          <div className={`progress three ${activeStep >= 3 ? 'active' : ''}`}>
            <FaCreditCard className="icon" />
            <p>3</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Make Payment</p>
        </li>
        <li onClick={() => handleStepClick(4)}>
          <div className={`progress four ${activeStep >= 4 ? 'active' : ''}`}>
            <FaTruckLoading className="icon" />
            <p>4</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Order in Progress</p>
        </li>
        <li onClick={() => handleStepClick(5)}>
          <div className={`progress five ${activeStep >= 5 ? 'active' : ''}`}>
            <FaMapMarkerAlt className="icon" />
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
