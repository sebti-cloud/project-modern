import React, { useState, useEffect } from 'react';
import './admin.css';

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [newProduct, setNewProduct] = useState({ name: '', type: '', price: '', image: '' });

    // Récupérer les données depuis le backend
    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/orders');
            const data = await response.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const handleChange = (e) => {
        setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });
            if (response.ok) {
                fetchProducts();
                setNewProduct({ name: '', type: '', price: '', image: '' });
                alert('Product added successfully!');
            } else {
                alert('Failed to add product.');
            }
        } catch (error) {
            console.error('Error adding product:', error);
        }
    };

    return (
        <div className="admin">
            <h1>Admin Dashboard</h1>
            <section className="products">
                <h2>Products</h2>
                <form onSubmit={handleAddProduct}>
                    <input type="text" name="name" placeholder="Name" value={newProduct.name} onChange={handleChange} required />
                    <input type="text" name="type" placeholder="Type" value={newProduct.type} onChange={handleChange} required />
                    <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleChange} required />
                    <input type="text" name="image" placeholder="Image URL" value={newProduct.image} onChange={handleChange} required />
                    <button type="submit">Add Product</button>
                </form>
                <ul>
                    {products.map(product => (
                        <li key={product.id}>{product.name} - ${product.price}</li>
                    ))}
                </ul>
            </section>
            <section className="orders">
                <h2>Orders</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>User Name</th>
                            <th>Phone</th>
                            <th>Product Name</th>
                            <th>Product Image</th>
                            <th>Quantity</th>
                            <th>Total Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.user_name} {order.user_surname}</td>
                                <td>{order.user_phone}</td>
                                <td>{order.product_name}</td>
                                <td><img src={order.product_image} alt={order.product_name} width="50" /></td>
                                <td>{order.qty}</td>
                                <td>${order.total_price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default Admin;
