import React, { useState, useEffect } from 'react';
import './oldProduct.css'; // Assurez-vous que le CSS est lié correctement
import { AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const OldProduct = ({ addtocart }) => {
    const [oldProducts, setOldProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [cartCount, setCartCount] = useState(parseInt(localStorage.getItem('cartCount')) || 0); // Initialiser à partir de localStorage

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        localStorage.setItem('cartCount', cartCount); // Sauvegarder l'état du panier dans localStorage
    }, [cartCount]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');
            const data = await response.json();
            const oldProducts = data.filter((x) => x.type === 'old');
            setOldProducts(oldProducts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching old products:', error);
            setLoading(false);
        }
    };

    const filterProducts = async (category) => {
        setFilter(category);
        setLoading(true);
        try {
            let url = `http://localhost:3001/api/products?type=old`;
            if (category !== 'all') {
                url += `&category=${category}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            const filteredProducts = data.filter((x) => x.type === 'old');
            setOldProducts(filteredProducts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching filtered products:', error);
            setLoading(false);
        }
    };

    const addToCart = (product) => {
        addtocart(product); // Appeler la fonction addtocart fournie par les props
        setCartCount(cartCount + 1); // Incrémenter le compteur du panier
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
                            <button onClick={() => addToCart(product)}>
                                <AiOutlineShoppingCart /> Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Icône fixe du panier */}
            

        </div>
    );
};

export default OldProduct;
