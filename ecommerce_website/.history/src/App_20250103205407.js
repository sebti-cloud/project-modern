import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Nav from './comp/nav';
import Rout from './comp/rout';
import Footer from './comp/footer';
import Homeproduct from './comp/home_product';
import AdminDashboard from './comp/AdminDashboard';
import About from './comp/About';
import Account from './comp/Account';
import Payment from './comp/Payment';
import Sales from './comp/Sales';
import Delivery from './comp/Delivery';
import TrackOrder from './comp/TrackOrder';
import TopProducts from './comp/TopProducts';
import OldProduct from './comp/OldProduct';
import AddAdmin from './comp/AddAdmin';
import Products from './comp/Products';
import Orders from './comp/Orders';
import LikedProducts from './comp/LikedProducts';
import Categories from './comp/Categories';
import AdminContacts from './comp/AdminContacts';
import AdminList from './comp/AdminList';
import Cart from './comp/cart';
import Register from './comp/Register';
import Login from './comp/Login';
import UserProfile from './comp/UserProfile';

const App = () => {
  const [cart, setCart] = useState([]);
  const [shop, setShop] = useState(Homeproduct);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [salesProducts, setSalesProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [oldProducts, setOldProducts] = useState([]);

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

  const fetchSalesProducts = async (category = 'all') => {
    try {
      let url = 'http://localhost:3001/api/salesProducts';
      if (category !== 'all') {
        url += `?category=${category}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSalesProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching sales products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSalesProducts();
  }, []);

  const Filter = (x) => {
    fetchProducts(x);
  };

  const allcatfilter = () => {
    fetchProducts();
  };

  const searchproduct = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/search?query=${search}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const addtocart = (product) => {
    const exist = cart.find((x) => x.id === product.id);
    if (exist) {
      alert("This product already exists in your cart");
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
      alert("Added to cart");
    }
  };

  return (
    <Router>
      <Nav search={search} setSearch={setSearch} searchproduct={searchproduct} setSearchResults={setSearchResults} />
      <Routes>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/add-admin" element={<AddAdmin />} />
        <Route path="/about" element={<About />} />
        <Route path="/account" element={<Account />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/sales" element={<Sales salesProducts={salesProducts} fetchSalesProducts={fetchSalesProducts} addtocart={addtocart} />} />
        <Route path="/delivery" element={<Delivery trackOrder={() => { }} />} />
        <Route path="/track-order" element={<TrackOrder />} />
        <Route path="/top-products" element={<TopProducts topProducts={topProducts} fetchTopProducts={() => { }} addtocart={addtocart} />} />
        <Route path="/old-product" element={<OldProduct oldProducts={oldProducts} fetchOldProducts={() => { }} addtocart={addtocart} />} />
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/likedProducts" element={<LikedProducts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contacts" element={<AdminContacts />} />
        <Route path="/admins" element={<AdminList />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/*" element={
          <Rout setCart={setCart} cart={cart} shop={shop} Filter={Filter} allcatfilter={allcatfilter} addtocart={addtocart} fetchProducts={fetchProducts} searchproduct={searchproduct} searchResults={searchResults} />
        } />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
