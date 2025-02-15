import React, { useState } from 'react';

const UploadProfilePhoto = ({ uploadPhoto }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadPhoto(selectedFile);
    } else {
      alert('Please select a file first');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Photo</button>
    </div>
  );
};

export default UploadProfilePhoto;
