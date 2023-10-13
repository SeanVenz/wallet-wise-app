import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { addFood, getVendorFoods, addAllFood } from "../../service/FoodService";
import { auth, db } from "../../utils/firebase";
import "./Vendor.scss";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { useNavigate } from "react-router-dom";

function Vendor() {
  const navigate = useNavigate();
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
          // Ensure newQuantity is parsed as an integer
          const updatedQuantity = parseInt(newQuantity);
  
          await updateDoc(vendorFoodRef, { Quantity: updatedQuantity });
  
          // Update the quantity in the local state
          const updatedFoods = foods.map((food) => {
            if (food.id === itemId) {
              return { ...food, Quantity: updatedQuantity };
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

  const customModalStyles = {
    display: showModal ? "block" : "none",
  };

  const handleLogOut = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="h-screen w-screen gap-10 flex flex-col main-page justify-between">
      <div className="w-full px-[60px] lg:px-10 flex flex-row justify-between items-end lg:items-center title-add-button">
        <strong className="w-full text-[25px]">{storeName}</strong>
        <div className="logout-vendor flex items-center">
          <div className="logout-button">
            <button onClick={handleLogOut}>Log Out</button>
          </div>
        </div>
      </div>
      <div className="my-table overflow-auto rounded-lg">
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
                  <td className="flex items-center justify-center">
                    <img src={food.ImageUrl} alt={food.Name} />
                  </td>
                  <td>{parseInt(food.Quantity)}</td>
                  <td>
                    <div className="flex flex-col h-full w-full text-[30px]">
                      <button
                        onClick={() =>
                          updateItemQuantity(food.id, food.Quantity - 1)
                        }
                        className="bg-white px-5 rounded-lg"
                      >
                        -
                      </button>
                      <button
                        onClick={() =>
                          updateItemQuantity(food.id, food.Quantity + 1)
                        }
                        className="bg-white px-5 rounded-lg"
                      >
                        +
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No foods available.</p>
        )}
      </div>
      <div className="w-full flex justify-center p-5 sticky">
        <div className="my-button w-[80%]">
          <button onClick={handleNewFoodClick}>ADD FOOD</button>
        </div>
      </div>
      <div
        className="vendor-custom-modal  overflow-auto"
        style={customModalStyles}
      >
        <div className="custom-modal-content w-full md:w-auto">
          <div className="modal-header">
            <h2 className="modal-title">Add Food</h2>
          </div>
          <div className="modal-body">
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
              <div className=" input-available">
                <label>
                  <div className="parent-available">
                    <span>Is it Available?</span>
                  </div>
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={foodData.isAvailable}
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className=" input-img">
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
          </div>
          <div className="modal-footer">
            <button onClick={handleCloseModal}>Close</button>
            <button onClick={handleSubmit}>Add Food</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Vendor;
