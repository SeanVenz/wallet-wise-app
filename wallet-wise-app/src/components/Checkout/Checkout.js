import React, { useState } from 'react';
import { db, auth } from '../../utils/firebase';
import { collection, addDoc, doc, FieldValue } from 'firebase/firestore';
import authService from '../../utils/auth';

function Checkout({ cartItems, fullName, idNumber, phoneNumber, clearCart }) {
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const user = auth.currentUser; // Get the current user directly from Firebase auth

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCheckout = async () => {
    try {
      const user = authService.getCurrentUser();
      if (user) {
        const userId = user.uid; 

        const deliveryCollectionRef = collection(db, 'deliveries');

        const itemsToCheckout = cartItems.map((item) => ({
          itemName: item.name,
          quantity: item.quantity,
          totalPrice: item.totalPrice,
        }));

        // Create a delivery document with user information and items
        await addDoc(deliveryCollectionRef, {
          userId: userId,
          userName: fullName,
          idNumber: idNumber,
          phoneNumber: phoneNumber,
          items: itemsToCheckout,
          timestamp: Date.now(),
        });

        // Clear the cart
        clearCart();

        // Close the modal
        handleCloseModal();
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    }
  };

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={handleOpenModal}>Checkout</button>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Checkout</h2>
            <button onClick={handleCheckout}>Confirm</button>
            <button onClick={handleCloseModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Checkout;
