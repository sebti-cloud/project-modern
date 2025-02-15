import React, { useState, useEffect } from 'react';

const UserLikedProducts = () => {
  const [likedProducts, setLikedProducts] = useState([]);

  useEffect(() => {
    const fetchLikedProducts = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/products/liked', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setLikedProducts(data);
    };

    fetchLikedProducts();
  }, []);

  return (
    <div>
      <h2>Liked Products</h2>
      <ul>
        {likedProducts.map(product => (
          <li key={product.id}>Product Name: {product.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserLikedProducts;
