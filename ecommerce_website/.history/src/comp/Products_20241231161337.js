import React, { useState, useEffect } from 'react';
import './admin.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', category: '', types: [], price: '', details: '' });
  const [editProduct, setEditProduct] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products');
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editProduct) {
      if (name === 'types') {
        const types = Array.from(e.target.selectedOptions, option => option.value);
        setEditProduct({ ...editProduct, types });
      } else {
        setEditProduct({ ...editProduct, [name]: value });
      }
    } else {
      if (name === 'types') {
        const types = Array.from(e.target.selectedOptions, option => option.value);
        setNewProduct({ ...newProduct, types });
      } else {
        setNewProduct({ ...newProduct, [name]: value });
      }
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProduct.name);
    formData.append('category', newProduct.category);
    formData.append('types', JSON.stringify(newProduct.types)); // Convertir types en chaîne JSON
    formData.append('price', newProduct.price);
    formData.append('details', newProduct.details);
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:3001/api/products', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        fetchProducts();
        setNewProduct({ name: '', category: '', types: [], price: '', details: '' });
        setSelectedFile(null);
        alert('Product added successfully!', 'alert-success');
      } else {
        alert('Failed to add product.', 'alert-danger');
      }
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditProduct(product);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editProduct.name);
    formData.append('category', editProduct.category);
    formData.append('types', JSON.stringify(editProduct.types || [])); // Assurer types est un tableau
    formData.append('price', editProduct.price);
    formData.append('details', editProduct.details);
    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    console.log('Updating product with data:', { ...editProduct, types: editProduct.types, image: selectedFile });

    try {
      const response = await fetch(`http://localhost:3001/api/products/${editProduct.id}`, {
        method: 'PUT',
        body: formData,
      });
      if (response.ok) {
        fetchProducts();
        setEditProduct(null);
        setSelectedFile(null);
        alert('Product updated successfully!', 'alert-success');
      } else {
        const errorText = await response.text();
        alert(`Failed to update product: ${errorText}`, 'alert-danger');
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProducts();
        alert('Product deleted successfully!', 'alert-success');
      } else {
        alert('Failed to delete product.', 'alert-danger');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateType = async (productId, newType) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}/type`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: newType }),
      });
      if (response.ok) {
        fetchProducts(); // Refresh product list
        alert('Product type updated successfully!', 'alert-success');
      } else {
        alert('Failed to update product type.', 'alert-danger');
      }
    } catch (error) {
      console.error('Error updating product type:', error);
    }
  };

  return (
    <div className="products">
      <h2 className="products-header">Products</h2>
      <form onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={editProduct ? editProduct.name : newProduct.name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={editProduct ? editProduct.category : newProduct.category}
          onChange={handleChange}
          required
        />
        <select
          name="types"
          value={editProduct ? (editProduct.types.length ? editProduct.types : '') : (newProduct.types.length ? newProduct.types : '')}
          onChange={handleChange}
          multiple
          required
        >
          <option value="featured">Featured</option>
          <option value="new">New</option>
          <option value="top">Top</option>
          <option value="sale">Sale</option>
        </select>
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={editProduct ? editProduct.price : newProduct.price}
          onChange={handleChange}
          required
        />
        <textarea
          name="details"
          className="details"
          placeholder="Details"
          value={editProduct ? editProduct.details : newProduct.details}
          onChange={handleChange}
          required
        />
        <input type="file" name="image" onChange={handleFileChange} required={!editProduct} />
        <button type="submit">{editProduct ? 'Update Product' : 'Add Product'}</button>
      </form>
      <table className="products-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Types</th>
            <th>Price</th>
            <th>Details</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td><img src={`http://localhost:3001${product.image}`} alt={product.name} className="product-image" /></td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.types ? product.types.join(', ') : 'No types'}</td>
              <td>{product.price} MAD</td>
              <td>{product.details}</td>
              <td>
                <button onClick={() => handleEditProduct(product)} className="edit-button">Edit</button>
                <button onClick={() => handleDeleteProduct(product.id)} className="delete-button">Delete</button>
                <select
                  value={product.types && product.types[0] ? product.types[0] : ''}
                  onChange={(e) => handleUpdateType(product.id, e.target.value)}
                  className="type-select"
                >
                  <option value="featured">Featured</option>
                  <option value="new">New</option>
                  <option value="top">Top</option>
                  <option value="sale">Sale</option>
                  <option value="old">Old</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Products;
