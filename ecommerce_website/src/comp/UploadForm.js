import React, { useState, useEffect } from 'react';
import axios from 'axios';
import UploadForm from './UploadForm';  // Ajout de l'importation de UploadForm

const SliderManager = () => {
  const [slides, setSlides] = useState([]);
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [position, setPosition] = useState(0);
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await axios.get('/api/sliders');
      setSlides(response.data);
    } catch (error) {
      console.error('Error fetching sliders:', error);
    }
  };

  const handleAddSlide = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('link', link);
    formData.append('position', position);
    formData.append('image', image);

    try {
      await axios.post('/api/sliders', formData);
      fetchSlides();
      setTitle('');
      setLink('');
      setPosition(0);
      setImage(null);
    } catch (error) {
      console.error('Error adding slider:', error);
    }
  };

  const handleDeleteSlide = async (id) => {
    try {
      await axios.delete(`/api/sliders/${id}`);
      fetchSlides();
    } catch (error) {
      console.error('Error deleting slider:', error);
    }
  };

  return (
    <div>
      <h2>Manage Sliders</h2>
      <form onSubmit={handleAddSlide}>
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
        <button type="submit">Add Slide</button>
      </form>
      <ul>
        {slides.map(slide => (
          <li key={slide.id}>
            <img src={slide.image_url} alt={slide.title} width="100" />
            <p>{slide.title}</p>
            <button onClick={() => handleDeleteSlide(slide.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SliderManager;
