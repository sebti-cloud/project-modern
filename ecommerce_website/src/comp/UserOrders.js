import React, { useState, useEffect } from 'react';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/orders/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setOrders(data);
    };

    fetchOrders();
  }, []);

  return (
    <div>
      <h2>My Orders</h2>
      <ul>
        {orders.map(order => (
          <li key={order.id}>Order ID: {order.id}, Total Price: {order.total_price}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserOrders;
