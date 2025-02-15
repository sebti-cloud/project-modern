import React, { useState, useEffect } from 'react';
import UploadProfilePhoto from './UploadProfilePhoto';
import Cookies from 'js-cookie'; // Importez js-cookie pour gérer les cookies
import './UserProfile.css'; // Assurez-vous d'importer le fichier CSS

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showUploadOptions, setShowUploadOptions] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = Cookies.get('token'); // Utilisez js-cookie pour récupérer le jeton

      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch('http://localhost:3001/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const result = await response.json();
        setUser(result);
        if (result.photo) {
          setShowUploadOptions(false);
        }
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
    const token = Cookies.get('token'); // Utilisez js-cookie pour récupérer le jeton

    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/user/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const result = await response.json();
      setUser({ ...user, photo: result.photo });
      setShowUploadOptions(false);
      window.location.reload();
    } catch (error) {
      console.error('Error uploading photo:', error);
      alert('Error uploading photo');
    }
  };

  const changePhoto = () => {
    setShowUploadOptions(true);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">{user ? user.name : 'Profile'}</h1>
      {user && user.photo ? (
        <>
          <img className="profile-photo" src={`http://localhost:3001${user.photo}`} alt="Profile" onClick={openModal} style={{ cursor: 'pointer' }} />
          {isModalOpen && (
            <div className="modal" onClick={closeModal}>
              <div className="modal-content">
                <img src={`http://localhost:3001${user.photo}`} alt="Profile" className='profile-photo-modal' />
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="profile-placeholder">Aucune photo</p>
      )}
      {showUploadOptions ? (
        <UploadProfilePhoto uploadPhoto={uploadPhoto} />
      ) : (
        <button onClick={changePhoto}>Changer la photo de profil</button>
      )}
    </div>
  );
};

export default UserProfile;
