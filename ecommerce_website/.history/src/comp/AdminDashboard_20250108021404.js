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
import { FaCog } from 'react-icons/fa'; // Importez l'icône

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-settings-link">
        <Link to="/admin-settings" className="settings-link">
          <FaCog className="settings-icon" /> Settings
        </Link> {/* Lien vers AdminSettings avec une icône */}
      </div>
      <div className="admin-content">
        <Routes>
          <Route path="/admin/products" element={<Products />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/likedProducts" element={<LikedProducts />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/contacts" element={<AdminContacts />} />
          <Route path="/admin/admins" element={<AdminList />} />
          <Route path="/admin-settings" element={<AdminSettings />} />{/* Route pour AdminSettings */}
          <Route path="/" element={<Products />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
