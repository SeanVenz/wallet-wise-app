import React, { useEffect } from "react";
import "./CartConfirmationModal.css";

const CartConfirmationModal = ({ isOpen, onClose, onAddToCart }) => {
  useEffect(() => {
    const handleOverlayClick = (e) => {
      if (e.target.classList.contains("cart-confirmation-modal")) {
        onClose();
      }
    };

    if (isOpen) {
      // Add a click event listener to the modal overlay when the modal is open
      document.addEventListener("click", handleOverlayClick);
    }

    return () => {
      // Remove the event listener when the modal is closed or unmounted
      document.removeEventListener("click", handleOverlayClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="cart-confirmation-modal">
      <div className="modal-content">
        <h2>Do you want to add this item to your cart?</h2>
        <div className="modal-buttons">
          <button onClick={() => onAddToCart()}>Yes</button>
          <button onClick={onClose}>No</button>
        </div>
      </div>
    </div>
  );
};

export default CartConfirmationModal;
