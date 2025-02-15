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
                            <FaHeadphonesAlt />
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

                <div className='right_box'>
                    <div className='header'>
                        <img src='image/logo.jpg' alt=''></img>
                        <p>Lorem ipsum dolor sit amet, consectetur Nulicing elit. Duis facubius donna la koda cipo la metorda vica, topo nla cimude</p>
                    </div>
                    <div className='bottom'>
                        <div className='box'>
                            <h3>Your Account</h3>
                            <ul>
                                <li><a href="#about-us">About us</a></li>
                                <li><a href="#account">Account</a></li>
                                <li><a href="#payment">Payment</a></li>
                                <li><a href="#sales">Sales</a></li>
                            </ul>
                        </div>

                        <div className='box'>
                            <h3>Products</h3>
                            <ul>
                                <li><a href="#delivery">Delivery</a></li>
                                <li><a href="#track-order">Track Order</a></li>
                                <li><a href="#new-product">New Product</a></li>
                                <li><a href="#old-product">Old Product</a></li>
                            </ul>
                        </div>

                        <div className='box'>
                            <h3>Contact</h3>
                            <ul>
                                <li><a href="#contact-address">Hay omar beno el khattab rue 16, Casablanca</a></li>
                                <li><a href="#contact-email">lahrechsimo732@gmail.com</a></li>
                                <li><a href="#contact-phone">+212 6 07 89 92 54</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
