import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, saveProduct }) => {
  const [name, setName] = useState(product ? product.name : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [quantity, setQuantity] = useState(product ? product.quantity : 0); // Ajouter le champ quantité
  const [category, setCategory] = useState(product ? product.category : '');
  const [details, setDetails] = useState(product ? product.details : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = { name, price, quantity, category, details };
    saveProduct(newProduct);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nom du produit:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Prix:</label>
        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <div>
        <label>Quantité en stock:</label>
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required /> {/* Champ quantité */}
      </div>
      <div>
        <label>Catégorie:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
      </div>
      <div>
        <label>Détails:</label>
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} required />
      </div>
      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default ProductForm;
