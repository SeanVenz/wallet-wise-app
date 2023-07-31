import React, { useState } from 'react';
import { createFood } from '../service/FoodService';

function Vendor() {
  const [foodData, setFoodData] = useState({
    FoodType: '',
    Name: '',
    isAvailable: true,
    Price: 0,
    File: null,
  });
  const [createdFood, setCreatedFood] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Handle the special case for file input
    const file = type === 'file' ? files[0] : null;

    setFoodData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? e.target.checked : value,
      File: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const createdFood = await createFood(foodData);
      console.log('Food created successfully:', createdFood);

      setCreatedFood(createdFood);
      setSuccessMessage('Food successfully created!');
    } catch (error) {
      console.error('Error creating food:', error);
    }
  };

  return (
    <div>
      <h1>Vendor Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Food Type:
            <input
              type="text"
              name="FoodType"
              value={foodData.FoodType}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="Name"
              value={foodData.Name}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Availability:
            <input
              type="checkbox"
              name="isAvailable"
              checked={foodData.isAvailable}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Price:
            <input
              type="number"
              name="Price"
              value={foodData.Price}
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <div>
          <label>
            Image:
            <input
              type="file"
              name="File"
              onChange={handleChange}
              required
            />
          </label>
        </div>
        <button type="submit">Create Food</button>
      </form>
      {successMessage && <p>{successMessage}</p>}
      {createdFood && (
        <div>
          <h2>Created Food:</h2>
          <p>Food Type: {createdFood.FoodType}</p>
          <p>Food Name: {createdFood.Name}</p>
          <p>Availability: {createdFood.isAvailable ? 'Available' : 'Not Available'}</p>
          <p>Price: {createdFood.Price}</p>
          <img src={createdFood.imageUrl} alt={`Food ${createdFood.Name}`} />
        </div>
      )}
    </div>
  );
}

export default Vendor;
