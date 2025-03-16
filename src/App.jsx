import React, { useState } from 'react';
import ThreeScene from './ThreeScene';
import './styles.css';

function App() {
  const [image, setImage] = useState(null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response = await fetch('https://blueprintconveterbackend.herokuapp.com/api/files/upload', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          throw new Error('Failed to upload file');
        }
        const data = await response.json();
        // Prepend the backend URL to the file path
        const imageUrl = `http://localhost:5003${data.filePath}`;
        setImage(imageUrl);
      } catch (err) {
        console.error('Error uploading file:', err);
      }
    }
  };

  return (
    <div className="App">
      <h1>2D to 3D Converter</h1>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {image && <img src={image} alt="Uploaded" style={{ maxWidth: '100%', marginTop: '20px' }} />}
      <ThreeScene image={image} />
    </div>
  );
}

export default App;