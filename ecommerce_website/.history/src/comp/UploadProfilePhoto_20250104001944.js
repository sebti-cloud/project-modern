import React, { useState } from 'react';

const UploadProfilePhoto = ({ uploadPhoto }) => {
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (event) => {
    setPhoto(event.target.files[0]);
  };

  const handleUpload = () => {
    if (photo) {
      uploadPhoto(photo);
    }
  };

  return (
    <div>
      <input type="file" onChange={handlePhotoChange} />
      <button onClick={handleUpload}>Upload Photo</button>
    </div>
  );
};

export default UploadProfilePhoto;
