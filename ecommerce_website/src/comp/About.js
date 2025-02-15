import React, { useState, useEffect } from 'react';
import './about.css';
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const About = () => {
    const [cartCount, setCartCount] = useState(parseInt(localStorage.getItem('cartCount')) || 0); // Initialiser à partir de localStorage

    useEffect(() => {
        localStorage.setItem('cartCount', cartCount); // Sauvegarder l'état du panier dans localStorage
    }, [cartCount]);

    return (
        <div id="about-us" className="about-container">
            <h1>À propos de nous</h1>
            <section className="about-section">
                <h2>Notre Histoire</h2>
                <p>Bienvenue chez [Nom de Votre Entreprise], où innovation et artisanat se rencontrent. Fondée en [Année], notre aventure a commencé avec une passion pour la qualité et un engagement envers l'excellence. Au fil des ans, nous sommes passés d'une petite startup à un acteur de premier plan dans l'industrie [secteur], grâce au soutien de nos fidèles clients et au dévouement de notre équipe talentueuse.</p>
            </section>
            <section className="about-section">
                <h2>Notre Mission</h2>
                <p>Notre mission est simple : fournir des [produits/services] de la plus haute qualité qui dépassent les attentes de nos clients. Nous croyons au pouvoir de [valeurs ou principes clés, par exemple, durabilité, innovation, centration sur le client], et ces principes guident toutes nos actions.</p>
            </section>
            <section className="about-section">
                <h2>Notre Équipe</h2>
                <p>Chez [Nom de Votre Entreprise], nous sommes fiers de notre équipe diversifiée et talentueuse. Nos membres viennent de divers horizons et apportent une richesse d'expérience et de créativité. Ensemble, nous travaillons vers un objectif commun : offrir l'excellence dans tous les aspects de notre activité.</p>
            </section>
            <section className="about-section">
                <h2>Pourquoi Nous Choisir ?</h2>
                <ul>
                    <li><strong>Qualité :</strong> Nous nous engageons à utiliser uniquement les meilleurs matériaux et les technologies les plus récentes pour produire nos [produits/services].</li>
                    <li><strong>Innovation :</strong> Nous nous efforçons constamment d'innover et d'améliorer nos offres, afin de rester à la pointe de notre secteur.</li>
                    <li><strong>Service Client :</strong> Nos clients sont au cœur de tout ce que nous faisons. Nous nous engageons à fournir un service client exceptionnel et à garantir que chaque expérience avec nous soit positive.</li>
                </ul>
            </section>

            <section className="about-section">
                <h2>Contactez-nous</h2>
                <p>Nous aimons recevoir des nouvelles de nos clients ! Que vous ayez une question, un avis ou que vous vouliez simplement dire bonjour, n'hésitez pas à nous contacter à [Informations de Contact]. Vous pouvez également nous suivre sur [Liens des Réseaux Sociaux] pour rester informé des dernières actualités et offres.</p>
            </section>

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

export default About;
