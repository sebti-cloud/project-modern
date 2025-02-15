import React, { useState, useEffect } from 'react';
import UploadForm from './UploadForm';
import axios from 'axios';

const SliderManager = () => {
  const [sliders, setSliders] = useState([]);
  
  useEffect(() => {
    fetchSliders();
  }, []);

  const fetchSliders = async () => {
    try {
      const response = await axios.get('/api/sliders');
      setSliders(response.data);
    } catch (error) {
      console.error('Error fetching sliders:', error);
    }
  };

  const handleSliderUpload = (newSlider) => {
    setSliders([...sliders, newSlider]);
  };

  const handleDeleteSlider = async (id) => {
    try {
      await axios.delete(`/api/sliders/${id}`);
      fetchSliders();
    } catch (error) {
      console.error('Error deleting slider:', error);
    }
  };

  return (
    <div>
      <h2>Manage Sliders</h2>
      <UploadForm onUpload={handleSliderUpload} endpoint="/api/sliders" />
      <ul>
        {sliders.map(slider => (
          <li key={slider.id}>
            <img src={slider.image_url} alt={slider.title} width="100" />
            <p>{slider.title}</p>
            <button onClick={() => handleDeleteSlider(slider.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SliderManager;
