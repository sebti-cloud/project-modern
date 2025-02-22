import React, { useState, useEffect } from 'react';
import './shop.css';
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart, AiOutlineClose } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Slider from 'react-slick';

const Shop = ({ addtocart, searchResults }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState({});
  const [shop, setShop] = useState([]);
  const [categories, setCategories] = useState([]);
  const [likedMessage, setLikedMessage] = useState('');
  const [showLikedMessage, setShowLikedMessage] = useState(false);
  const [cartCount, setCartCount] = useState(parseInt(localStorage.getItem('cartCount')) || 0);
  const [userId, setUserId] = useState(null);
  const [autoplayIndex, setAutoplayIndex] = useState(null);
  const [currentCategory, setCurrentCategory] = useState(''); // Ajouter un état pour la catégorie actuelle

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

  useEffect(() => {
    console.log('Current category:', currentCategory); // Log pour la catégorie actuelle
    if (currentCategory === '') {
      fetchProducts(); // Fetch all products if no category is selected
    } else {
      fetchProducts(currentCategory); // Fetch products by category
    }
  }, [currentCategory]);

  const fetchProducts = async (category = '') => {
    try {
      let url = 'http://localhost:3001/api/products';
      if (category) {
        url += `?category=${category}`; // Ajouter le paramètre de catégorie à l'URL
        console.log('Fetching products for category:', category); // Log pour la catégorie de produits
      } else {
        console.log('Fetching all products'); // Log pour tous les produits
      }
      const response = await fetch(url);
      const data = await response.json();
      
      const normalizedData = data.map(product => ({
        ...product,
        images: product.images ? product.images.replace(/[{}"]/g, '').split(',') : [],
      }));

      console.log('Fetched products:', normalizedData); // Log des produits récupérés

      setShop(Array.isArray(normalizedData) ? normalizedData : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
      console.log('Fetched categories:', data); // Log des catégories récupérées
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const getUserId = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:3001/api/user', {
          headers: { Authorization: `Bearer ${token}` },
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
    console.log('Category clicked:', category); // Log pour la catégorie cliquée
    setCurrentCategory(category); // Mettre à jour l'état de la catégorie actuelle
  };

  const allcatfilter = () => {
    console.log('All categories clicked'); // Log pour toutes les catégories
    setCurrentCategory(''); // Réinitialiser l'état de la catégorie actuelle
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
        fetchProducts(currentCategory); 
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

  const settings = (index) => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: autoplayIndex === index,
    pauseOnHover: true,
  });

  const handleMouseEnter = (index) => {
    setAutoplayIndex(index);
  };

  const handleMouseLeave = () => {
    setAutoplayIndex(null);
  };

  const renderProductImages = (images) => {
    if (Array.isArray(images) && images.length > 0) {
      return images.map((image, index) => (
        <div key={index} className='img_box'>
          <img src={`http://localhost:3001${image.trim()}`} alt='Product' />
        </div>
      ));
    } else {
      return (
        <div className='img_box'>
          <img src='/uploads/placeholder.jpg' alt='Placeholder' />
        </div>
      );
    }
  };

  return (
    <>
      {showDetail && (
        <div className='product_detail'>
          <button className='close_btn' onClick={closeDetail}><AiOutlineClose /></button>
          <Slider {...settings(null)}>
            {renderProductImages(detail.images)}
          </Slider>
          <div className='info'>
            <h4># {detail.category}</h4>
            <h2>{detail.name}</h2>
            <p>{detail.details}</p>
            <h3>{detail.price} Mad</h3>
            <button onClick={() => addToCart(detail)}>Ajouter au panier</button>
          </div>
        </div>
      )}

      <div className='shop'>
        {showLikedMessage && <div className="liked-message">{likedMessage}</div>}
        <h2>Boutique</h2>
        <div className='container'>
          <div className='left_box'>
            <div className='category'>
              <div className='header'>
                <h3>All categories</h3>
              </div>
              <div className='box'>
                <ul>
                  <li onClick={allcatfilter}># Toutes</li>
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
                {shop.map((curElm, index) => (
                  <div key={curElm.id} className='box' onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                    <div className='img_box'>
                      <Slider {...settings(index)}>
                        {renderProductImages(curElm.images)}
                      </Slider>
                      <div className='icon'>
                        <li onClick={() => handleLike(curElm.id)}><AiFillHeart /></li>
                        <li onClick={() => detailpage(curElm)}><AiFillEye /></li>
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


/*import React, { useState, useEffect } from 'react';
import './shop.css';
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart, AiOutlineClose } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Slider from 'react-slick';

const Shop = ({ addtocart, searchResults }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState({});
  const [shop, setShop] = useState([]);
  const [categories, setCategories] = useState([]);
  const [likedMessage, setLikedMessage] = useState('');
  const [showLikedMessage, setShowLikedMessage] = useState(false);
  const [cartCount, setCartCount] = useState(parseInt(localStorage.getItem('cartCount')) || 0);
  const [userId, setUserId] = useState(null);
  const [autoplayIndex, setAutoplayIndex] = useState(null);

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
      
      const normalizedData = data.map(product => ({
        ...product,
        images: product.images ? product.images.replace(/[{}"]/g, '').split(',') : [],
      }));

      setShop(Array.isArray(normalizedData) ? normalizedData : []);
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
      console.error('Error fetching categories:', error);
    }
  };

  const getUserId = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await fetch('http://localhost:3001/api/user', {
          headers: { Authorization: `Bearer ${token}` },
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

  const settings = (index) => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: autoplayIndex === index,
    pauseOnHover: true,
  });

  const handleMouseEnter = (index) => {
    setAutoplayIndex(index);
  };

  const handleMouseLeave = () => {
    setAutoplayIndex(null);
  };

  const renderProductImages = (images) => {
    if (Array.isArray(images) && images.length > 0) {
      return images.map((image, index) => (
        <div key={index} className='img_box'>
          <img src={`http://localhost:3001${image.trim()}`} alt='Product' />
        </div>
      ));
    } else {
      return (
        <div className='img_box'>
          <img src='/uploads/placeholder.jpg' alt='Placeholder' />
        </div>
      );
    }
  };

  return (
    <>
      {showDetail && (
        <div className='product_detail'>
          <button className='close_btn' onClick={closeDetail}><AiOutlineClose /></button>
          <Slider {...settings(null)}>
            {renderProductImages(detail.images)}
          </Slider>
          <div className='info'>
            <h4># {detail.category}</h4>
            <h2>{detail.name}</h2>
            <p>{detail.details}</p>
            <h3>{detail.price} Mad</h3>
            <button onClick={() => addToCart(detail)}>Ajouter au panier</button>
          </div>
        </div>
      )}

      <div className='shop'>
        {showLikedMessage && <div className="liked-message">{likedMessage}</div>}
        <h2>Boutique</h2>
        <div className='container'>
          <div className='left_box'>
            <div className='category'>
              <div className='header'>
                <h3>All categories</h3>
              </div>
              <div className='box'>
                <ul>
                  <li onClick={allcatfilter}># Toutes</li>
                  {categories.map((category) => (
                    <li key={category.id} onClick={() => filtercate(category.name)}>{`# ${category.name}`}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='banner'>
              <div className='img_box'>
                <img src='image/shop_left.jpg' alt='' />
              </div>
            </div>
          </div>
          <div className='right_box'>
            <div className='product_box'>
              <h2>Boutique des produits</h2>
              <div className='product_container'>
                {shop.map((curElm, index) => (
                  <div key={curElm.id} className='box' onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>

<div className='img_box'>
                      <Slider {...settings(index)}>
                        {renderProductImages(curElm.images)}
                      </Slider>
                      <div className='icon'>
                        <li onClick={() => handleLike(curElm.id)}><AiFillHeart /></li>
                        <li onClick={() => detailpage(curElm)}><AiFillEye /></li>
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
          <div className='banner'>
            <div className='img_box'>
              <img src='image/shop_top.jpg' alt='' />
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

export default Shop;*/