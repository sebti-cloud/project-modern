import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { BiLogoFacebook, BiLogoTwitter, BiLogoInstagram, BiLogoYoutube } from "react-icons/bi";
import './home.css';

// Constants
const API_BASE_URL = 'http://localhost:3001';
const PLACEHOLDER_IMAGE = "/uploads/placeholder.jpg";

// Product Types
const PRODUCT_TYPES = {
  NEW: 'new',
  FEATURED: 'featured',
  TOP: 'top'
};

// Component for product icons
const ProductIcons = ({ onAddToCart, product }) => (
  <div className="icon">
    <button><AiFillEye /></button>
    <button><AiFillHeart /></button>
    <button onClick={() => onAddToCart(product)}><AiOutlineShoppingCart /></button>
  </div>
);

// Product Card Component
const ProductCard = ({ product, onAddToCart, renderProductImage }) => (
  <div className="productbox">
    <div className="img-box">
      <img src={renderProductImage(product.image)} alt={product.name || 'Product'} />
    </div>
    <div className="detail">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <ProductIcons onAddToCart={onAddToCart} product={product} />
    </div>
  </div>
);

// Social Media Icons Component
const SocialMediaIcons = () => (
  <div className="icon_box">
    {[BiLogoFacebook, BiLogoTwitter, BiLogoInstagram, BiLogoYoutube].map((Icon, index) => (
      <div key={index} className="icon">
        <Icon />
      </div>
    ))}
  </div>
);

const Home = ({ addtocart }) => {
  // State management
  const [products, setProducts] = useState({
    trending: [],
    new: [],
    featured: [],
    top: []
  });

  // Memoized image rendering function
  const renderProductImage = useCallback((imagePath) => {
    return imagePath && imagePath.trim() !== "" 
      ? `${API_BASE_URL}${imagePath}` 
      : PLACEHOLDER_IMAGE;
  }, []);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/products`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      // Categorize products
      const categorizedProducts = {
        trending: data,
        new: data.filter(x => x.type === PRODUCT_TYPES.NEW),
        featured: data.filter(x => x.type === PRODUCT_TYPES.FEATURED),
        top: data.filter(x => x.type === PRODUCT_TYPES.TOP)
      };
      
      setProducts(categorizedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      // You might want to add error state handling here
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter trending products
  const filterTrendingProducts = useCallback((type) => {
    setProducts(prev => ({
      ...prev,
      trending: prev.trending.filter(product => product.type === type)
    }));
  }, []);

  // Memoized product sections
  const ProductSection = useMemo(() => ({ title, products }) => (
    <div className="box">
      <div className="header">
        <h2>{title}</h2>
      </div>
      {Array.isArray(products) && products.map(product => (
        <ProductCard 
          key={product.id}
          product={product}
          onAddToCart={addtocart}
          renderProductImage={renderProductImage}
        />
      ))}
    </div>
  ), [addtocart, renderProductImage]);

  return (
    <div className="home">
      {/* Banner Section */}
      <div id="about-us" className="top_banner">
        <div className="contant">
          <h3>silver aluminum</h3>
          <h2>Apple Watch</h2>
          <p>30% off at your first order</p>
          <Link to='/shop' className="link">Shop Now</Link>
        </div>
      </div>

      {/* Trending Products Section */}
      <div id="trending-product" className="trending">
        <div className="container">
          <div className="left_box">
            <div className="header">
              <div className="heading">
                <h2 onClick={fetchProducts}>trending product</h2>
              </div>
              <div className="cate">
                {Object.values(PRODUCT_TYPES).map(type => (
                  <h3 key={type} onClick={() => filterTrendingProducts(type)}>
                    {type}
                  </h3>
                ))}
              </div>
            </div>
            {/* Trending Products Grid */}
            <div className="products">
              <div className="container">
                {products.trending.map(product => (
                  <div key={product.id} className="box">
                    <div className="img_box">
                      <img 
                        src={renderProductImage(product.image)} 
                        alt={product.name || 'Product'} 
                      />
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
                      <h3>{product.name}</h3>
                      <p>${product.price}</p>
                      <button className='btn' onClick={() => addtocart(product)}>
                        Add To Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="right_box">
            <div className="right_container">
              {/* Testimonial Section */}
              <div id="testimonial" className="testimonial">
                <div className="head">
                  <h3>our testimonial</h3>
                </div>
                <div className="detail">
                  <div className="img_box">
                    <img src={`${API_BASE_URL}/uploads/T1.jpg`} alt="testimonial" />
                  </div>
                  <div className="info">
                    <h3>LAHRECH Mohamed</h3>
                    <h4>Web designer</h4>
                    <p>Je suis un spécialiste dans ce sens et je vous conseille par ce service parce qu'il développe vos potentiels techniques.</p>
                  </div>
                </div>
              </div>

              {/* Newsletter Section */}
              <div id="newsletter" className="newsletter">
                <div className="head">
                  <h3>newsletter</h3>
                </div>
                <div className="form">
                  <p>join our mailing list</p>
                  <input type="email" placeholder="E-mail" autoComplete="off" />
                  <button>Subscribe</button>
                  <SocialMediaIcons />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories Section */}
      <div id="new-product" className="product_type">
        <div className="container">
          <ProductSection title="New Product" products={products.new} />
          <ProductSection title="Featured Product" products={products.featured} />
          <ProductSection title="Top Product" products={products.top} />
        </div>
      </div>
    </div>
  );
};

export default Home;