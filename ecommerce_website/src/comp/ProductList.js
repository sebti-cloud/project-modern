import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProductForm.css';

const ProductForm = ({ saveProduct }) => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [lowStockThreshold, setLowStockThreshold] = useState(0);
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierId, setSupplierId] = useState('');

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
    fetchSuppliers();
  }, [productId]);

  const fetchProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`);
      const data = await response.json();
      setProduct(data);
      setName(data.name);
      setPrice(data.price);
      setQuantity(data.quantity);
      setLowStockThreshold(data.low_stock_threshold);
      setCategory(data.category);
      setDetails(data.details);
      setSupplierId(data.supplier_id);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/suppliers');
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

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
    formData.append('lowStockThreshold', lowStockThreshold);
    formData.append('category', category);
    formData.append('details', details);
    formData.append('supplierId', supplierId);

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
        <label>Seuil de stock bas:</label>
        <input type="number" value={lowStockThreshold} onChange={(e) => setLowStockThreshold(e.target.value)} required />
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
        <label>Fournisseur:</label>
        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
          <option value="">Select Supplier</option>
          {suppliers.map(supplier => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
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
