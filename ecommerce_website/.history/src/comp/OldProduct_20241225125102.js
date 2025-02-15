import React, { useState, useEffect } from 'react';
import './oldProduct.css';
import { AiOutlineShoppingCart } from 'react-icons/ai';

const OldProduct = ({ fetchOldProducts, addtocart }) => {
    const [oldProducts, setOldProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await fetchOldProducts();
            setLoading(false);
        };
        fetchData();
    }, []);

    const filterProducts = async (category) => {
        setFilter(category);
        setLoading(true);
        await fetchOldProducts(category);
        setLoading(false);
    };

    return (
        <div className="oldProducts">
            <div className="banner">
                <h2>Old Products</h2>
                <p>Find rare and out-of-fashion products at great prices</p>
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
                    {oldProducts.map(product => (
                        <div key={product.id} className="product_card">
                            <img src={`http://localhost:3001${product.image}`} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.price} MAD</p>
                            <p>{product.description}</p>
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

export default OldProduct;
