import React, { useState } from "react";
import "./FoodCard.css";
import cart from "../../images/cart.png";
import map from "../../images/location.png";
import { db } from "../../utils/firebase";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import authService from "../../utils/auth";
import Cart from "../../pages/Cart/Cart";

export const FoodCard = (props) => {
  const { img, name, price, number, storeName, id } = props;
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // const updateItemQuantity = async () => {
  //   try {
  //     // Reference to the specific item in the food
  //     const foodItemRef = doc(db, "food", id);
  //     const newQuantity = quantity - number;

  //     const foodRefSnapshot = await getDoc(foodItemRef);

  //     if (foodRefSnapshot.exists()) {
  //       // Update the quantity in Firestore
  //       await updateDoc(foodItemRef, {
  //         Quantity: newQuantity,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error updating item quantity:", error);
  //     return false;
  //   }
  // };

  const handleAddToCart = async () => {
    try {
      if (quantity > number) {
        setErrorMsg("There is not enough stock!");
        return false;
      }
      const user = authService.getCurrentUser();
      if (user) {
        const userId = user.uid; // Get the user's UID
        const itemId = `${userId}-${name}-${Date.now()}`;

        // Reference to the user-specific cart collection
        const cartDocRef = doc(db, "carts", userId, "items", itemId);

        await setDoc(cartDocRef, {
          foodId: id,
          name: name,
          unitPrice: price,
          quantity: quantity,
          totalPrice: price * quantity,
          storeName: storeName,
          number: number
        });

        console.log("Item added to cart with ID:", itemId);

        // updateItemQuantity();

        // Reset form fields and options
        setQuantity(1);
        setShowModal(false);
      } else {
        // Handle the case where the user is not authenticated
        console.error("User is not authenticated.");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <div>
      <div className="card">
        <div className="top">
          <img src={img} alt="Food" className="image" />
          <h3>{name}</h3>
          <h4>
            <strong>₱{parseFloat(price).toFixed(2)}</strong>
          </h4>
          <p>In Stock: {number}</p>
          <p>Store Name: {storeName}</p>
        </div>
        <div className="bottom">
          <img src={cart} alt="cart" onClick={handleOpenModal} />
          <img src={map} alt="map" />
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add to Cart</h2>
            <label>Quantity:</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <strong>{errorMsg}</strong>
            <button onClick={handleAddToCart}>Add to Cart</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
