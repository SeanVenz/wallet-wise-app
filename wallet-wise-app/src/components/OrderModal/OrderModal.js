// OrderModal.js
import React from "react";
import "./OrderModal.scss";
import { auth } from "utils/firebase";

const OrderModal = ({ orderData, onClose }) => {
  console.log(orderData.items[0].itemName);
  return (
    <div className="order-modal">
      <div className="order-modal-content">
        <button className="order-close-button" onClick={onClose}>
          Close
        </button>
        <h2>ORDER SUMMARY:</h2>
        <div className="order-data">
          {auth.currentUser.uid === orderData.userId ? (
            <div className="name">
              <p>Courier Name: {orderData.courierName}</p>
            </div>
          ) : (
            <div className="name">
              <p>Buyer Name: {orderData.userName}</p>
            </div>
          )}

          <div className="foods">
            {orderData.items && orderData.items.length > 0 && (
              <>
                <h3>ORDER SUBTOTAL:</h3>
                <div className="scrollable">
                  <ul>
                    {orderData.items.map((item, index) => (
                      <li key={index}>
                        <p>{item.itemName}</p>
                        <p>{item.quantity}</p>
                        <p>{item.totalPrice}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
