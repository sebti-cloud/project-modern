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
import AdminContacts from './AdminContacts'; // Assurez-vous que le chemin est correct
import AdminList from './AdminList';
import AdminSettings from './AdminSettings';
import './admin.css';
import { FaEnvelope } from 'react-icons/fa'; // Importez l'icône

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <div className="admin-message-link">
        <Link to="/contacts" className="message-link">
          <FaEnvelope className="message-icon" /> Messages
        </Link> {/* Lien vers AdminContacts avec une icône */}
      </div>
      <nav>
        <ul>
          <li><Link to="/products">Produits</Link></li>
          <li><Link to="/orders">Commandes</Link></li>
          <li><Link to="/likedProducts">Produits aimés</Link></li>
          <li><Link to="/categories">Catégories</Link></li>
          <li><Link to="/admins">Administrateurs</Link></li>
          <li><Link to="/admin-settings">Settings</Link></li>
        </ul>
      </nav>
      <div className="admin-content">
        <Routes>
          <Route path="/products" element={<Products />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/likedProducts" element={<LikedProducts />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/contacts" element={<AdminContacts />} /> {/* Route pour Contact */}
          <Route path="/admins" element={<AdminList />} />
          <Route path="/admin-settings" element={<AdminSettings />} /> {/* Route pour AdminSettings */}
          <Route path="/" element={<Products />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;
