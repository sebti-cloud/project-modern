import React, { useState, useEffect } from 'react';
import './admin.css';

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);

    // Récupérer les données depuis le backend
    useEffect(() => {
        fetchProducts();
        fetchOrders();
        fetchUsers();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');
            const data = await response.json();
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/orders');
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/users');
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    return (
        <div className="admin">
            <h1>Admin Dashboard</h1>
            <section className="products">
                <h2>Products</h2>
                <ul>
                    {products.map(product => (
                        <li key={product.id}>{product.name} - ${product.price}</li>
                    ))}
                </ul>
            </section>
            <section className="orders">
                <h2>Orders</h2>
                <ul>
                    {orders.map(order => (
                        <li key={order.id}>Order #{order.id} - User: {order.user_name} {order.user_surname} - Product ID: {order.product_id} - Quantity: {order.qty} - Status: Pending</li>
                    ))}
                </ul>
            </section>
            <section className="users">
                <h2>Users</h2>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>{user.name} - {user.email} - {user.phone}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default Admin;
