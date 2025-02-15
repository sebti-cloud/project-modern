/*import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './admin.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', category: '', types: [], price: '', details: '' });
    const [editProduct, setEditProduct] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (editProduct) {
            if (name === 'types') {
                const types = Array.from(e.target.selectedOptions, option => option.value);
                setEditProduct({ ...editProduct, types });
            } else {
                setEditProduct({ ...editProduct, [name]: value });
            }
        } else {
            if (name === 'types') {
                const types = Array.from(e.target.selectedOptions, option => option.value);
                setNewProduct({ ...newProduct, types });
            } else {
                setNewProduct({ ...newProduct, [name]: value });
            }
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newProduct.name);
        formData.append('category', newProduct.category);
        formData.append('types', JSON.stringify(newProduct.types)); // Convertir types en chaîne JSON
        formData.append('price', newProduct.price);
        formData.append('details', newProduct.details);
        formData.append('image', selectedFile);
        try {
            const response = await fetch('http://localhost:3001/api/products', {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                fetchProducts();
                setNewProduct({ name: '', category: '', types: [], price: '', details: '' });
                setSelectedFile(null);
                alert('Product added successfully!', 'alert-success');
            } else {
                alert('Failed to add product.', 'alert-danger');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    const handleEditProduct = (product) => {
        setEditProduct(product);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editProduct.name);
        formData.append('category', editProduct.category);
        formData.append('types', JSON.stringify(editProduct.types || [])); // Assurer types est un tableau
        formData.append('price', editProduct.price);
        formData.append('details', editProduct.details);
        if (selectedFile) {
            formData.append('image', selectedFile);
        }
        try {
            const response = await fetch(`http://localhost:3001/api/products/${editProduct.id}`, {
                method: 'PUT',
                body: formData,
            });
            if (response.ok) {
                fetchProducts();
                setEditProduct(null);
                setSelectedFile(null);
                alert('Product updated successfully!', 'alert-success');
            } else {
                const errorText = await response.text();
                alert(`Failed to update product: ${errorText}`, 'alert-danger');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    const handleDeleteProduct = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/products/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchProducts();
                alert('Product deleted successfully!', 'alert-success');
            } else {
                alert('Failed to delete product.', 'alert-danger');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <nav>
                <ul>
                    <li><Link to="/products">Produits</Link></li>
                    <li><Link to="/orders">Commandes</Link></li>
                    <li><Link to="/likedProducts">Produits aimés</Link></li>
                    <li><Link to="/categories">Catégories</Link></li>
                    <li><Link to="/contacts">Messages</Link></li>
                    <li><Link to="/admins">Administrateurs</Link></li>
                    <li><Link to="/admin-settings">Settings</Link></li>
                    <li><Link to="/admin-users">Utilisateurs</Link></li> 
                </ul>
            </nav>
            <div className="products">
                <h2 className="products-header">Products</h2>
                <form onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}>
                    <input type="text" name="name" placeholder="Name" value={editProduct ? editProduct.name : newProduct.name} onChange={handleChange} required />
                    <input type="text" name="category" placeholder="Category" value={editProduct ? editProduct.category : newProduct.category} onChange={handleChange} required />
                    <select name="types" value={editProduct ? editProduct.types : newProduct.types} onChange={handleChange}  required>
                        <option value="featured">Featured</option>
                        <option value="new">New</option>
                        <option value="top">Top</option>
                        <option value="sale">Sale</option>
                    </select>
                    <input type="number" name="price" placeholder="Price" value={editProduct ? editProduct.price : newProduct.price} onChange={handleChange} required />
                    <textarea name="details" className="details" placeholder="Details" value={editProduct ? editProduct.details : newProduct.details} onChange={handleChange} required />
                    <input type="file" name="image" onChange={handleFileChange} required={!editProduct} />
                    <button type="submit">{editProduct ? 'Update Product' : 'Add Product'}</button>
                </form>
                <table className="products-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Types</th>
                            <th>Price</th>
                            <th>Details</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id}>
                                <td><img src={`http://localhost:3001${product.image}`} alt={product.name} className="product-image" /></td>
                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>{product.types ? product.types.join(', ') : 'No types'}</td>
                                <td>{product.price} MAD</td>
                                <td>{product.details}</td>
                                <td>
                                    <button onClick={() => handleEditProduct(product)} className="edit-button">Edit</button>
                                    <button onClick={() => handleDeleteProduct(product.id)} className="delete-button">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;
*/import React, { useState, useEffect } from 'react';
import './home.css';
import { Link } from 'react-router-dom';
import { AiFillEye, AiFillHeart, AiOutlineShoppingCart, AiOutlineClose } from 'react-icons/ai';
import Slider from "react-slick";

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

  const fetchProducts = async (category = '') => {
    try {
      let url = 'http://localhost:3001/api/products';
      if (category) {
        url += `?category=${category}`;
      }
      const response = await fetch(url);
      const data = await response.json();

      // Normaliser les données pour s'assurer que `images` est un tableau
      const normalizedData = data.map(product => ({
        ...product,
        images: product.images
          ? product.images.replace(/[{}"]/g, '').split(',') // Convertir la chaîne JSON en tableau
          : [],
      }));

      setTrendingProduct(Array.isArray(normalizedData) ? normalizedData : []);
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
      {showDetail && (
        <div className='product_detail'>
          <button className='close_btn' onClick={closeDetail}>
            <AiOutlineClose />
          </button>
          <Slider {...settings}>
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
                {trendingProduct.map((curElm) => (
                  <div key={curElm.id} className='box'>
                    <div className='img_box'>
                      <Slider {...settings}>
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

        <div id='new-product' className='product_type'>
          <div className='container'>
            <div className='box'>
              <div className='header'>
                <h2>Nouveaux Produits</h2>
              </div>
              {Array.isArray(newProduct) &&
                newProduct.map((curElm) => (
                  <div key={curElm.id} className='productbox'>
                    <div className='img_box'>
                      <Slider {...settings}>
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
