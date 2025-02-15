import React, { useState, useEffect } from 'react';
import './admin.css';

const LikedProducts = () => {
    const [likedProducts, setLikedProducts] = useState([]);

    useEffect(() => {
        fetchLikedProducts();
    }, []);

    const fetchLikedProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/liked-products');
            const data = await response.json();
            setLikedProducts(data);
        } catch (error) {
            console.error('Error fetching liked products:', error);
        }
    };

    return (
        <div className="liked-products">
            <h2 className="liked-products-header">Liked Products</h2>
            <div className="product-grid">
                {likedProducts.map(product => (
                    <div className="product-box" key={product.id}>
                        <img src={`http://localhost:3001${product.image}`} alt={product.name} />
                        <div className="product-info">
                            <div className="product-name">{product.name}</div>
                            <div className="product-price">${product.price}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LikedProducts;
