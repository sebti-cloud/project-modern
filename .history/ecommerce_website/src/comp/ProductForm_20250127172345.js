import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, saveProduct }) => {
  const [name, setName] = useState(product ? product.name : '');
  const [price, setPrice] = useState(product ? product.price : '');
  const [quantity, setQuantity] = useState(product ? product.quantity : 0);
  const [category, setCategory] = useState(product ? product.category : '');
  const [details, setDetails] = useState(product ? product.details : '');
  const [selectedFiles, setSelectedFiles] = useState([]); // Ajout de l'état pour les fichiers sélectionnés

  const handleFileChange = (e) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const files = Array.from(e.target.files).filter(file => allowedTypes.includes(file.type));
    if (files.length !== e.target.files.length) {
      alert('Certaines images n\'ont pas été téléchargées car elles ne sont pas dans un format valide.');
    }
    setSelectedFiles(files);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);
    formData.append('quantity', quantity);
    formData.append('category', category);
    formData.append('details', details);

    selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    saveProduct(formData);
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
        <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
      </div>
      <div>
        <label>Catégorie:</label>
        <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
      </div>
      <div>
        <label>Détails:</label>
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} required />
      </div>
      <div>
        <label>Images:</label>
        <input type="file" multiple onChange={handleFileChange} />
      </div>
      <button type="submit">Enregistrer</button>
    </form>
  );
};

export default ProductForm;
