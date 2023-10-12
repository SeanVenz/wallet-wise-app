import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { addFood, getVendorFoods, addAllFood } from "../../service/FoodService";
import { auth, db } from "../../utils/firebase";
import "./Vendor.css";
import { doc, getDoc, updateDoc } from "@firebase/firestore";

function Vendor() {
  const [storeName, setStoreName] = useState("No Shop Name");
  const [createdFood, setCreatedFood] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [foods, setFoods] = useState([]);
  const [longitude, setLongitude] = useState();
  const [latitude, setLatitude] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      // Fetch ID number from Firestore
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setStoreName(docSnap.data().idNumber);
        setLongitude(docSnap.data().longitude);
        setLatitude(docSnap.data().latitude);
      } else {
        console.log("No such document!");
      }
    };

    fetchUserData();
  });

  const [foodData, setFoodData] = useState({
    foodName: "",
    price: 0,
    isAvailable: false,
    image: null,
    foodType: 0,
    quantity: "",
    storeName: storeName,
    longitude: longitude,
    latitude: latitude,
  });

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
      storeName: storeName,
      longitude: longitude,
      latitude: latitude,
      [name]: type === "checkbox" ? event.target.checked : value,
    });
  };

  const handleImageChange = (event) => {
    const imageFile = event.target.files[0];
    setFoodData({
      ...foodData,
      storeName: storeName,
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
        storeName: storeName,
        userId: userId,
        longitude: longitude,
        latitude: latitude,
      });

      // Fetch the updated list of foods again
      const updatedFoods = await getVendorFoods(userId);
      setFoods(updatedFoods);

      setSuccessMessage("Food successfully created!");

      // Reset the form fields in the state
      setFoodData({
        foodName: "",
        price: 0,
        isAvailable: false,
        image: null,
        foodType: "",
        quantity: 0,
        longitude: longitude,
        latitude: latitude,
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
      longitude: longitude,
      latitude: latitude,
    });
    setCreatedFood(null);
    setSuccessMessage("");
  };

  const updateItemQuantity = async (itemId, newQuantity) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;

        // Reference to the specific item in the cart
        const vendorFoodRef = doc(db, "vendors", userId, "foods", itemId);

        const vendorRefSnapshot = await getDoc(vendorFoodRef);

        if (vendorRefSnapshot.exists()) {
          await updateDoc(vendorFoodRef, { Quantity: newQuantity });

          // Update the quantity in the local state
          const updatedFoods = foods.map((food) => {
            if (food.id === itemId) {
              return { ...food, Quantity: newQuantity };
            } else {
              return food;
            }
          });
          setFoods(updatedFoods);
        }
      } else {
        console.error("User is not authenticated.");
      }
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  return (
    <div className="main-page">
      <h2 className="title">
        <strong>{storeName}</strong>
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
                  <button
                    onClick={() =>
                      updateItemQuantity(food.id, food.Quantity - 1)
                    }
                  >
                    -
                  </button>
                  <button
                    onClick={() =>
                      updateItemQuantity(food.id, food.Quantity + 1)
                    }
                  >
                    +
                  </button>
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
      {showModal && (
        <div className="flex">
          <div className="absolute bg-black opacity-[0.2] top-0 left-0 bottom-0 right-0 z-[15]"></div>
          <div className="flex w-full h-full justify-center items-center">
            <div className="absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-white z-20 w-[80%]">
              Your content here
            </div>
          </div>
        </div>
      )}
      {/* <Modal show={showModal}>
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
      </Modal> */}
    </div>
  );
}

export default Vendor;
