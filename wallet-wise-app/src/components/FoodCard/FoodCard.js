import React, { useState } from "react";
import "./FoodCard.css";
import cart from "../../images/cart.png";
import map from "../../images/location.png";
import CartConfirmationModal from "../ConfirmationModal/CartConfirmationModal";

export const FoodCard = (props) => {
  const { img, name, price, onAddToCart } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddToCart = () => {
    onAddToCart({ name, imageUrl: img, price }); // Pass food details to addToCart function
    console.log("Adding to cart from FoodCard:", { name, imageUrl: img, price }); // Add this line for debugging
    closeModal(); // Close the modal
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
          <img src={cart} alt="cart" onClick={openModal} />
          <img src={map} alt="map" />
        </div>
      </div>
      <CartConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
};

