/*import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import AdminContacts from './AdminContacts';
import AdminList from './AdminList';
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
        <Route path="/" element={<Products />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;*/import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import AdminContacts from './AdminContacts';
import AdminList from './AdminList';
import AdminSettings from './AdminSettings'; // Importez AdminSettings
import './admin.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-menu">
        <ul>
          <li><Link to="/admin/products">Produits</Link></li>
          <li><Link to="/admin/orders">Commandes</Link></li>
          <li><Link to="/admin/likedProducts">Produits Aimés</Link></li>
          <li><Link to="/admin/categories">Catégories</Link></li>
          <li><Link to="/admin/contacts">Messages</Link></li>
          <li><Link to="/admin/admins">Administrateurs</Link></li>
          <li><Link to="/admin-settings">Settings</Link></li> {/* Ajoutez le lien vers AdminSettings */}
        </ul>
      </div>
      <div className="admin-content">
        <Routes>
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/likedProducts" element={<LikedProducts />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
          <Route path="/admin/admins" element={<AdminList />} />
          <Route path="/admin-settings" element={<AdminSettings />} /> {/* Ajoutez la route pour AdminSettings */}
          <Route path="/" element={<Products />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
