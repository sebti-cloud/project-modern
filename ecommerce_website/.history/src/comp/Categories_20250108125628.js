import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './admin.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategory }),
      });
      if (response.ok) {
        fetchCategories();
        setNewCategory('');
        alert('Category added successfully!');
      } else {
        alert('Failed to add category.');
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/categories/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchCategories();
        alert('Catégorie supprimée avec succès!');
      } else {
        alert('Échec de la suppression de la catégorie.');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression de la catégorie:', error);
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
      <div className="categories">
        <h2 className="categories-header">Categories</h2>
        <form onSubmit={handleAddCategory}>
          <input type="text" name="category" placeholder="Nom de la catégorie" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} required />
          <button type="submit">Ajouter une catégorie</button>
        </form>
        <table className="categories-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <button onClick={() => handleDeleteCategory(category.id)} className="delete-button">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories;
