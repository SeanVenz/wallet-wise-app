import React, { useState, useEffect } from "react";
import { createFood, getAllFoods } from "../../service/FoodService";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./Vendor.css";

function Vendor() {
  const [foodData, setFoodData] = useState({
    FoodType: "",
    Name: "",
    isAvailable: true,
    Price: 0,
    File: null,
  });
  const [createdFood, setCreatedFood] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [foods, setFoods] = useState([]);

  // Fetch all foods from the API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const foodsData = await getAllFoods();
        setFoods(foodsData);
        console.log(foodsData);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    // Handle the special case for file input
    const file = type === "file" ? files[0] : null;

    setFoodData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? e.target.checked : value,
      File: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);

    try {
      const createdFood = await createFood(foodData);
      console.log("Food created successfully:", createdFood);

      // Fetch the updated list of foods again
      const updatedFoods = await getAllFoods();
      setFoods(updatedFoods);

      setCreatedFood(createdFood);
      setSuccessMessage("Food successfully created!");
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
        <table>
          <thead>
            <tr>
              <th>Food Name</th>
              <th>Price</th>
              <th>Is Available</th>
              <th>Photo</th>
            </tr>
          </thead>
          <tbody>
            {foods.map((food) => (
              <tr key={food.id}>
                <td>{food.name}</td>
                <td>{food.price}</td>
                <td>{food.isAvailable ? "Yes" : "No"}</td>
                <td>
                  <img src={food.imageUrl} alt={food.name} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
                  name="FoodType"
                  value={foodData.FoodType}
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
                  name="Name"
                  value={foodData.Name}
                  onChange={handleChange}
                  required
                />
              </label>
            </div>
            <div className="input-group input-price">
              <label>
                Price:
                <input
                  type="text"
                  name="Price"
                  value={foodData.Price}
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
                  name="File"
                  onChange={handleChange}
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
