import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './admin.css';

const StockHistory = () => {
  const [stockMovements, setStockMovements] = useState([]);

  useEffect(() => {
    fetchStockMovements();
  }, []);

  const fetchStockMovements = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/stockMovements');
      const data = await response.json();
      setStockMovements(data);
    } catch (error) {
      console.error('Error fetching stock movements:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <nav>
        <ul>
          <li><Link to="/products">Produits</Link></li>
          <li><Link to="/orders">Commandes</Link></li>
          <li><Link to="/likedProducts">Produits aimés</Link></li>
          <li><Link to="/categories">Catégories</Link></li>
          <li><Link to="/contacts">Messages</Link></li>
          <li><Link to="/admins">Administrateurs</Link></li>
          <li><Link to="/admin-settings">Settings</Link></li>
          <li><Link to="/stock-history">Historique des Stocks</Link></li>
        </ul>
      </nav>

      <table className="stock-history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Produit</th>
            <th>Quantité</th>
            <th>Type de Mouvement</th>
          </tr>
        </thead>
        <tbody>
          {stockMovements.map(movement => (
            <tr key={movement.id}>
              <td>{new Date(movement.date).toLocaleString()}</td>
              <td>{movement.product_name}</td>
              <td>{movement.quantity}</td>
              <td>{movement.movement_type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockHistory;
