import React from 'react';
import './about.css';

const About = () => {
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
                <h2>Contact Us</h2>
                <p>We love to hear from our customers! Whether you have a question, feedback, or just want to say hello, feel free to reach out to us at [Contact Information]. You can also follow us on [Social Media Links] to stay updated on the latest news and offers.</p>
            </section>
        </div>
    );
};

export default About;
