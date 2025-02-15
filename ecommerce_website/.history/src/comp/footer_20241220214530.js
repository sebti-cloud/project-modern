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
                                <li to='About.js'>About us</li>
                                <li>Account</li>
                                <li>Payment</li>
                                <li>Sales</li>

                            </ul>
                        </div>

                        <div className='box'>
                            <h3>Products</h3>
                            <ul>
                                <li>Delivery</li>
                                <li>Track Order</li>
                                <li>New Product</li>
                                <li>Old Product</li>

                            </ul>
                        </div>

                        <div className='box'>
                            <h3>Your Account</h3>
                            <ul>
                                <li>Hay omar beno el khattab rue 16, Casablanca</li>
                                <li>lahrechsimo732@gmail.com</li>
                                <li>+212 6 07 89 92 54</li>
                                

                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
