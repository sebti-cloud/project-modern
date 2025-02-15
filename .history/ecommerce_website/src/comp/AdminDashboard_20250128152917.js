/*import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import AdminContacts from './AdminContacts';
import AdminList from './AdminList';
import AdminUsers from './AdminUsers'; // Importer la nouvelle page des utilisateurs
import './admin.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/likedProducts" element={<LikedProducts />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/contacts" element={<AdminContacts />} />
        <Route path="/admins" element={<AdminList />} />
        <Route path="/users" element={<AdminUsers />} /> 
        <Route path="/" element={<Products />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;
*/
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import AdminContacts from './AdminContacts';
import AdminList from './AdminList';
import AdminUsers from './AdminUsers';
import ProductList from './ProductList'; // Importer ProductList
import Suppliers from './Suppliers'; // Importer Suppliers
import StockHistory from './StockHistory'; // Importer StockHistory
import SalesReport from './reports/SalesReport'; // Importer SalesReport
import './admin.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <nav className="admin-nav">
        <ul>
          <li><Link to="/products">Produits</Link></li>
          <li><Link to="/orders">Commandes</Link></li>
          <li><Link to="/likedProducts">Produits Aimés</Link></li>
          <li><Link to="/categories">Catégories</Link></li>
          <li><Link to="/contacts">Messages</Link></li>
          <li><Link to="/admins">Administrateurs</Link></li>
          <li><Link to="/admin-users">Utilisateurs</Link></li>
          <li><Link to="/sales-report">Rapport de Ventes</Link></li>
          <li><Link to="/stock-history">Historique des Stocks</Link></li>
        </ul>
      </nav>
      <div className="admin-content">
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/likedProducts" element={<LikedProducts />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/contacts" element={<AdminContacts />} />
          <Route path="/admins" element={<AdminList />} />
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/product-list" element={<ProductList />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/stock-history" element={<StockHistory />} />
          <Route path="/sales-report" element={<SalesReport />} /> {/* Ajouter SalesReport */}
          <Route path="/" element={<Products />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
