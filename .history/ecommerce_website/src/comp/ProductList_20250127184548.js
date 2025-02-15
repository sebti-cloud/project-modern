import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBox, FaClipboardList, FaHeart, FaTags, FaEnvelope, FaUserShield, FaCog, FaWarehouse } from 'react-icons/fa'; // Importer des icônes depuis react-icons
import './admin.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState('all'); // State pour gérer le filtre

  useEffect(() => {
    fetchProducts();
  }, [filter]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/products');
      const data = await response.json();

      // Normaliser les données pour s'assurer que `images` est un tableau
      const normalizedData = data.map(product => ({
        ...product,
        images: product.images
          ? product.images.replace(/[{}"]/g, '').split(',') // Convertir la chaîne JSON en tableau
          : [],
      }));

      setProducts(normalizedData);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleEditProduct = (product) => {
    // Implémenter la logique pour éditer un produit
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

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

  const filteredProducts = products.filter(product => {
    if (filter === 'low') {
      return product.quantity <= product.lowStockThreshold;
    } else if (filter === 'approaching') {
      return product.quantity > product.lowStockThreshold && product.quantity <= product.lowStockThreshold + 10;
    } else if (filter === 'sufficient') {
      return product.quantity > product.lowStockThreshold + 10;
    }
    return true;
  });

  return (
    <div className="admin-dashboard">
      <nav>
        <ul>
          <li><Link to="/products"><FaBox /> Produits</Link></li>
          <li><Link to="/orders"><FaClipboardList /> Commandes</Link></li>
          <li><Link to="/likedProducts"><FaHeart /> Produits aimés</Link></li>
          <li><Link to="/categories"><FaTags /> Catégories</Link></li>
          <li><Link to="/contacts"><FaEnvelope /> Messages</Link></li>
          <li><Link to="/admins"><FaUserShield /> Administrateurs</Link></li>
          <li><Link to="/admin-settings"><FaCog /> Paramètres</Link></li>
          <li><Link to="/suppliers"><FaWarehouse /> Fournisseurs</Link></li> {/* Ajouter l'icône de fournisseur */}
        </ul>
      </nav>

      <div className="actions">
        <Link to="/ProductForm">
          <button className="add-product-button">Ajouter un Produit</button>
        </Link>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter('low')} className="low-stock-button">Stock Bas</button>
        <button onClick={() => setFilter('approaching')} className="approaching-stock-button">Approche du Seuil</button>
        <button onClick={() => setFilter('sufficient')} className="sufficient-stock-button">Stock Suffisant</button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Types</th>
            <th>Prix</th>
            <th>Détails</th>
            <th>Quantité</th>
            <th>Seuil de Stock Bas</th>
            <th>Fournisseur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map(product => (
            <tr
              key={product.id}
              className={
                product.quantity <= product.lowStockThreshold ? 'low-stock' :
                product.quantity <= product.lowStockThreshold + 10 ? 'approaching-stock' :
                'sufficient-stock'
              }
            >
              <td>
                {product.images && product.images.length > 0 ? (
                  product.images.map((img, index) => (
                    <img
                      key={index}
                      src={`http://localhost:3001${img.trim()}`}
                      alt={`${product.name} - Image ${index + 1}`}
                      className="product-image"
                    />
                  ))
                ) : (
                  <span>No image available</span>
                )}
              </td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.types && product.types.length > 0 ? product.types.join(', ') : 'No types'}</td>
              <td>{product.price} MAD</td>
              <td>{product.details}</td>
              <td>{product.quantity}</td>
              <td>{product.lowStockThreshold}</td>
              <td>{product.supplier_name}</td> {/* Afficher le fournisseur */}
              <td>
                <button onClick={() => handleEditProduct(product)} className="edit-button">Edit</button>
                <button onClick={() => handleDeleteProduct(product.id)} className="delete-button">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
