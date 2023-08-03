import React, { useState, useEffect } from "react";
import { getAllFoods } from "../../service/FoodService";
import PHP from "../../images/php.png";
import "./Market.css";

const StudentMarket = () => {
  const [foods, setFoods] = useState([]);
  // Fetch all foods from the API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const foodsData = await getAllFoods();
        setFoods(foodsData);
        console.log(foodsData);
      } catch (error) {
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  console.log("TEST", foods);

  return (
    <div className="market-parent">
      {/* FILTER BAR BUDGET AND SHOP */}
      <div className="market-filter">
        <div className="budget-filter">
          <div className="php-logo">
            <img src={PHP} alt="php" className="php" />
          </div>
          BUDGET:
          <input type="number" className="custom-input" defaultValue={0} />
        </div>
        <div className="shop-filter">
          SHOP:
          <input
            type="text"
            className="custom-input-shop"
            defaultValue={"School Canteen"}
          />
        </div>
      </div>
      {/* {foods.map((food, index) => (
        <div id={index}>
          Test
          <h3>Food Type: {food.foodType}</h3>
          <p>Food Name: {food.name}</p>
          <p>
            Availability: {food.isAvailable ? "Available" : "Not Available"}
          </p>
          <p>Price: {food.price}</p>
          <img src={food.imageUrl} alt={food.name}></img>
        </div>
      ))} */}

      {/* FILTER BAR FOOD TYPE */}
      <div className="food-filter"></div>
    </div>
  );
};

export default StudentMarket;
