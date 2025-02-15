import React, { useState, useEffect } from 'react';
import './delivery.css';
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from 'react-router-dom';

const Delivery = () => {
  const [cartCount, setCartCount] = useState(parseInt(localStorage.getItem('cartCount')) || 0); // Initialiser à partir de localStorage

  useEffect(() => {
    localStorage.setItem('cartCount', cartCount); // Sauvegarder l'état du panier dans localStorage
  }, [cartCount]);

  return (
    <div className="delivery">
      <div className="banner">
        <h2>Informations de Livraison</h2>
        <p>Découvrez tout sur nos options de livraison et suivez votre commande.</p>
      </div>
      <div className="options">
        <h3>Options de Livraison</h3>
        <ul>
          <li>
            <h4>Livraison Standard</h4>
            <p>Livraison sous 5 à 7 jours ouvrables.</p>
          </li>
          <li>
            <h4>Livraison Express</h4>
            <p>Livraison sous 2 à 3 jours ouvrables.</p>
          </li>
          <li>
            <h4>Livraison le Jour Suivant</h4>
            <p>Livraison le jour ouvrable suivant.</p>
          </li>
        </ul>
      </div>
      <div className="faq">
        <h3>Questions Fréquemment Posées</h3>
        <ul>
          <li>
            <h4>Quels sont les frais de livraison ?</h4>
            <p>Les frais de livraison varient en fonction de l'option de livraison choisie et de la localisation.</p>
          </li>
          <li>
            <h4>Puis-je changer mon adresse de livraison ?</h4>
            <p>Oui, vous pouvez changer votre adresse de livraison avant l'expédition de la commande.</p>
          </li>
          <li>
            <h4>Que faire si ma commande est retardée ?</h4>
            <p>Si votre commande est retardée, veuillez contacter notre équipe de support pour obtenir de l'aide.</p>
          </li>
        </ul>
      </div>
      <div className="contact">
        <h3>Besoin d'Aide ?</h3>
        <p>Si vous avez des questions sur la livraison, veuillez contacter notre équipe de support à <a href="mailto:TechyoSupport@gmail.com">TechyoSupport@gmail.com</a> ou appelez-nous au <a href="tel:0523746094">0523746094</a>.</p>
      </div>

      {/* Icône fixe du panier */}
      {cartCount > 0 && (
        <Link to="/cart">
          <div className="cart-icon">
            <AiOutlineShoppingCart />
            <span className="cart-count">{cartCount}</span>
          </div>
        </Link>
      )}
    </div>
  );
};

export default Delivery;
