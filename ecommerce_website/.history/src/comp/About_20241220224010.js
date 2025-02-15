import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
    const fadeIn = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6 }
    };

    return (
        <div id="about-us" className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8">
            <motion.div 
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-4xl font-bold text-gray-900 text-center mb-16 relative">
                    About Us
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-500 mt-2"></span>
                </h1>

                <div className="space-y-16">
                    <motion.section {...fadeIn} className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Story</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Welcome to [Your Company Name], where innovation meets craftsmanship. Founded in [Year], our journey began with a passion for quality and a commitment to excellence. Over the years, we've grown from a small startup into a leading player in the [industry/sector] industry, thanks to the support of our loyal customers and the dedication of our talented team.
                        </p>
                    </motion.section>

                    <motion.section {...fadeIn} className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
                        <p className="text-gray-600 leading-relaxed">
                            Our mission is simple: to provide the highest quality [products/services] that exceed our customers' expectations. We believe in the power of [key values or principles], and these principles guide everything we do.
                        </p>
                    </motion.section>

                    <motion.section {...fadeIn} className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Team</h2>
                        <p className="text-gray-600 leading-relaxed">
                            At [Your Company Name], we are proud of our diverse and talented team. Our team members come from various backgrounds and bring a wealth of experience and creativity to the table. Together, we work towards a common goal of delivering excellence in every aspect of our business.
                        </p>
                    </motion.section>

                    <motion.section {...fadeIn} className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Choose Us?</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-500 mr-3">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <div>
                                    <strong className="text-gray-800">Quality:</strong>
                                    <span className="text-gray-600 ml-2">We are committed to using only the best materials and the latest technologies.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-500 mr-3">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <div>
                                    <strong className="text-gray-800">Innovation:</strong>
                                    <span className="text-gray-600 ml-2">We constantly strive to innovate and improve our offerings.</span>
                                </div>
                            </li>
                            <li className="flex items-start">
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-500 mr-3">
                                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <div>
                                    <strong className="text-gray-800">Customer Service:</strong>
                                    <span className="text-gray-600 ml-2">Our customers are at the heart of everything we do.</span>
                                </div>
                            </li>
                        </ul>
                    </motion.section>

                    <motion.section {...fadeIn} className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
                        <p className="text-gray-600 leading-relaxed">
                            We love to hear from our customers! Whether you have a question, feedback, or just want to say hello, feel free to reach out to us at [Contact Information]. You can also follow us on [Social Media Links] to stay updated on the latest news and offers.
                        </p>
                    </motion.section>
                </div>
            </motion.div>
        </div>
    );
};

export default About;