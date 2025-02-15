import React, { useState, useEffect } from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart, AiOutlineClose } from 'react-icons/ai';
import Slider from 'react-slick';
import Banner from './Banner';
import SliderComponent from './Slider'; // Renommé en SliderComponent pour éviter les conflits de noms
import axios from 'axios';

const Home = ({ addtocart, searchResults }) => {
  const [newProduct, setNewProduct] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const [topProduct, setTopProduct] = useState([]);
  const [trendingProduct, setTrendingProduct] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState({});
  const [cartCount, setCartCount] = useState(parseInt(localStorage.getItem('cartCount')) || 0);
  const [likedMessage, setLikedMessage] = useState('');
  const [showLikedMessage, setShowLikedMessage] = useState(false);
  const [autoplayIndex, setAutoplayIndex] = useState(null);

  const [banners, setBanners] = useState([]); // Assurer que `banners` est initialisé comme un tableau
  const [slides, setSlides] = useState([]); // Assurer que `slides` est initialisé comme un tableau

  const [visibleProducts, setVisibleProducts] = useState(10); // État pour suivre le nombre de produits affichés

  useEffect(() => {
    fetchProducts();
    fetchBanners();
    fetchSlides();
  }, []);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setTrendingProduct(searchResults);
    }
  }, [searchResults]);

  useEffect(() => {
    localStorage.setItem('cartCount', cartCount);
  }, [cartCount]);

  const applyPromotions = async (products) => {
    try {
      const response = await axios.get('http://localhost:3001/api/promotions');
      const promotions = await response.data;

      return products.map(product => {
        const promotion = promotions.find(promo => promo.product_id === product.id);
        if (promotion) {
          product.original_price = product.price; // Sauvegarder le prix original
          if (promotion.discount_type === 'percentage') {
            product.price = product.price * (1 - promotion.discount_value / 100);
          } else if (promotion.discount_type === 'fixed') {
            product.price = product.price - promotion.discount_value;
          }
        }
        return product;
      });
    } catch (error) {
      console.error('Error applying promotions:', error);
      return products;
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const fetchSlides = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/sliders');
      setSlides(response.data);
    } catch (error) {
      console.error('Error fetching slides:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products');
      const data = response.data;

      const normalizedData = data.map(product => ({
        ...product,
        images: product.images ? product.images.replace(/[{}"]/g, '').split(',') : [],
      }));

      const productsWithPromotions = await applyPromotions(normalizedData);

      const newProducts = productsWithPromotions.filter(product => product.types.includes('new'));
      const featuredProducts = productsWithPromotions.filter(product => product.types.includes('featured'));
      const topProducts = productsWithPromotions.filter(product => product.types.includes('top'));
      const trendingProducts = productsWithPromotions;

      setNewProduct(newProducts);
      setFeaturedProduct(featuredProducts);
      setTopProduct(topProducts);
      setTrendingProduct(trendingProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const loadMoreProducts = () => {
    setVisibleProducts(prevVisibleProducts => prevVisibleProducts + 10);
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

  const renderProductPrice = (product) => {
    if (product.original_price && product.original_price !== product.price) {
      return (
        <p>
          <span className='old-price'>{product.original_price} MAD</span>
          <span className='new-price'>{product.price} MAD</span>
        </p>
      );
    } else {
      return <p>{product.price} MAD</p>;
    }
  };

  const detailpage = (product) => {
    setDetail(product);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const addToCart = (product) => {
    addtocart(product);
    setCartCount(cartCount + 1);
  };

  const handleLike = (product) => {
    setLikedMessage(`Vous avez aimé ${product.name}`);
    setShowLikedMessage(true);
    setTimeout(() => setShowLikedMessage(false), 3000);
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
  return (
    <>
      {showDetail && (
        <div className='product_detail'>
          <button className='close_btn' onClick={closeDetail}><AiOutlineClose /></button>
          <Slider {...settings(null)}>
            {renderProductImages(detail.images)}
          </Slider>
          <div className='info'>
            <h4># {detail.types.join(', ')}</h4>
            <h2>{detail.name}</h2>
            <p>{detail.details}</p>
            <h3>{detail.price} MAD</h3>
            <button onClick={() => addToCart(detail)}>Ajouter au panier</button>
          </div>
        </div>
      )}

      <div className='home'>
        <div id='about-us' className='top_banner'>
          <div className='contant'>
            <h3>silver aluminum</h3>
            <h2>Apple Watch</h2>
            <p>30% de réduction sur votre première commande</p>
            <Link to='/shop' className='link'>
              Achetez maintenant
            </Link>
          </div>
        </div>

        {cartCount > 0 && (
          <Link to='/cart'>
            <div className='cart-icon'>
              <AiOutlineShoppingCart />
              <span className='cart-count'>{cartCount}</span>
            </div>
          </Link>
        )}

        {/* Ajout des bannières */}
        <div className="banners">
          {Array.isArray(banners) && banners.map((banner, index) => (
            <Banner key={index} image={`http://localhost:3001${banner.image_url}`} link={banner.link} />
          ))}
        </div>

        {/* Ajout des sliders */}
        <div className="sliders">
          {Array.isArray(slides) && slides.map((slide, index) => (
            <SliderComponent key={index} {...slide} />
          ))}
        </div>

        <div id='trending-product' className='trending'>
          <div className='container'>
            <div className='left_box'>
              <div className='header'>
                <div className='heading'>
                  <h2>Produits tendance</h2>
                </div>
                <div className='cate'>
                  <h3 onClick={() => setTrendingProduct(newProduct)}>Nouveaux</h3>
                  <h3 onClick={() => setTrendingProduct(featuredProduct)}>Spéciaux</h3>
                  <h3 onClick={() => setTrendingProduct(topProduct)}>Top Selling</h3>
                </div>
              </div>
              <div className='products'>
                {trendingProduct.slice(0, visibleProducts).map((curElm, index) => (
                  <div key={curElm.id} className='box' onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                    <div className='img_box'>
                      <Slider {...settings(index)}>
                        {renderProductImages(curElm.images)}
                      </Slider>
                    </div>
                    <div className='detail'>
                      <h3>{curElm.name}</h3>
                      {renderProductPrice(curElm)}
                      <div className='icon'>
                        <button onClick={() => detailpage(curElm)}>
                          <AiFillEye />
                        </button>
                        <button onClick={() => addToCart(curElm)}>
                          <AiOutlineShoppingCart />
                        </button>
                        <button onClick={() => handleLike(curElm)}>
                          <AiFillHeart />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {visibleProducts < trendingProduct.length && (
                <button onClick={loadMoreProducts} className='load-more-btn'>Afficher plus</button>
              )}
            </div>
          </div>
        </div>

        <div id='new-product' className='product_type'>
          <div className='container'>
            <div className='header'>
              <h2>Nouveaux Produits</h2>
            </div>
            <div className='product_container'>
              {newProduct.map((curElm, index) => (
                <div key={curElm.id} className='productbox' onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                  <div className='img_box'>
                    <Slider {...settings(index)}>
                      {renderProductImages(curElm.images)}
                    </Slider>
                  </div>
                  <div className='detail'>
                    <h3>{curElm.name}</h3>
                    <p>{curElm.price} Mad</p>
                    <div className='icon'>
                      <button onClick={() => detailpage(curElm)}>
                        <AiFillEye />
                      </button>
                      <button onClick={() => addToCart(curElm)}>
                        <AiOutlineShoppingCart />
                      </button>
                      <button onClick={() => handleLike(curElm)}>
                        <AiFillHeart />
                      </button>
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


/*import React, { useState, useEffect } from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart, AiOutlineClose } from 'react-icons/ai';
import Slider from 'react-slick';
import Banner from './Banner';
import SliderComponent from './Slider'; // Renommé en SliderComponent pour éviter les conflits de noms
import axios from 'axios';

const Home = ({ addtocart, searchResults }) => {
  const [newProduct, setNewProduct] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState([]);
  const [topProduct, setTopProduct] = useState([]);
  const [trendingProduct, setTrendingProduct] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState({});
  const [cartCount, setCartCount] = useState(parseInt(localStorage.getItem('cartCount')) || 0);
  const [likedMessage, setLikedMessage] = useState('');
  const [showLikedMessage, setShowLikedMessage] = useState(false);
  const [autoplayIndex, setAutoplayIndex] = useState(null);

  const [banners, setBanners] = useState([]);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    fetchProducts();
    fetchBanners();
    fetchSlides();
  }, []);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setTrendingProduct(searchResults);
    }
  }, [searchResults]);

  useEffect(() => {
    localStorage.setItem('cartCount', cartCount);
  }, [cartCount]);

  const applyPromotions = async (products) => {
    try {
      const response = await axios.get('http://localhost:3001/api/promotions');
      const promotions = await response.data;

      return products.map(product => {
        const promotion = promotions.find(promo => promo.product_id === product.id);
        if (promotion) {
          product.original_price = product.price; // Sauvegarder le prix original
          if (promotion.discount_type === 'percentage') {
            product.price = product.price * (1 - promotion.discount_value / 100);
          } else if (promotion.discount_type === 'fixed') {
            product.price = product.price - promotion.discount_value;
          }
        }
        return product;
      });
    } catch (error) {
      console.error('Error applying promotions:', error);
      return products;
    }
  };

  const fetchBanners = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const fetchSlides = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/sliders');
      setSlides(response.data);
    } catch (error) {
      console.error('Error fetching slides:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/products');
      const data = response.data;

      const normalizedData = data.map(product => ({
        ...product,
        images: product.images ? product.images.replace(/[{}"]/g, '').split(',') : [],
      }));

      const productsWithPromotions = await applyPromotions(normalizedData);

      const newProducts = productsWithPromotions.filter(product => product.types.includes('new'));
      const featuredProducts = productsWithPromotions.filter(product => product.types.includes('featured'));
      const topProducts = productsWithPromotions.filter(product => product.types.includes('top'));
      const trendingProducts = productsWithPromotions;

      setNewProduct(newProducts);
      setFeaturedProduct(featuredProducts);
      setTopProduct(topProducts);
      setTrendingProduct(trendingProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
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

  const renderProductPrice = (product) => {
    if (product.original_price && product.original_price !== product.price) {
      return (
        <p>
          <span className='old-price'>{product.original_price} MAD</span>
          <span className='new-price'>{product.price} MAD</span>
        </p>
      );
    } else {
      return <p>{product.price} MAD</p>;
    }
  };

  const detailpage = (product) => {
    setDetail(product);
    setShowDetail(true);
  };

  const closeDetail = () => {
    setShowDetail(false);
  };

  const addToCart = (product) => {
    addtocart(product);
    setCartCount(cartCount + 1);
  };

  const handleLike = (product) => {
    setLikedMessage(`Vous avez aimé ${product.name}`);
    setShowLikedMessage(true);
    setTimeout(() => setShowLikedMessage(false), 3000);
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

  return (
    <>
      {showDetail && (
        <div className='product_detail'>
          <button className='close_btn' onClick={closeDetail}><AiOutlineClose /></button>
          <Slider {...settings(null)}>
            {renderProductImages(detail.images)}
          </Slider>
          <div className='info'>
            <h4># {detail.types.join(', ')}</h4>
            <h2>{detail.name}</h2>
            <p>{detail.details}</p>
            <h3>{detail.price} MAD</h3>
            <button onClick={() => addToCart(detail)}>Ajouter au panier</button>
          </div>
        </div>
      )}

      <div className='home'>
        <div id='about-us' className='top_banner'>
          <div className='contant'>
            <h3>silver aluminum</h3>
            <h2>Apple Watch</h2>
            <p>30% de réduction sur votre première commande</p>
            <Link to='/shop' className='link'>
              Achetez maintenant
            </Link>
          </div>
        </div>

        {cartCount > 0 && (
          <Link to='/cart'>
            <div className='cart-icon'>
              <AiOutlineShoppingCart />
              <span className='cart-count'>{cartCount}</span>
            </div>
          </Link>
        )}

    
 
        <div id='trending-product' className='trending'>
          <div className='container'>
            <div className='left_box'>
              <div className='header'>
                <div className='heading'>
                  <h2>Produits tendance</h2>
                </div>
                <div className='cate'>
                  <h3 onClick={() => setTrendingProduct(newProduct)}>Nouveaux</h3>
                  <h3 onClick={() => setTrendingProduct(featuredProduct)}>Spéciaux</h3>
                  <h3 onClick={() => setTrendingProduct(topProduct)}>Top Selling</h3>
                </div>
              </div>
              <div className='products'>
                {trendingProduct.map((curElm, index) => (
                  <div key={curElm.id} className='box' onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                    <div className='img_box'>
                      <Slider {...settings(index)}>
                        {renderProductImages(curElm.images)}
                      </Slider>
                    </div>
                                        <div className='detail'>
                      <h3>{curElm.name}</h3>
                      {renderProductPrice(curElm)}
                      <div className='icon'>
                        <button onClick={() => detailpage(curElm)}>
                          <AiFillEye />
                        </button>
                        <button onClick={() => addToCart(curElm)}>
                          <AiOutlineShoppingCart />
                        </button>
                        <button onClick={() => handleLike(curElm)}>
                          <AiFillHeart />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div id='new-product' className='product_type'>
          <div className='container'>
            <div className='header'>
              <h2>Nouveaux Produits</h2>
            </div>
            <div className='product_container'>
              {newProduct.map((curElm, index) => (
                <div key={curElm.id} className='productbox' onMouseEnter={() => handleMouseEnter(index)} onMouseLeave={handleMouseLeave}>
                  <div className='img_box'>
                    <Slider {...settings(index)}>
                      {renderProductImages(curElm.images)}
                    </Slider>
                  </div>
                  <div className='detail'>
                    <h3>{curElm.name}</h3>
                    <p>{curElm.price} Mad</p>
                    <div className='icon'>
                      <button onClick={() => detailpage(curElm)}>
                        <AiFillEye />
                      </button>
                      <button onClick={() => addToCart(curElm)}>
                        <AiOutlineShoppingCart />
                      </button>
                      <button onClick={() => handleLike(curElm)}>
                        <AiFillHeart />
                      </button>
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
*/