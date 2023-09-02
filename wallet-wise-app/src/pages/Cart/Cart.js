import React from "react";

const Cart = ({ cartItems }) => {

  console.log("Cart items:", cartItems);  

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cartItems && cartItems.length > 0 ? (
        <ul className="cart-items">
          {cartItems.map((item, index) => (
            <li key={index} className="cart-item">
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>Price: ₱{item.price.toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default Cart;
