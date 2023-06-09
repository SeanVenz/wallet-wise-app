import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [foodType, setFoodType] = useState('');
  const [name, setName] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState(null);

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const formData = new FormData();
      formData.append('foodType', foodType);
      formData.append('name', name);
      formData.append('isAvailable', isAvailable);
      formData.append('price', price);

      await axios.post('https://localhost:7273/api/Food', formData, imageFile, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Food item created successfully
      alert('Food item created!');
    } catch (error) {
      console.error(error.message);
      // Handle error here
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };

  return (
    <div>
      <h2>Create Food Item</h2>
      <form onSubmit={handleFormSubmit}>
        <div>
          <label htmlFor="foodType">Food Type:</label>
          <input
            type="text"
            id="foodType"
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="isAvailable">Is Available:</label>
          <input
            type="checkbox"
            id="isAvailable"
            checked={isAvailable}
            onChange={(e) => setIsAvailable(e.target.checked)}
          />
        </div>
        <div>
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input type="file" id="image" onChange={handleImageChange} required />
        </div>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default App;
