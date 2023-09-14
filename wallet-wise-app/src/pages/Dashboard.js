import React, { useState } from 'react';
import { addFood } from '../service/FoodService'; // Import the addFood function from your Firebase functions file

function Dashboard() {
  const [foodData, setFoodData] = useState({
    foodName: '',
    price: '',
    isAvailable: false,
    image: null,
    foodType: '',
    quantity: '',
  });

  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    setFoodData({
      ...foodData,
      [name]: type === 'checkbox' ? event.target.checked : value,
    });
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setFoodData({
      ...foodData,
      image: imageFile,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Call the addFood function to add the food item to Firebase
    await addFood(foodData);
    // Clear the form after submitting
    setFoodData({
      foodName: '',
      price: '',
      isAvailable: false,
      image: null,
      foodType: '',
      quantity: '',
    });
  };

  return (
    <div>
      <h2>Add Food</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Food Name:</label>
          <input
            type="text"
            name="foodName"
            value={foodData.foodName}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            name="price"
            value={foodData.price}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Is Available:</label>
          <input
            type="checkbox"
            name="isAvailable"
            checked={foodData.isAvailable}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            accept="image/*"
            name="image"
            onChange={handleImageChange}
            required
          />
        </div>
        <div>
          <label>Food Type:</label>
          <input
            type="text"
            name="foodType"
            value={foodData.foodType}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={foodData.quantity}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <button type="submit">Add Food</button>
        </div>
      </form>
    </div>
  );
}

export default Dashboard;
