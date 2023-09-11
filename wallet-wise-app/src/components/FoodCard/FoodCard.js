import React, { useState } from "react";
import "./FoodCard.css"; 
import cart from "../../images/cart.png";
import map from "../../images/location.png";
import { db } from '../../utils/firebase';
import { doc, setDoc } from "firebase/firestore";
import authService from "../../utils/auth";

export const FoodCard = (props) => {
  const { img, name, price } = props;
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddToCart = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        const userId = user.uid; // Get the user's UID
        const itemId = `${userId}-${name}-${Date.now()}`;
  
        // Reference to the user-specific cart collection
        const cartDocRef = doc(db, "carts", userId, "items", itemId);
  
        await setDoc(cartDocRef, {
          name: name,
          unitPrice: price,
          quantity: quantity,
          totalPrice: price * quantity
        });
  
        console.log("Item added to cart with ID:", itemId);
  
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
          <img
            src={img}
            alt="Food"
            className="image"
          />
          <h3>{name}</h3>
          <h4>
            <strong>₱{parseFloat(price).toFixed(2)}</strong>
          </h4>
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
            <button onClick={handleAddToCart}>Add to Cart</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};
