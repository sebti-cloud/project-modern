import React, { useState } from 'react';
import Nav from './comp/nav';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Rout from './comp/rout';
import Footer from './comp/footer';
import Homeproduct from './comp/home_product';
import AdminDashboard from './comp/AdminDashboard';
import About from './comp/About';

const App = () => {
  const [cart, setCart] = useState([]);
  const [shop, setShop] = useState(Homeproduct);
  const [search, setSearch] = useState('');
  
  const fetchProducts = async (category = '') => {
    try {
      const response = await fetch(`http://localhost:3001/api/products?category=${category}`);
      const data = await response.json();
      setShop(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const Filter = (x) => {
    fetchProducts(x);
  };

  const allcatfilter = () => {
    fetchProducts();
  };

  const searchproduct = async () => {
    if (!search) {
      alert("Please Search Something!");
      setShop(Homeproduct);
    } else {
      try {
        const response = await fetch(`http://localhost:3001/api/search?query=${encodeURIComponent(search)}`);
        if (response.ok) {
          const searchResults = await response.json();
          setShop(searchResults);
        } else {
          alert("Failed to search products.");
        }
      } catch (error) {
        console.error('Error searching products:', error);
        alert("Error searching products.");
      }
    }
  };

  const addtocart = (product) => {
    const exist = cart.find((x) => {
      return x.id === product.id;
    });
    if (exist) {
      alert("This product already exists in your cart");
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
      alert("Added to cart");
    }
  };

  return (
    <Router>
      <Nav search={search} setSearch={setSearch} searchproduct={searchproduct} />
      <Routes>
        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/about" element={<About />} />
        <Route path="/*" element={
          <Rout setCart={setCart} cart={cart} shop={shop} Filter={Filter} allcatfilter={allcatfilter} addtocart={addtocart} fetchProducts={fetchProducts} searchproduct={searchproduct} />
        } />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
