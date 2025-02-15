import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './admin.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [statuses, setStatuses] = useState({});

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const response = await fetch('http://localhost:3001/api/orders');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      console.log('Fetching products...');
      const response = await fetch('http://localhost:3001/api/products');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleUpdateOrder = async (orderId) => {
    const status = statuses[orderId] || orders.find(order => order.id === orderId)?.status;

    console.log('Updating order:', { orderId, status }); // Ajouter ce log

    if (status) {
      try {
        const response = await fetch(`http://localhost:3001/api/update-tracking/${orderId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        alert('Commande mise à jour avec succès');
        setOrders(orders.map(order => order.id === orderId ? data : order));
        setStatuses(prevStatuses => ({ ...prevStatuses, [orderId]: '' }));
      } catch (error) {
        console.error('Erreur lors de la mise à jour de la commande :', error);
        alert('Failed to update order');
      }
    } else {
      alert('Status is required');
    }
  };

  const handleDeleteOrder = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/orders/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchOrders();
        alert('Commande supprimée avec succès!', 'alert-danger');
      } else {
        const errorData = await response.json();
        alert(`Échec de la suppression de la commande: ${errorData.message}`, 'alert-danger');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la commande:', error);
      alert(`Erreur lors de la suppression de la commande: ${error.message}`, 'alert-danger');
    }
  };

  const getProductDetails = (productId) => {
    return products.find(product => product.id === productId);
  };

  const handleStatusChange = (orderId, newStatus) => {
    console.log('Status change:', { orderId, newStatus }); // Ajouter ce log
    setStatuses(prevStatuses => ({ ...prevStatuses, [orderId]: newStatus }));
  };

  const translatePaymentMethod = (paymentMethod) => {
    switch (paymentMethod) {
      case "paid":
        return "Payée en ligne";
      case "online":
        return "Payée en ligne";
      case "cash on delivery":
        return "Paiement à la livraison";
      default:
        return paymentMethod;
    }
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
          <li><Link to="/admin-settings">Settings</Link></li>
        </ul>
      </nav>
      <div className="orders">
        <h2 className="orders-header">Commandes</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom du client</th>
              <th>Téléphone</th>
              <th>Produits</th>
              <th>Prix Total</th>
              <th>Date</th>
              <th>Status</th>
              <th>Numéro de Suivi</th>
              <th>Mode de Paiement</th>
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
                      <div key={`${order.id}-${product.id}`}>
                        <img src={`http://localhost:3001${productDetails.image}`} alt={productDetails.name} width="50" />
                        {productDetails.name} x {product.qty}
                      </div>
                    ) : null;
                  })}
                </td>
                <td>{order.total_price} MAD</td>
                <td>{new Date(order.created_at).toLocaleString()}</td>
                <td>
                  <select value={statuses[order.id] || order.status || ''} onChange={(e) => handleStatusChange(order.id, e.target.value)}>
                    <option value="pending">En attente</option>
                    <option value="validated">Validée</option>
                    <option value="shipped">Expédiée</option>
                    <option value="delivered">Livrée</option>
                    <option value="cancelled">Annulée</option>
                  </select>
                </td>
                <td>{order.tracking_number}</td>
                <td>{translatePaymentMethod(order.payment_method)}</td>
                <td>
                  <button onClick={() => handleUpdateOrder(order.id)}>Mettre à jour</button>
                  <button className="delete" onClick={() => handleDeleteOrder(order.id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
