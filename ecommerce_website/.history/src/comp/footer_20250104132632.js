import React from 'react';
import './footer.css';
import { FaHeadphonesAlt, FaPiggyBank, FaShippingFast, FaWallet, FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';

const Footer = ({ isAuthenticated }) => {
  const navigate = useNavigate();

  const handleAccountClick = (e) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className='footer'>
      <div className='container'>
        <div className='left-box'>
          <div className='box'>
            <div className='icon_box'>
              <FaPiggyBank />
            </div>
            <div className='detail'>
              <h3>Économies Incomparables</h3>
              <p>Profitez d'offres incroyables et économisez sur vos achats dès aujourd'hui.</p>
            </div>
          </div>

          <div className='box'>
            <div className='icon_box'>
              <FaShippingFast />
            </div>
            <div className='detail'>
              <h3>Livraison Gratuite</h3>
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
              <h3>Remboursement Garanti</h3>
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
              <h3>Votre Compte</h3>
              <ul>
                <li><Link to="/about">À propos de nous</Link></li>
                <li><Link to="/profile" onClick={handleAccountClick}>Compte</Link></li>
                <li><Link to="/payment">Paiement</Link></li>
                <li><Link to="/sales">Ventes</Link></li>
              </ul>
            </div>

            <div className='box'>
              <h3>Products</h3>
              <ul>
                <li><Link to="/delivery">Livraison</Link></li>
                <li><Link to="/track-order">Suivi de Commande</Link></li>
                <li><Link to="/top-products">Produits Phare</Link></li>
                <li><Link to="/old-product">Produits Ancien</Link></li>
              </ul>
            </div>

            <div className='box'>
              <h3>Contact</h3>
              <ul>
                <li>Hay Omar Beno El Khattab rue 16, Casablanca</li>
                <li>lahrechsimo732@gmail.com</li>
                <li>+212 6 07 89 92 54</li>
              </ul>
            </div>

            <div className='box'>
              <h3>Suivez-nous</h3>
              <div className='social_links'>
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                  <FaFacebook />
                </a>
                <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer">
                  <FaTwitter />
                </a>
                <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                  <FaInstagram />
                </a>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Copyright */}
      <div className='footer-copyright'>
        <p>© {new Date().getFullYear()} LAHRECH. Tous droits réservés.</p>
      </div>
    </div>
  );
};

export default Footer;
