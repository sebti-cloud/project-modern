import React, { useState, useEffect } from 'react';
import './admin.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchOrders();
        fetchProducts();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/orders');
            const data = await response.json();
            setOrders(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching orders:', error);
        }
    };

    const fetchProducts = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/products');
            const data = await response.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    const handleValidateOrder = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${id}/validate`, {
                method: 'PUT',
            });
            if (response.ok) {
                fetchOrders();
                alert('Order validated successfully!', 'alert-success');
            } else {
                alert('Failed to validate order.', 'alert-danger');
            }
        } catch (error) {
            console.error('Error validating order:', error);
        }
    };

    const handleDeleteOrder = async (id) => {
        try {
            const response = await fetch(`http://localhost:3001/api/orders/${id}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                fetchOrders();
                alert('Order deleted successfully!', 'alert-danger');
            } else {
                const errorData = await response.json();
                alert(`Failed to delete order: ${errorData.message}`, 'alert-danger');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            alert(`Error deleting order: ${error.message}`, 'alert-danger');
        }
    };

    const getProductDetails = (productId) => {
        return products.find(product => product.id === productId);
    };

    return (
        <div className="orders">
            <h2 className="orders-header">Orders</h2>
            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>User Name</th>
                        <th>Phone</th>
                        <th>Products</th>
                        <th>Total Price</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user_name} {order.user_surname}</td>
                            <td>{order.user_phone}</td>
                            <td>
                                {order.products && order.products.map(product => {
                                    const productDetails = getProductDetails(product.id);
                                    return productDetails ? (
                                        <div key={product.id}>
                                            <img src={`http://localhost:3001${productDetails.image}`} alt={productDetails.name} width="50" />
                                            {productDetails.name} x {product.qty}
                                        </div>
                                    ) : null;
                                })}
                            </td>
                            <td>{order.total_price} Mad</td>
                            <td>{new Date(order.created_at).toLocaleString()}</td>
                            <td>{order.status === 'validated' ? 'Validée' : 'En attente'}</td>
                            <td>
                                <button className="validate" onClick={() => handleValidateOrder(order.id)}>Validate</button>
                                <button className="delete" onClick={() => handleDeleteOrder(order.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;
