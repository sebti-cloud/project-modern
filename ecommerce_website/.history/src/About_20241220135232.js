import React from 'react';
import './about.css';

const About = () => {
    return (
        <div className="about-container">
            <h1>About Us</h1>
            <section className="about-section">
                <h2>Our Story</h2>
                <p>Welcome to [Your Company Name], where innovation meets craftsmanship. Founded in [Year], our journey began with a passion for quality and a commitment to excellence. Over the years, we've grown from a small startup into a leading player in the [industry/sector] industry, thanks to the support of our loyal customers and the dedication of our talented team.</p>
            </section>
            <section className="about-section">
                <h2>Our Mission</h2>
                <p>Our mission is simple: to provide the highest quality [products/services] that exceed our customers' expectations. We believe in the power of [key values or principles, e.g., sustainability, innovation, customer-centricity], and these principles guide everything we do.</p>
            </section>
            <section className="about-section">
                <h2>Our Team</h2>
                <p>At [Your Company Name], we are proud of our diverse and talented team. Our team members come from various backgrounds and bring a wealth of experience and creativity to the table. Together, we work towards a common goal of delivering excellence in every aspect of our business.</p>
            </section>
            <section className="about-section">
                <h2>Why Choose Us?</h2>
                <ul>
                    <li><strong>Quality:</strong> We are committed to using only the best materials and the latest technologies to produce our [products/services].</li>
                    <li><strong>Innovation:</strong> We constantly strive to innovate and improve our offerings, ensuring that we stay ahead of the curve.</li>
                    <li><strong>Customer Service:</strong> Our customers are at the heart of everything we do. We are dedicated to providing exceptional customer service and ensuring that every experience with us is a positive one.</li>
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
