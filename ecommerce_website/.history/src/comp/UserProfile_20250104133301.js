import React, { useState, useEffect } from 'react';
import UploadProfilePhoto from './UploadProfilePhoto';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token'); // Assurez-vous d'avoir un token JWT valide

      try {
        const response = await fetch('http://localhost:3001/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        setUser(result);
        console.log('User profile:', result); // Ajout de log pour vérifier l'URL de la photo
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const uploadPhoto = async (photo) => {
    const formData = new FormData();
    formData.append('photo', photo);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('http://localhost:3001/api/user/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUser({ ...user, photo: result.photo });
        alert('Photo uploaded successfully');
      } else {
        alert('Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo');
    }
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile</h1>
      {user && user.photo ? (
        <img className="profile-photo" src={`http://localhost:3001${user.photo}`} alt="Profile" />
      ) : (
        <p className="profile-placeholder">Profile</p>
      )}
      <UploadProfilePhoto uploadPhoto={uploadPhoto} />
    </div>
  );
};

export default UserProfile;
