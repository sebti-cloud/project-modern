import React from 'react';
import './footer.css';
import { FaHeadphonesAlt, FaPiggyBank, FaShippingFast, FaWallet } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className='footer'>
      <div className='container'>
        <div className='left-box'>
          <div className='box'>
            <div className='icon_box'>
              <FaPiggyBank />
            </div>
            <div className='detail'>
                <h3>Great Saving</h3>
                <p>Lorem ipsum dolor sit amet</p>
            </div>
          </div>

          <div className='box'>
            <div className='icon_box'>
              <FaShippingFast />
            </div>
            <div className='detail'>
                <h3>Free delivery</h3>
                <p>Lorem ipsum dolor sit amet</p>
            </div>
          </div>

          <div className='box'>
            <div className='icon_box'>
              <FaHeadphonesAlt/>
            </div>
            <div className='detail'>
                <h3>24/7</h3>
                <p>Lorem ipsum dolor sit amet</p>
            </div>
          </div>

          <div className='box'>
            <div className='icon_box'>
              <FaWallet />
            </div>
            <div className='detail'>
                <h3>Money back</h3>
                <p>Lorem ipsum dolor sit amet</p>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default Footer;
