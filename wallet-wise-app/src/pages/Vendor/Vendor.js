import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { addFood, getVendorFoods, addAllFood } from "../../service/FoodService";
import { auth } from '../../utils/firebase';
import "./Vendor.css";

function Vendor() {
  const [foodData, setFoodData] = useState({
    foodName: '',
    price: 0,
    isAvailable: false,
    image: null,
    foodType: 0,
    quantity: '',
  });

  const [createdFood, setCreatedFood] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [foods, setFoods] = useState([]);

  // Fetch all foods from the Firestore using FoodService
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const userId = auth.currentUser.uid;
        const foodsData = await getVendorFoods(userId);
        setFoods(foodsData);
        console.log(foodsData);
      } catch (error) {
        console.error("Error fetching vendor foods:", error);
      }
    };

    fetchFoods();
  }, []);

  const handleChange = (event) => {
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);
  
    try {
      const userId = auth.currentUser.uid;
      await addAllFood(foodData);
      await addFood({
        ...foodData,
        userId: userId, // Include the userId when calling addFood
      });
  
      // Fetch the updated list of foods again
      const updatedFoods = await getVendorFoods(userId);
      setFoods(updatedFoods);
  
      setSuccessMessage("Food successfully created!");
  
      // Reset the form fields in the state
      setFoodData({
        foodName: '',
        price: 0,
        isAvailable: false,
        image: null,
        foodType: '',
        quantity: 0,
      });
    } catch (error) {
      console.error("Error creating food:", error);
    }
  };


  const handleNewFoodClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFoodData({
      FoodType: "",
      Name: "",
      isAvailable: true,
      Price: 0,
      Quantity: 0,
      File: null,
    });
    setCreatedFood(null);
    setSuccessMessage("");
  };

  return (
    <div className="main-page">
      <h2 className="title">
        <strong>My Shop</strong>
      </h2>
      <div className="my-table">
        {foods.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Available</th>
                <th>Image</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food.id}>
                  <td>{food.Name}</td>
                  <td>{food.Price}</td>
                  <td>{food.isAvailable ? "Yes" : "No"}</td>
                  <td>
                    <img src={food.ImageUrl} alt={food.Name} />
                  </td>
                  <td>{food.Quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No foods available.</p>
        )}
      </div>
      <div className="my-button">
        <Button onClick={handleNewFoodClick}>ADD FOOD</Button>
      </div>
      <Modal show={showModal} className="add-food-modal">
        <Modal.Header>
          <Modal.Title className="modal-title-centered">Add Food</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="modal-form">
            <div className="input-group input-food-type">
              <label>
                Type of Food:
                <select
                  name="foodType"
                  value={foodData.foodType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select option ...</option>
                  <option value="Main Dish">Main Dish</option>
                  <option value="Kakanin">Kakanin</option>
                  <option value="Snacks">Snacks</option>
                  <option value="Drinks">Drinks</option>
                </select>
              </label>
            </div>
            <div className="input-group input-name">
              <label>
                Food Name:
                <input
                  type="text"
                  name="foodName"
                  value={foodData.foodName}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="input-group input-price">
              <label>
                Price:
                <input
                  type="number"
                  name="price"
                  value={foodData.price}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="input-group input-price">
              <label>
                Quantity:
                <input
                  type="number"
                  name="quantity"
                  value={foodData.quantity}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="input-group input-available">
              <label>
                <span>Is it Available?</span>
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={foodData.isAvailable}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div className="input-group input-img">
              <label>
                Image:
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleImageChange}
                  required
                />
              </label>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="modal-button"
            variant="secondary"
            onClick={handleCloseModal}
          >
            Close
          </Button>
          <Button
            className="modal-button"
            variant="primary"
            onClick={handleSubmit}
          >
            Add Food
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Vendor;
