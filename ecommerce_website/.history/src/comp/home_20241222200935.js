import React, { useState, useEffect } from "react";
import './home.css';
import { Link } from "react-router-dom";
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { BiLogoFacebook, BiLogoTwitter, BiLogoInstagram, BiLogoYoutube } from "react-icons/bi";

const Home = ({ addtocart }) => {
    const [newProduct, setNewProduct] = useState([]);
    const [featuredProduct, setFeaturedProduct] = useState([]);
    const [topProduct, setTopProduct] = useState([]);
    const [trendingProduct, setTrendingProduct] = useState([]);
    const [likedMessage, setLikedMessage] = useState('');
    const [showLikedMessage, setShowLikedMessage] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');
            const data = await response.json();
            setTrendingProduct(data);
            setProductCategories(data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const setProductCategories = (products) => {
        const newProducts = products.filter((x) => x.type === 'new');
        setNewProduct(newProducts);

        const featuredProducts = products.filter((x) => x.type === 'featured');
        setFeaturedProduct(featuredProducts);

        const topProducts = products.filter((x) => x.type === 'top');
        setTopProduct(topProducts);
    };

    const renderProductImage = (imagePath) => {
        const placeholderImage = "/uploads/placeholder.jpg";
        return imagePath && imagePath.trim() !== "" ? `http://localhost:3001${imagePath}` : placeholderImage;
    };

    const handleLike = async (productId) => {
        try {
            const response = await fetch(`http://localhost:3001/api/products/${productId}/like`, {
                method: 'PUT',
            });
            if (response.ok) {
                fetchProducts();
                setLikedMessage('Liked product!');
                setShowLikedMessage(true);
                setTimeout(() => setShowLikedMessage(false), 3000);
            } else {
                console.error('Failed to like product.');
            }
        } catch (error) {
            console.error('Error liking product:', error);
        }
    };

    return (
        <>
            <div className="home">
                {showLikedMessage && <div className="liked-message">{likedMessage}</div>}
                <div id="about-us" className="top_banner">
                    <div className="contant">
                        <h3>silver aluminum</h3>
                        <h2>Apple Watch</h2>
                        <p>30% off at your first order</p>
                        <Link to='/shop' className="link">Shop Now</Link>
                    </div>
                </div>
                <div id="trending-product" className="trending">
                    <div className="container">
                        <div className='left_box'>
                            <div className="header">
                                <div className="heading">
                                    <h2>trending product</h2>
                                </div>
                                <div className="products">
                                    <div className="container">
                                        {trendingProduct.map((curElm) => (
                                            <div key={curElm.id} className='box'>
                                                <div className='img_box'>
                                                    <img src={renderProductImage(curElm.image)} alt={curElm.name || 'Product'} />
                                                    <div className="icon">
                                                        <div className="icon_box">
                                                            <AiFillEye />
                                                        </div>
                                                        <div className="icon_box" onClick={() => handleLike(curElm.id)}>
                                                            <AiFillHeart />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="info">
                                                    <h3>{curElm.name}</h3>
                                                    <p>${curElm.price}</p>
                                                    <button className='btn' onClick={() => addtocart(curElm)}>Add To Cart</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <button>Show More</button>
                            </div>
                        </div>
                        <div className="right_box">
                            <div className="right_container">
                                <div id="testimonial" className="testimonial">
                                    <div className="head">
                                        <h3>our testimonial</h3>
                                    </div>
                                    <div className="detail">
                                        <div className="img_box">
                                            <img src="http://localhost:3001/uploads/T1.jpg" alt="testimonial"></img>
                                        </div>
                                        <div className="info">
                                            <h3>LAHRECH Mohamed</h3>
                                            <h4>Web designer</h4>
                                            <p>Je suis un spécialiste dans ce sens et je vous conseille par ce service parce qu'il développe vos potentiels techniques.</p>
                                        </div>
                                    </div>
                                </div>
                                <div id="newsletter" className="newsletter">
                                    <div className="head">
                                        <h3>newsletter</h3>
                                    </div>
                                    <div className="form">
                                        <p>join our mailing list</p>
                                        <input type="email" placeholder="E-mail" autoComplete="off"></input>
                                        <button>Subscribe</button>
                                        <div className="icon_box">
                                            <div className="icon">
                                                <BiLogoFacebook />
                                            </div>
                                            <div className="icon">
                                                <BiLogoTwitter />
                                            </div>
                                            <div className="icon">
                                                <BiLogoInstagram />
                                            </div>
                                            <div className="icon">
                                                <BiLogoYoutube />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="banners">
                    <div className="container">
                        <div class="left_box">
                            <div class="box">
                                <img src="http://localhost:3001/uploads/Multi-Banner-1.jpg" alt="banner"></img>
                            </div>
                            <div class="box">
                                <img src="http://localhost:3001/uploads/Multi-Banner-2.jpg" alt="banner"></img>
                            </div>
                        </div>
                        <div class="right_box">
                            <div class="top">
                                <img src='http://localhost:3001/uploads/Multi-Banner-3.jpg' alt=''></img>
                                <img src='http://localhost:3001/uploads/Multi-Banner-4.jpg' alt=''></img>
                            </div>
                            <div class="bottom">
                                <img src="http://localhost:3001/uploads/Multi-Banner-5.webp" alt=""></img>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="new-product" class="product_type">
                    <div class="container">
                        <div class="box">
                            <div class="header">
                                <h2>New Product</h2>
                            </div>
                            {Array.isArray(newProduct) && newProduct.map((curElm) => (
                                <div key={curElm.id} class="productbox">
                                    <div class="img-box">
                                        <img src={renderProductImage(curElm.image)} alt={curElm.name || 'New Product'}></img>
                                    </div>
                                    <div class="detail">
                                        <h3>{curElm.name}</h3>
                                        <p>${curElm.price}</p>
                                        <div class="icon">
                                            <button><AiFillEye /></button>
                                            <button><AiFillHeart /></button>
                                            <button onClick={() => addtocart(curElm)}><AiOutlineShoppingCart /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div id="featured-product" class="box">
                            <div class="header">
                                <h2>Featured Product</h2>
                            </div>
                            {Array.isArray(featuredProduct) && featuredProduct.map((curElm) => (
                                <div key={curElm.id} class="productbox">
                                    <div class="img-box">
                                        <img src={renderProductImage(curElm.image)} alt={curElm.name || 'Featured Product'}></img>
                                    </div>
                                    <div class="detail">
                                        <h3>{curElm.name}</h3>
                                        <p>${curElm.price}</p>
                                        <div class="icon">
                                            <button><AiFillEye /></button>
                                            <button><AiFillHeart /></button>
                                            <button onClick={() => addtocart(curElm)}><AiOutlineShoppingCart /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div id="top-product" class="box">
                            <div class="header">
                                <h2>Top Product</h2>
                            </div>
                            {Array.isArray(topProduct) && topProduct.map((curElm) => (
                                <div key={curElm.id} class="productbox">
                                    <div class="img-box">
                                        <img src={renderProductImage(curElm.image)} alt={curElm.name || 'Top Product'}></img>
                                    </div>
                                    <div class="detail">
                                        <h3>{curElm.name}</h3>
                                        <p>${curElm.price}</p>
                                        <div class="icon">
                                            <button><AiFillEye /></button>
                                            <button><AiFillHeart /></button>
                                            <button onClick={() => addtocart(curElm)}><AiOutlineShoppingCart /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
