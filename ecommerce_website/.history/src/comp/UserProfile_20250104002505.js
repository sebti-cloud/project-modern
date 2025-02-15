import React, { useState } from 'react';
import UploadProfilePhoto from './UploadProfilePhoto';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  const uploadPhoto = async (photo) => {
    const formData = new FormData();
    formData.append('photo', photo);

    const token = localStorage.getItem('token'); // Assurez-vous d'avoir un token JWT valide

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
    <div>
      <h1>User Profile</h1>
      {user && user.photo && <img src={user.photo} alt="Profile" />}
      <UploadProfilePhoto uploadPhoto={uploadPhoto} />
    </div>
  );
};

export default UserProfile;
