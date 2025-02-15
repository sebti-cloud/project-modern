import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BannerManager = () => {
  const [banners, setBanners] = useState([]);
  
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

  const handleBannerUpload = (newBanner) => {
    setBanners([...banners, newBanner]);
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
      <UploadForm onUpload={handleBannerUpload} endpoint="/api/banners" />
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
