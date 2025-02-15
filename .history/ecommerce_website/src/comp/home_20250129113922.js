import React, { useState, useEffect } from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart, AiOutlineClose } from 'react-icons/ai';
import Slider from 'react-slick';

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

  useEffect(() => {
    fetchProducts();
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
      const response = await fetch('http://localhost:3001/api/promotions');
      const text = await response.text(); // Lire la réponse en tant que texte
      console.log('Response from promotions API:', text); // Log de la réponse

      const promotions = JSON.parse(text); // Convertir la réponse en JSON

      return products.map(product => {
        const promotion = promotions.find(promo => promo.product_id === product.id);
        if (promotion) {
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



  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products');
      const data = await response.json();

      const normalizedData = data.map(product => ({
        ...product,
        images: product.images ? product.images.replace(/[{}"]/g, '').split(',') : [],
      }));

      const productsWithPromotions = await applyPromotions(normalizedData);

      const newProducts = productsWithPromotions.filter(product => product.types.includes('new'));
      const featuredProducts = productsWithPromotions.filter(product => product.types.includes('featured'));
      const topProducts = productsWithPromotions.filter(product => product.types.includes('top'));
      const trendingProducts = productsWithPromotions;

      console.log('New Products:', newProducts); // Log des nouveaux produits
      console.log('Featured Products:', featuredProducts); // Log des produits spéciaux
      console.log('Top Products:', topProducts); // Log des produits les plus vendus
      console.log('Trending Products:', trendingProducts); // Log des produits tendance

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
    const originalPrice = product.original_price ? product.original_price : product.price;
    const discountedPrice = product.price;

    if (originalPrice !== discountedPrice) {
      return (
        <p>
          <span className='old-price'>{originalPrice} MAD</span>
          <span className='new-price'>{discountedPrice} MAD</span>
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
                  <h3 onClick={() => {
                    console.log('Setting Trending Product to New Products:', newProduct); // Log des nouveaux produits
                    setTrendingProduct(newProduct);
                  }}>Nouveaux</h3>
                  <h3 onClick={() => {
                    console.log('Setting Trending Product to Featured Products:', featuredProduct); // Log des produits spéciaux
                    setTrendingProduct(featuredProduct);
                  }}>Spéciaux</h3>
                  <h3 onClick={() => {
                    console.log('Setting Trending Product to Top Products:', topProduct); // Log des produits les plus vendus
                    setTrendingProduct(topProduct);
                  }}>Top Selling</h3>
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

/*import React, { useState, useEffect } from "react";
import './home.css';
import { Link } from "react-router-dom";
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";

const Home = ({ addtocart, searchResults }) => { 
    const [newProduct, setNewProduct] = useState([]);
    const [featuredProduct, setFeaturedProduct] = useState([]);
    const [topProduct, setTopProduct] = useState([]);
    const [trendingProduct, setTrendingProduct] = useState([]);
    const [showDetail, setShowDetail] = useState(false);
    const [detail, setDetail] = useState([]);
    const [cartCount, setCartCount] = useState(parseInt(localStorage.getItem('cartCount')) || 0);
    const [likedMessage, setLikedMessage] = useState('');
    const [showLikedMessage, setShowLikedMessage] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (searchResults && searchResults.length > 0) {
            setTrendingProduct(searchResults);
        }
    }, [searchResults]);

    useEffect(() => {
        localStorage.setItem('cartCount', cartCount);
    }, [cartCount]);

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
        const newProducts = products.filter((x) => x.types && x.types.includes('new'));
        setNewProduct(newProducts);

        const featuredProducts = products.filter((x) => x.types && x.types.includes('featured'));
        setFeaturedProduct(featuredProducts);

        const topProducts = products.filter((x) => x.types && x.types.includes('top'));
        setTopProduct(topProducts);
    };

    const placeholderImage = "/uploads/placeholder.jpg";

    const renderProductImage = (imagePath) => {
        return imagePath && imagePath.trim() !== "" ? `http://localhost:3001${imagePath}` : placeholderImage;
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

    return (
<>
    {showDetail ? (
        <div className='product_detail'>
            <button className='close_btn' onClick={closeDetail}><AiOutlineClose /></button>
                <div className='img_box'>
                    <img src={`http://localhost:3001${detail.image}`} alt='' />
                </div>
                <div className='info'>
                    <h4># {detail.types.join(', ')}</h4>
                    <h2>{detail.name}</h2>
                    <p>{detail.details}</p>
                    <h3>{detail.price} MAD</h3>
                    <button onClick={() => addToCart(detail)}>Ajouter au panier</button>
                </div>
            </div>
    ) : null}




            <div className="home">
                <div id="about-us" className="top_banner">
                    <div className="contant">
                        <h3>silver aluminum</h3>
                        <h2>Apple Watch</h2>
                        <p>30% de réduction sur votre première commande</p>
                        <Link to='/shop' className="link">Achetez maintenant</Link>
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

                <div id="trending-product" className="trending">
                    <div className="container">
                        <div className='left_box'>
                            <div className="header">
                                <div className="heading">
                                    <h2>Produits tendance</h2>
                                </div>
                                <div className="cate">
                                    <h3 onClick={() => setTrendingProduct(newProduct)}>Nouveaux</h3>
                                    <h3 onClick={() => setTrendingProduct(featuredProduct)}>Spéciaux</h3>
                                    <h3 onClick={() => setTrendingProduct(topProduct)}>Top Selling</h3>
                                </div>
                            </div>
                            <div className="products">
                                <div className="container">
                                    {trendingProduct.map((curElm) => (
                                        <div key={curElm.id} className='box'>
                                            <div className='img_box'>
                                                <img src={renderProductImage(curElm.image)} alt={curElm.name || 'Product'} />
                                           
                                            </div>
                                     
                                            <div className="detail">
                                        <h3>{curElm.name}</h3>
                                        <p>{curElm.price} Mad</p>
                                        <div className="icon">
                                            <button onClick={() => detailpage(curElm)}><AiFillEye /></button>
                                            <button onClick={() => addToCart(curElm)}><AiOutlineShoppingCart /></button>
                                            <button onClick={() => handleLike(curElm)}><AiFillHeart /></button>
                                        </div>
                                    </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                
                <div id="new-product" className="product_type">
                    <div className="container">
                        <div className="box">
                            <div className="header">
                                <h2>Nouveaux Produits</h2>
                            </div>
                            {Array.isArray(newProduct) && newProduct.map((curElm) => (
                                <div key={curElm.id} className="productbox">
                                    <div className="img-box">
                                        <img src={renderProductImage(curElm.image)} alt={curElm.name || 'New Product'} />
                                    </div>
                                    
                                    <div className="detail">
                                        <h3>{curElm.name}</h3>
                                        <p>{curElm.price} Mad</p>
                                        <div className="icon">
                                            <button onClick={() => detailpage(curElm)}><AiFillEye /></button>
                                            <button onClick={() => addToCart(curElm)}><AiOutlineShoppingCart /></button>
                                            <button onClick={() => handleLike(curElm)}><AiFillHeart /></button>
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