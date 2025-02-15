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

export default AdminDashboard;*/
import React from 'react';
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
          <li><Link to="/admin/products">Products</Link></li>
          <li><Link to="/admin/orders">Orders</Link></li>
          <li><Link to="/admin/likedProducts">Liked Products</Link></li>
          <li><Link to="/admin/categories">Categories</Link></li>
          <li><Link to="/admin/contacts">Contacts</Link></li>
          <li><Link to="/admin/admins">Admins</Link></li>
          <li><Link to="/admin-settings">Settings</Link></li> {/* Lien vers AdminSettings */}
        </ul>
      </div>
      <div className="admin-content">
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/likedProducts" element={<LikedProducts />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/contacts" element={<AdminContacts />} />
          <Route path="/admins" element={<AdminList />} />
          <Route path="/admin-settings" element={<AdminSettings />} /> {/* Route pour AdminSettings */}
          <Route path="/" element={<Products />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
