import React, { useState } from 'react';
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
  // Shop category filter
  const Filter = (x) => {
    const catfilter = Homeproduct.filter((product) => {
      return product.cat === x;
    });
    setShop(catfilter);
  };
  const allcatfilter = () => {
    setShop(Homeproduct);
  };
  // Shop Search Filter
  const searchlength = (search || []).length === 0;

const searchproduct = () => {
  if (!search) {
    alert("Please Search Something!");
    setShop(Homeproduct);
  } else {
    const searchfilter = Homeproduct.filter((x) => {
      return (x.name && x.name.toLowerCase().includes(search.toLowerCase())) || 
             (x.cat && x.cat.toLowerCase().includes(search.toLowerCase()));
    });
    setShop(searchfilter);
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
          <Rout setCart={setCart} cart={cart} shop={shop} Filter={Filter} allcatfilter={allcatfilter} addtocart={addtocart} />
        } />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
