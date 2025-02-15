import React from "react";
import { Routes, Route } from "react-router-dom"; // Vérifiez cette importation
import Home from './home';
import Shop from './shop'; 
import Cart from "./cart";
import Contact from "./contact"; 

const Rout = ({ shop }) => {
  return (
    <div>
      {shop.length === 0 ? (
        <p>No products available</p>
      ) : (
        shop.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>{product.price}</p>
          </div>
        ))
      )}
    </div>
  );
};


export default Rout;
