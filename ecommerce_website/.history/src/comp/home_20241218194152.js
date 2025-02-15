import React, { useState, useEffect } from "react";
import './home.css';
import { Link } from "react-router-dom";
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { BiLogoFacebook, BiLogoTwitter, BiLogoInstagram, BiLogoYoutube } from "react-icons/bi";

const Home = ({ addtocart }) => {
    // Product categories
    const [newProduct, setNewProduct] = useState([]);
    const [featuredProduct, setFeaturedProduct] = useState([]);
    const [topProduct, setTopProduct] = useState([]);
    const [trendingProduct, setTrendingProduct] = useState([]);

    // Fetch products from backend
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');
            const data = await response.json();
            if (Array.isArray(data)) {
                setTrendingProduct(data);
                setProductCategories(data);
            } else {
                console.error("Unexpected API response format:", data);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const setProductCategories = (products) => {
        const newcategory = products.filter((x) => x.type === 'new');
        setNewProduct(newcategory);

        const featuredcategory = products.filter((x) => x.type === 'featured');
        setFeaturedProduct(featuredcategory);

        const topcategory = products.filter((x) => x.type === 'top');
        setTopProduct(topcategory);
    };

    const placeholderImage = "/path/to/placeholder.jpg"; // Replace with actual placeholder image path

    const renderProductImage = (imagePath) => {
        return imagePath && imagePath.trim() !== "" ? imagePath : placeholderImage;
    };

    return (
        <div className="home">
            <div className="top_banner">
                <div className="contant">
                    <h3>silver aluminum</h3>
                    <h2>Apple Watch</h2>
                    <p>30% off at your first order</p>
                    <Link to='/shop' className="link">Shop Now</Link>
                </div>
            </div>

            <div className="trending">
                <div className="container">
                    <div className="products">
                        {
                            trendingProduct.map((curElm) => (
                                <div key={curElm.id} className='box'>
                                    <div className='img_box'>
                                        <img
                                            src={renderProductImage(curElm.image)}
                                            alt={curElm.name || "Product Image"}
                                        />
                                    </div>
                                    <div className="info">
                                        <h3>{curElm.name}</h3>
                                        <p>${curElm.price}</p>
                                        <button className='btn' onClick={() => addtocart(curElm)}>Add To Cart</button>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>

            <div className="product_type">
                <div className="container">
                    {/* Rendering new, featured, and top products */}
                    {[newProduct, featuredProduct, topProduct].map((category, index) => {
                        const categoryNames = ["New Product", "Featured Product", "Top Product"];
                        return (
                            <div key={index} className="box">
                                <div className="header">
                                    <h2>{categoryNames[index]}</h2>
                                </div>
                                {
                                    category.map((curElm) => (
                                        <div key={curElm.id} className="productbox">
                                            <div className="img-box">
                                                <img
                                                    src={renderProductImage(curElm.image)}
                                                    alt={curElm.name || "Product Image"}
                                                />
                                            </div>
                                            <div className="detail">
                                                <h3>{curElm.name}</h3>
                                                <p>${curElm.price}</p>
                                                <div className="icon">
                                                    <button><AiFillEye /></button>
                                                    <button><AiFillHeart /></button>
                                                    <button onClick={() => addtocart(curElm)}><AiOutlineShoppingCart /></button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Home;
