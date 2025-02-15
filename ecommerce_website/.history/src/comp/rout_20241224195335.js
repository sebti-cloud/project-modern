import React from "react";
import { Routes, Route } from "react-router-dom"; // Importation manquante ajoutée
import Home from './home';
import Shop from './shop'; 
import Cart from "./cart";
import Contact from "./contact"; 

const Rout = ({ shop, Filter, allcatfilter, addtocart, cart, setCart, fetchProducts, searchproduct }) => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home shop={shop} fetchProducts={fetchProducts} addtocart={addtocart} searchproduct={searchproduct} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/shop" element={<Shop shop={shop} Filter={Filter} allcatfilter={allcatfilter} addtocart={addtocart} fetchProducts={fetchProducts} />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </>
  );
};

export default Rout;
