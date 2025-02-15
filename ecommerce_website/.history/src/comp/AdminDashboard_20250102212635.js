import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import LikedProducts from './LikedProducts';
import Categories from './Categories';
import AdminContacts from './AdminContacts';
import AdminList from './AdminList';
import './admin.css';

const AdminDashboard = () => {
    const [orders, setOrders] = useState([]);
    const [trackingInfo, setTrackingInfo] = useState({});

    useEffect(() => {
        // Fonction pour obtenir les commandes depuis l'API
        const fetchOrders = async () => {
            const response = await fetch('/api/orders');
            const data = await response.json();
            setOrders(data);
        };

        fetchOrders();
    }, []);

    const handleTrackOrder = async (trackingNumber) => {
        const response = await fetch(`/api/track?number=${trackingNumber}`);
        const data = await response.json();
        setTrackingInfo((prevInfo) => ({
            ...prevInfo,
            [trackingNumber]: data.info,
        }));
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
                </ul>
            </nav>
            <Routes>
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/likedProducts" element={<LikedProducts />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/contacts" element={<AdminContacts />} />
                <Route path="/admins" element={<AdminList />} />
                <Route path="/" element={<Products />} />
            </Routes>
            <div className="order-tracking">
                <h2>Suivi des Commandes</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Total Price</th>
                            <th>Status</th>
                            <th>Tracking Number</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.user_name}</td>
                                <td>{order.total_price}</td>
                                <td>{order.status}</td>
                                <td>{order.tracking_number}</td>
                                <td>
                                    <button onClick={() => handleTrackOrder(order.tracking_number)}>Track Order</button>
                                    {trackingInfo[order.tracking_number] && (
                                        <div className="tracking-info">
                                            <p>{trackingInfo[order.tracking_number]}</p>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
