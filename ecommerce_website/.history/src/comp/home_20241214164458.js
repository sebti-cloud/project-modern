import React, { useState, useEffect } from "react";
import './home.css';
import { Link } from "react-router-dom";
import Homeproduct from "./home_product";
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { BiLogoFacebook, BiLogoTwitter, BiLogoInstagram, BiLogoYoutube } from "react-icons/bi";

const Home = () => {
    // Product category
    const [newProduct, setNewProduct] = useState([]);  // Initialisation de newProduct en tant que tableau vide
    const [featuredProduct, setFeaturedProduct] = useState([]);  // Initialisation de featuredProduct en tant que tableau vide
    const [topProduct, setTopProduct] = useState([]);  // Initialisation de topProduct en tant que tableau vide

    // Trending Product 
    const [trendingProduct, setTrendingProduct] = useState(Homeproduct);
    
    // Filter trending products
    const filtercate = (x) => {
        const filterproduct = Homeproduct.filter((curElm) => {
            return curElm.type === x;
        });
        setTrendingProduct(filterproduct);
    };
    
    // All trending products
    const allTrendingProduct = () => {
        setTrendingProduct(Homeproduct);
    };

    // Product Type
    useEffect(() => {
        productcategory();
    }, []);  // Ajout du tableau vide pour que useEffect se lance uniquement une fois au chargement initial

    const productcategory = () => {
        //New Product
        const newcategory = Homeproduct.filter((x) => {
            return x.type === 'new';
        });
        setNewProduct(newcategory);  // S'assure que newProduct est bien un tableau
        //Featured product 
        const featuredcategory = Homeproduct.filter((x) =>
        {
            return x.type === 'featured'
        })
        setFeaturedProduct(featuredcategory)

        //Top Product
        const topcategory = Homeproduct.filter((x) =>
        {
            return x.type === 'top'
        })
        setTopProduct(topcategory)
    };

    return (
        <>
            <div className="home">
                <div className="top_banner">
                    <div className="contant">
                        <h3>silver aluminum</h3>
                        <h2>Apple Watch</h2>
                        <p>30%off at your first order</p>
                        <Link to='/shop' className="link">Shop Now</Link>
                    </div>
                </div>
                <div className="trending">
                    <div className="container">
                        <div className='left_box'>
                            <div className="header">
                                <div className="heading">
                                    <h2 onClick={() => allTrendingProduct()}>trending product</h2>
                                </div>
                                <div className="cate">
                                    <h3 onClick={() => filtercate('new')}>New</h3>
                                    <h3 onClick={() => filtercate('featured')}>Featured</h3>
                                    <h3 onClick={() => filtercate('top')}>top selling</h3>
                                </div>
                            </div>
                            <div className="products">
                                <div className="container">
                                    {
                                        trendingProduct.map((curElm) => {
                                            return (
                                                <div key={curElm.id} className='box'>
                                                    <div className='img_box'>
                                                        <img src={curElm.image} alt=''></img>
                                                        <div className="icon">
                                                            <div className="icon_box">
                                                                <AiFillEye />
                                                            </div>
                                                            <div className="icon_box">
                                                                <AiFillHeart /> 
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="info">
                                                        <h3>{curElm.Name}</h3>
                                                        <p>${curElm.price}</p>
                                                        <button className='btn'>Add To Cart</button>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                                <button>Show More</button>
                            </div>
                        </div>
                        <div className="right_box">
                            <div className="right_container">
                                <div className="testimonial">
                                    <div className="head">
                                        <h3>our testimonial</h3>
                                    </div>
                                    <div className="detail">
                                        <div className="img_box">
                                            <img src="image/T1.jpg" alt="testmonail"></img>
                                        </div>
                                        <div className="info">
                                            <h3>LAHRECH Mohamed</h3>
                                            <h4>Web designer</h4>
                                            <p>Je suis une specialiste dans ce sens et je vous conseille par ce produit parcequ'il developpe vos potentiels techniques </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="newsletter">
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
                        <div className="left_box">
                            <div className="box">
                                <img src="image/Multi-Banner-1.jpg" alt="banner"></img>
                            </div>
                            <div className="box">
                                <img src="image/Multi-Banner-2.jpg" alt="banner"></img>
                            </div>
                        </div>
                        <div className="right_box">
                            <div className="top">
                                <img src='image/Multi-Banner-3.jpg' alt=''></img>
                                <img src='image/Multi-Banner-4.jpg' alt=''></img>
                            </div>
                            <div className="bottom">
                                <img src="image/Multi-Banner-5.webp" alt=""></img>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="product_type">
                    <div className="container">
                        <div className="box">
                            <div className="header">
                                <h2>New Product</h2>
                            </div>
                            {
                                Array.isArray(newProduct) && newProduct.map((curElm) => {  // Vérification que newProduct est un tableau
                                    return (
                                        <div key={curElm.id} className="productbox">
                                            <div className="img-box">
                                                <img src={curElm.image} alt=""></img>
                                            </div>
                                            <div className="detail">
                                                <h3>{curElm.Name}</h3>
                                                <p>{curElm.price}</p>
                                                <div className="icon">
                                                    <button><AiFillEye /></button> 
                                                    <button><AiFillHeart /></button> 
                                                    <button><AiOutlineShoppingCart /></button> 

                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>

                        <div className="box">
                            <div className="header">
                                <h2>Featured Product</h2>
                            </div>
                            {
                                Array.isArray(featuredProduct) && featuredProduct.map((curElm) => {  // Vérification que newProduct est un tableau
                                    return (
                                        <div key={curElm.id} className="productbox">
                                            <div className="img-box">
                                                <img src={curElm.image} alt=""></img>
                                            </div>
                                            <div className="detail">
                                                <h3>{curElm.Name}</h3>
                                                <p>{curElm.price}</p>
                                                <div className="icon">
                                                    <button><AiFillEye /></button> 
                                                    <button><AiFillHeart /></button> 
                                                    <button><AiOutlineShoppingCart /></button> 

                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>

                        <div className="box">
                            <div className="header">
                                <h2>Top Product</h2>
                            </div>
                            {
                                Array.isArray(topProduct) && topProduct.map((curElm) => {  // Vérification que newProduct est un tableau
                                    return (
                                        <div key={curElm.id} className="productbox">
                                            <div className="img-box">
                                                <img src={curElm.image} alt=""></img>
                                            </div>
                                            <div className="detail">
                                                <h3>{curElm.Name}</h3>
                                                <p>{curElm.price}</p>
                                                <div className="icon">
                                                    <button><AiFillEye /></button> 
                                                    <button><AiFillHeart /></button> 
                                                    <button><AiOutlineShoppingCart /></button> 

                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            }
                        </div>


                    </div>
                    
                </div>
            </div>
        </>
    );
};

export default Home;
