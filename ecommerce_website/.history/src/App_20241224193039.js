import React, { useState, useEffect } from 'react';
import Nav from './comp/nav';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Rout from './comp/rout';
import Footer from './comp/footer';
import Homeproduct from './comp/home_product';
import AdminDashboard from './comp/AdminDashboard';
import About from './comp/About'; // Importez le composant About

const App = () => {
  // Add to cart
  const [cart, setCart] = useState([]);
  // Shop page product
  const [shop, setShop] = useState(Homeproduct);
  // Shop Search Filter
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

  // Shop category filter
  const Filter = (x) => {
    fetchProducts(x);
  };

  const allcatfilter = () => {
    fetchProducts();
  };

  // Shop Search Filter
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

  // Add to cart
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
        <Route path="/about" element={<About />} /> {/* Ajoutez la route pour About */}
        <Route path="/*" element={
          <Rout setCart={setCart} cart={cart} shop={shop} Filter={Filter} allcatfilter={allcatfilter} addtocart={addtocart} fetchProducts={fetchProducts} />
        } />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
