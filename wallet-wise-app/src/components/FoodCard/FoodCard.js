import React from "react";
import "./FoodCard.css";
import cart from "../../images/cart.png";
import map from "../../images/location.png";

export const FoodCard = (props) => {
  const { img, name, price } = props;

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
          <img src={cart} alt="cart" />
          <img src={map} alt="map" />
        </div>
      </div>
    </div>
  );
};

