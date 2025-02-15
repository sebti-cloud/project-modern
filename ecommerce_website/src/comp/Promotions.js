import React, { useState, useEffect } from 'react';

const Promotions = () => {
  const [promotions, setPromotions] = useState([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    start_date: '',
    end_date: '',
    product_id: ''
  });

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/promotions');
      const data = await response.json();
      setPromotions(data);
    } catch (error) {
      console.error('Error fetching promotions:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/promotions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });
      if (response.ok) {
        fetchPromotions();
        setForm({
          name: '',
          description: '',
          discount_type: 'percentage',
          discount_value: 0,
          start_date: '',
          end_date: '',
          product_id: ''
        });
      }
    } catch (error) {
      console.error('Error adding promotion:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/promotions/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchPromotions(); // Mettre à jour la liste des promotions après suppression
      } else {
        console.error('Failed to delete promotion');
      }
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  return (
    <div className="promotions">
      <h2>Gestion des Promotions</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleInputChange}
          placeholder="Nom de la promotion"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          placeholder="Description"
        ></textarea>
        <select
          name="discount_type"
          value={form.discount_type}
          onChange={handleInputChange}
        >
          <option value="percentage">Pourcentage</option>
          <option value="fixed">Fixe</option>
        </select>
        <input
          type="number"
          name="discount_value"
          value={form.discount_value}
          onChange={handleInputChange}
          placeholder="Valeur de la réduction"
          required
        />
        <input
          type="datetime-local"
          name="start_date"
          value={form.start_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="datetime-local"
          name="end_date"
          value={form.end_date}
          onChange={handleInputChange}
          required
        />
        <input
          type="number"
          name="product_id"
          value={form.product_id}
          onChange={handleInputChange}
          placeholder="ID du produit"
          required
        />
        <button type="submit">Ajouter Promotion</button>
      </form>
      <ul>
        {promotions.map(promo => (
          <li key={promo.id}>
            {promo.name} - {promo.discount_type === 'percentage' ? `${promo.discount_value}%` : `${promo.discount_value} MAD`} (Produit ID: {promo.product_id})
            <button onClick={() => handleDelete(promo.id)}>Supprimer</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Promotions;
