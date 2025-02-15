import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadForm from './UploadForm';  // Ajout de l'importation de UploadForm

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [position, setPosition] = useState(0);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const response = await axios.get('/api/banners');
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
    formData.append('image', image);

    try {
      await axios.post('/api/banners', formData);
      fetchBanners();
      setTitle('');
      setLink('');
      setPosition(0);
      setImage(null);
    } catch (error) {
      console.error('Error adding banner:', error);
    }
  };

  const handleDeleteBanner = async (id) => {
    try {
      await axios.delete(`/api/banners/${id}`);
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
          value={position}
          onChange={(e) => setPosition(parseInt(e.target.value))}
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Add Banner</button>
      </form>
      <ul>
        {banners.map(banner => (
          <li key={banner.id}>
            <img src={banner.image_url} alt={banner.title} width="100" />
            <p>{banner.title}</p>
            <button onClick={() => handleDeleteBanner(banner.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BannerManager;
