import React, { useState, useEffect } from 'react';
import './shop.css';
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';

const Shop = ({ addtocart, searchResults }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState([]);
  const [shop, setShop] = useState([]);
  const [categories, setCategories] = useState([]);
  const [likedMessage, setLikedMessage] = useState('');
  const [showLikedMessage, setShowLikedMessage] = useState(false);
  const [cartCount, setCartCount] = useState(parseInt(localStorage.getItem('cartCount')) || 0);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    getUserId();
  }, []);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setShop(searchResults);
    }
  }, [searchResults]);

  useEffect(() => {
    localStorage.setItem('cartCount', cartCount);
  }, [cartCount]);

  const fetchProducts = async (category = '') => {
    try {
      let url = 'http://localhost:3001/api/products';
      if (category) {
        url += `?category=${category}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      setShop(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getUserId = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:3001/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserId(data.id);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  const detailpage = (product) => {
    setDetail(product);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const filtercate = (category) => {
    fetchProducts(category);
  };

  const allcatfilter = () => {
    fetchProducts();
  };

  const handleLike = async (productId) => {
    if (!userId) {
      console.error('User is not logged in. Unable to like product.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/liked-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, product: productId }),
      });

      if (response.ok) {
        fetchProducts();
        setLikedMessage('Produit aimé!');
        setShowLikedMessage(true);
        setTimeout(() => setShowLikedMessage(false), 3000);
      } else {
        console.error('Failed to like product.');
      }
    } catch (error) {
      console.error('Error liking product:', error);
    }
  };

  const addToCart = (product) => {
    addtocart(product);
    setCartCount(cartCount + 1);
  };
  return (
    <>
      {showDetail ? (
        <div className='product_detail'>
          <button className='close_btn' onClick={closeDetail}><AiOutlineClose /></button>
          <div className='container'>
            <div className='img_box'>
              <img src={`http://localhost:3001${detail.image}`} alt=''></img>
            </div>
            <div className='info'>
              <h4># {detail.category}</h4>
              <h2>{detail.name}</h2>
              <p>{detail.details}</p>
              <h3>{detail.price} Mad</h3>
              <button onClick={() => addToCart(detail)}>Ajouter au panier</button>
            </div>
          </div>
        </div>
      ) : null}

      <div className='shop'>
        {showLikedMessage && <div className="liked-message">{likedMessage}</div>}
        <h2>Boutique</h2>
        <div className='main'>
          <div className='left_box'>
            <div className='category'>
              <div className='header'>
                <h3>Toutes les catégories</h3>
              </div>
              <div className='box'>
                <ul>
                  <li onClick={() => allcatfilter()}># Toutes</li>
                  {categories.map(category => (
                    <li key={category.id} onClick={() => filtercate(category.name)}>{`# ${category.name}`}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='banner'>
              <div className='img_box'>
                <img src='image/shop_left.jpg' alt=''></img>
              </div>
            </div>
          </div>
          <div className='right_box'>
            <div className='banner'>
              <div className='img_box'>
                <img src='image/shop_top.jpg' alt=''></img>
              </div>
            </div>
            <div className='product_box'>
              <h2>Boutique des produits</h2>
              <div className='product_container'>
                {shop.map((curElm) => (
                  <div key={curElm.id} className='box'>
                    <div className='img_box'>
                      <img src={`http://localhost:3001${curElm.image}`} alt='' ></img>
                      <div className='icon'>
                        <div className="icon_box" onClick={() => handleLike(curElm.id)}>
                          <AiFillHeart />
                        </div>
                        <div className="icon_box" onClick={() => detailpage(curElm)}>
                          <AiFillEye />
                        </div>
                        <div className="icon_box" onClick={() => addToCart(curElm)}>
                          <AiOutlineShoppingCart />
                        </div>
                      </div>
                    </div>
                    <div className='detail'>
                      <h3>{curElm.name}</h3>
                      <p>{curElm.price} Mad</p>
                      <button onClick={() => addToCart(curElm)}>Ajouter au panier</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        {cartCount > 0 && (
          <Link to="/cart">
            <div className="cart-icon">
              <AiOutlineShoppingCart />
              <span className="cart-count">{cartCount}</span>
            </div>
          </Link>
        )}
      </div>
    </>
  );
};

export default Shop;
