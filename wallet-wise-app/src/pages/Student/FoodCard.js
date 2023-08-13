import React from "react";
import "./FoodCard.css";
import cart from "../../images/cart.png";
import map from "../../images/location.png";

export const FoodCard = (props) => {
  const { img, name, price } = props;

  return (
    <div className="card">
      <div className="top">
        <img src={img} alt="Food" className="image"></img>
        <h3>{name}</h3>
        <h4>
          <strong>₱{parseFloat(price).toFixed(2)}</strong>
        </h4>
      </div>
      {/* <h1>{availability}</h1> */}
      <div className="bottom">
        <img src={cart} alt="cart" />
        <img src={map} alt="map" />
      </div>
    </div>
  );
};
