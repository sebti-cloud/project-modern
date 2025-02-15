import React, { useState, useEffect } from 'react';
import './shop.css';
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart, AiOutlineClose } from "react-icons/ai";
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Slider from "react-slick"; // Importer la bibliothèque react-slick

const Shop = ({ addtocart, searchResults }) => {
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState([]);
  const [shop, setShop] = useState([]);
  const [categories, setCategories] = useState([]);
  const [likedMessage, setLikedMessage] = useState('');
  const [showLikedMessage, setShowLikedMessage] = useState(false);
  const [userId, setUserId] = useState(null); // Ajouter l'état pour stocker l'ID utilisateur

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    getUserId(); // Récupérer l'ID utilisateur lors du chargement
  }, []);

  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setShop(searchResults);
    }
  }, [searchResults]);

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
        setUserId(data.id); // Stocker l'ID utilisateur dans l'état
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
    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}/like`, {
        method: 'PUT',
      });

      if (response.ok) {
        fetchProducts(); // Mettre à jour la liste des produits après avoir aimé
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

  const placeholderImage = "/uploads/placeholder.jpg";

  const renderProductImages = (images) => {
    if (images && images.length > 0) {
      return images.map((image, index) => (
        <img key={index} src={`http://localhost:3001${image}`} alt="Product" />
      ));
    } else {
      return <img src={placeholderImage} alt="Placeholder" />;
    }
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  return (
    <>
      {showDetail ? (
        <div className='product_detail'>
          <button className='close_btn' onClick={closeDetail}><AiOutlineClose /></button>
          <Slider {...settings}>
            {detail.images && detail.images.length > 0 ? (
              detail.images.map((image, index) => (
                <div key={index} className='img_box'>
                  <img src={`http://localhost:3001${image}`} alt='Product' />
                </div>
              ))
            ) : (
              <div className='img_box'>
                <img src={placeholderImage} alt='Placeholder' />
              </div>
            )}
          </Slider>
          <div className='info'>
            <h4># {detail.category}</h4>
            <h2>{detail.name}</h2>
            <p>{detail.details}</p>
            <h3>{detail.price} MAD</h3>
            <button onClick={() => addtocart(detail)}>Ajouter au panier</button>
          </div>
        </div>
      ) : null}
      <div className='shop'>
        {showLikedMessage && <div className="liked-message">{likedMessage}</div>}
        <h2>Boutique</h2>
        <div className='container'>
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
                <img src='image/shop_left.jpg' alt='Shop Left' />
              </div>
            </div>
          </div>
          <div className='right_box'>
            <div className='product_box'>
              <h2>Boutique des produits</h2>
              <div className='product_container'>
                {shop.map((curElm) => (
                  <div key={curElm.id} className='box'>
                    <div className='img_box'>
                      {curElm.images && curElm.images.length > 0 ? (
                        <Slider {...settings}>
                          {curElm.images.map((image, index) => (
                            <div key={index} className='img_box'>
                              <img src={`http://localhost:3001${image}`} alt={curElm.name} />
                            </div>
                          ))}
                        </Slider>
                      ) : (
                        <img src={placeholderImage} alt='Placeholder' />
                      )}
                      <div className='icon'>
                        <li onClick={() => handleLike(curElm.id)}><AiFillHeart /></li>
                        <li onClick={() => detailpage(curElm)}><AiFillEye /></li>
                      </div>
                    </div>
                    <div className='detail'>
                      <h3>{curElm.name}</h3>
                      <p>{curElm.price} MAD</p>
                      <button onClick={() => addtocart(curElm)}>Ajouter au panier</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className='banner'>
            <div className='img_box'>
              <img src='image/shop_top.jpg' alt='Shop Top' />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;


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