import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import AdminContacts from './AdminContacts';
import AdminList from './AdminList';
import OrderTracking from './OrderTracking'; // Assurez-vous que le composant est bien importé
import './admin.css';

const AdminDashboard = () => {
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
                    <li><Link to="/order-tracking">Suivi des Commandes</Link></li> {/* Lien pour le suivi des commandes */}
                </ul>
            </nav>
            <Routes>
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/likedProducts" element={<LikedProducts />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/contacts" element={<AdminContacts />} />
                <Route path="/admins" element={<AdminList />} />
                <Route path="/order-tracking" element={<OrderTracking />} /> {/* Route pour le suivi des commandes */}
                <Route path="/" element={<Products />} />
            </Routes>
        </div>
    );
};

export default AdminDashboard;
