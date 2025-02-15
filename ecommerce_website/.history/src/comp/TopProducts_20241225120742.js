import React, { useState, useEffect } from 'react';
import './topProducts.css';
import { AiFillStar, AiOutlineShoppingCart } from 'react-icons/ai';

const TopProducts = ({ fetchTopProducts, addtocart }) => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchTopProducts();
            setLoading(false);
        };
        fetchData();
    }, []);

    const filterProducts = async (category) => {
        setFilter(category);
        setLoading(true);
        await fetchTopProducts(category);
        setLoading(false);
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
                                {[...Array(product.rating)].map((_, i) => (
                                    <AiFillStar key={i} />
                                ))}
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
