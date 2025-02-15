import React, { useState, useEffect } from 'react';
import './topProducts.css'; // Assurez-vous que le CSS est lié correctement
import { AiFillStar, AiOutlineShoppingCart } from 'react-icons/ai';

const TopProducts = ({ addtocart }) => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');
            const data = await response.json();
            const topProducts = data.filter((x) => x.types && x.types.includes('top'));
            setTopProducts(topProducts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching top products:', error);
            setLoading(false);
        }
    };

    const filterProducts = async (category) => {
        setFilter(category);
        setLoading(true);
        try {
            let url = `http://localhost:3001/api/products?type=top`;
            if (category !== 'all') {
                url += `&category=${category}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            const filteredProducts = data.filter((x) => x.types && x.types.includes('top'));
            setTopProducts(filteredProducts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching filtered products:', error);
            setLoading(false);
        }
    };

    return (
        <div className="topProducts">
            <div className="banner">
                <h2>Top Products</h2>
                <p>Discover our most popular products</p>
            </div>
            <div className="filters">
                <button onClick={() => filterProducts('all')}>All</button>
                <button onClick={() => filterProducts('electronics')}>Electronics</button>
                <button onClick={() => filterProducts('fashion')}>Fashion</button>
                <button onClick={() => filterProducts('home')}>Home</button>
            </div>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="products_grid">
                    {topProducts.map(product => (
                        <div key={product.id} className="product_card">
                            <img src={`http://localhost:3001${product.image}`} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.price} MAD</p>
                            <div className="rating">
                                {[...Array(Math.min(product.likes, 5))].map((_, i) => (
                                    <AiFillStar key={i} />
                                ))}
                                <span>{product.likes} likes</span>
                            </div>
                            <button onClick={() => addtocart(product)}>
                                <AiOutlineShoppingCart /> Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopProducts;
