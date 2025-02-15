/*import React, { useState, useEffect } from 'react';
import './topProducts.css'; // Assurez-vous que le CSS est lié correctement
import { AiFillStar, AiOutlineShoppingCart } from 'react-icons/ai';

const TopProducts = ({ addtocart }) => {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');
            const data = await response.json();
            const topProducts = data.filter((x) => x.types && x.types.includes('top'));
            setTopProducts(topProducts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching top products:', error);
            setLoading(false);
        }
    };

    const filterProducts = async (category) => {
        setFilter(category);
        setLoading(true);
        try {
            let url = `http://localhost:3001/api/products?type=top`;
            if (category !== 'all') {
                url += `&category=${category}`;
            }
            const response = await fetch(url);
            const data = await response.json();
            const filteredProducts = data.filter((x) => x.types && x.types.includes('top'));
            setTopProducts(filteredProducts);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching filtered products:', error);
            setLoading(false);
        }
    };

    return (
        <div className="topProducts">
            <div className="banner">
                <h2>Top Products</h2>
                <p>Discover our most popular products</p>
            </div>
            <div className="filters">
                <button onClick={() => filterProducts('all')}>All</button>
                <button onClick={() => filterProducts('electronics')}>Electronics</button>
                <button onClick={() => filterProducts('fashion')}>Fashion</button>
                <button onClick={() => filterProducts('home')}>Home</button>
            </div>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <div className="products_grid">
                    {topProducts.map(product => (
                        <div key={product.id} className="product_card">
                            <img src={`http://localhost:3001${product.image}`} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p>{product.price} MAD</p>
                            <div className="rating">
                                {[...Array(Math.min(product.likes, 5))].map((_, i) => (
                                    <AiFillStar key={i} />
                                ))}
                                <span>{product.likes} likes</span>
                            </div>
                            <button onClick={() => addtocart(product)}>
                                <AiOutlineShoppingCart /> Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TopProducts;
*/
import React, { useState, useEffect } from 'react';
import { FaCartPlus, FaClipboardList, FaCreditCard, FaTruckLoading, FaMapMarkerAlt } from 'react-icons/fa';
import './TrackOrder.css';

const TrackOrder = ({ match }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const trackingNumber = match.params.trackingNumber;

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const response = await fetch(`/api/track-order/${trackingNumber}`);
        if (!response.ok) {
          throw new Error('Tracking number not found');
        }
        const data = await response.json();
        setTrackingInfo(data);
        updateActiveStep(data.status);
      } catch (error) {
        console.error('Erreur lors du suivi de la commande :', error);
        setTrackingInfo({ error: 'Tracking number not found' });
      }
    };

    fetchTrackingInfo();
  }, [trackingNumber]);

  const updateActiveStep = (status) => {
    switch (status) {
      case 'pending':
        setActiveStep(1);
        break;
      case 'validated':
        setActiveStep(2);
        break;
      case 'shipped':
        setActiveStep(3);
        break;
      case 'delivered':
        setActiveStep(4);
        break;
      case 'cancelled':
        setActiveStep(5);
        break;
      default:
        setActiveStep(1);
        break;
    }
  };

  return (
    <div className="main">
      <div className="head">
        <p className="head_1">Suivi de Commande <span>Progress Bar Animée</span></p>
        <p className="head_2">Suivez votre commande étape par étape</p>
      </div>
      <ul>
        <li>
          <FaCartPlus className="icon" />
          <div className={`progress one ${activeStep >= 1 ? 'active' : ''}`}>
            <p>1</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Ajouté au Panier</p>
        </li>
        <li>
          <FaClipboardList className="icon" />
          <div className={`progress two ${activeStep >= 2 ? 'active' : ''}`}>
            <p>2</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Détails Remplis</p>
        </li>
        <li>
          <FaCreditCard className="icon" />
          <div className={`progress three ${activeStep >= 3 ? 'active' : ''}`}>
            <p>3</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Paiement Effectué</p>
        </li>
        <li>
          <FaTruckLoading className="icon" />
          <div className={`progress four ${activeStep >= 4 ? 'active' : ''}`}>
            <p>4</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Commande en Cours</p>
        </li>
        <li>
          <FaMapMarkerAlt className="icon" />
          <div className={`progress five ${activeStep >= 5 ? 'active' : ''}`}>
            <p>5</p>
            <i className="uil uil-check"></i>
          </div>
          <p className="text">Commande Arrivée</p>
        </li>
      </ul>
    </div>
  );
};

export default TrackOrder;
