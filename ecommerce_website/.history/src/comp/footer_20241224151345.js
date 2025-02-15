import React from 'react';
import './footer.css';
import { FaHeadphonesAlt, FaPiggyBank, FaShippingFast, FaWallet } from 'react-icons/fa';
import { Link } from 'react-router-dom';

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
                            <p>Profitez d'offres incroyables et économisez sur vos achats dès aujourd'hui.</p>
                        </div>
                    </div>

                    <div className='box'>
                        <div className='icon_box'>
                            <FaShippingFast />
                        </div>
                        <div className='detail'>
                            <h3>Free delivery</h3>
                            <p>Recevez vos commandes sans frais supplémentaires grâce à notre livraison gratuite.</p>
                        </div>
                    </div>

                    <div className='box'>
                        <div className='icon_box'>
                            <FaHeadphonesAlt />
                        </div>
                        <div className='detail'>
                            <h3>24/7</h3>
                            <p>Notre service client est disponible 24 heures sur 24, 7 jours sur 7, pour répondre à toutes vos questions.</p>
                        </div>
                    </div>

                    <div className='box'>
                        <div className='icon_box'>
                            <FaWallet />
                        </div>
                        <div className='detail'>
                            <h3>Money back</h3>
                            <p>Bénéficiez d'une garantie de remboursement si vous n'êtes pas satisfait de votre achat.</p>
                        </div>
                    </div>
                </div>

                <div className='right_box'>
                    <div className='header'>
                        <img src='image/logo.jpg' alt=''></img>
                        <p>Bienvenue chez <span>TECHYO</span>, où la qualité et la satisfaction du client sont notre priorité. Explorez notre gamme variée de produits et découvrez des offres exceptionnelles chaque jour. N'hésitez pas à nous contacter pour toute question ou besoin d'assistance. Merci de nous faire confiance !</p>
                    </div>
                    <div className='bottom'>
                        <div className='box'>
                            <h3>Your Account</h3>
                            <ul>
                                <li><Link to="/about">About us</Link></li>
                                <li><Link to="/account">Account</Link></li>
                                <li><Link to="/payment">Payment</Link></li>
                                <li><Link to="/sales">Sales</Link></li>
                            </ul>
                        </div>

                        <div className='box'>
                            <h3>Products</h3>
                            <ul>
                                <li><Link to="/delivery">Delivery</Link></li>
                                <li><Link to="/track-order">Track Order</Link></li>
                                <li><Link to="/top-products">Top Product</Link></li>
                                <li><Link to="/old-product">Old Product</Link></li>
                            </ul>
                        </div>

                        <div className='box'>
                            <h3>Contact</h3>
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
