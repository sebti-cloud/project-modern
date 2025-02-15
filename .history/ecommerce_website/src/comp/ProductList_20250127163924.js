import React from 'react';
import './ProductList.css';

const ProductList = ({ products, editProduct, deleteProduct }) => {
  const LOW_STOCK_THRESHOLD = 5; // Seuil de stock bas

  return (
    <div className="product-list">
      <h2>Liste des Produits</h2>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Catégorie</th>
            <th>Prix</th>
            <th>Quantité en Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id} className={product.quantity <= LOW_STOCK_THRESHOLD ? 'low-stock' : ''}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.price}</td>
              <td>{product.quantity}</td> {/* Afficher la quantité en stock */}
              <td>
                <button onClick={() => editProduct(product)}>Modifier</button>
                <button onClick={() => deleteProduct(product.id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.some(product => product.quantity <= LOW_STOCK_THRESHOLD) && (
        <div className="low-stock-alert">
          <p>Attention : Certains produits ont un stock bas !</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;
