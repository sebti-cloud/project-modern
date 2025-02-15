import React, { useState, useEffect } from 'react';
import './topProducts.css'; // Assurez-vous que le CSS est lié correctement
import { AiFillStar, AiOutlineShoppingCart } from 'react-icons/ai';
import { Link } from 'react-router-dom';

const TopProducts = ({ addtocart }) => {
    const [products, setProducts] = useState([]);
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
            const topProducts = data.filter((x) => x.types && x.types.includes('top'));
            const likedProducts = data.filter((x) => x.types && x.types.includes('liked'));
            const combinedProducts = [...topProducts, ...likedProducts];
            setProducts(combinedProducts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const filterProducts = async (category) => {
        setFilter(category);
        setLoading(true);
        try {
            let url = `http://localhost:3001/api/products`;
            if (category !== 'all') {
                url += `?category=${category}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            const filteredProducts = data.filter((x) => x.types && (x.types.includes('top') || x.types.includes('liked')));
            setProducts(filteredProducts);
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
        <div className="topProducts">
            <div className="banner">
                <h2>Top & Liked Products</h2>
                <p>Discover our most popular and liked products</p>
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
                    {products.map(product => (
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
                            <button onClick={() => addToCart(product)}>
                                <AiOutlineShoppingCart /> Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}

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

export default TopProducts;
