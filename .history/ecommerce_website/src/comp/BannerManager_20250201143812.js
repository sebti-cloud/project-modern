import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [position, setPosition] = useState(0);
  const [image, setImage] = useState(null);
  const [page, setPage] = useState('home'); // Ajout de l'état pour la page

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/banners');
      setBanners(response.data);
    } catch (error) {
      console.error('Error fetching banners:', error);
    }
  };

  const handleAddBanner = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('link', link);
    formData.append('position', position);
    formData.append('image', image); // Nom du champ correspondant à 'single' dans multer
    formData.append('page', page); // Ajout de la page au formulaire
  
    try {
      await axios.post('http://localhost:3001/api/banners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data' // Assurez-vous d'envoyer le bon en-tête
        }
      });
      fetchBanners();
      setTitle('');
      setLink('');
      setPosition(0);
      setImage(null);
      setPage('home'); // Réinitialiser la page à la valeur par défaut
    } catch (error) {
      console.error('Error adding banner:', error);
    }
  };
  
  

  const handleDeleteBanner = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/banners/${id}`);
      fetchBanners();
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  return (
    <div>
      <h2>Manage Banners</h2>
      <form onSubmit={handleAddBanner}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Position"
          value={isNaN(position) ? '' : position} // S'assurer que `position` n'est pas NaN
          onChange={(e) => setPosition(parseInt(e.target.value) || 0)}
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <select value={page} onChange={(e) => setPage(e.target.value)} required>
          <option value="home">Home</option>
          <option value="shop">Shop</option>
        </select>
        <button type="submit">Add Banner</button>
      </form>
      <ul>
        {banners.map(banner => (
          <li key={banner.id}>
            <img src={`http://localhost:3001${banner.image_url}`} alt={banner.title} width="100" />
            <p>{banner.title}</p>
            <button onClick={() => handleDeleteBanner(banner.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BannerManager;
