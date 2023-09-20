import React, { useState, useEffect } from "react";
import { getAllFoods } from "../../service/FoodService";
import PHP from "../../images/php.png";
import "./Market.css";
import { FoodNav } from "../../components/FoodNav/FoodNav";
import { FoodCard } from "../../components/FoodCard/FoodCard";
import { auth } from "../../utils/firebase";

const StudentMarket = () => {
  const [foods, setFoods] = useState([]);
  const [maxPrice, setMaxPrice] = useState(Number.MAX_SAFE_INTEGER);
  const [selectedFoodType, setSelectedFoodType] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Listen for authentication state changes using Firebase's onAuthStateChanged
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If a user is logged in, set the currentUser state 
        setCurrentUser(user);
      } else {
        // If no user is logged in, set currentUser to null
        setCurrentUser(null);
      }
    });
  
    // Cleanup the subscription when the component unmounts
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(selectedFoodType);
  }, [selectedFoodType]);

  // Fetch all foods from the API
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const foodsData = await getAllFoods();
        setFoods(foodsData);
        console.log(foodsData);
      } catch (error) {
        console.error("Error fetching all foods:", error);
      }
    };

    fetchFoods();
  }, []);

  return (
    <div className="market-parent">
      <div className="market-filter">
        <div className="budget-filter">
          <div className="php-logo">
            <img src={PHP} alt="php" className="php" />
          </div>
          BUDGET:
          <input
            type="number"
            className="custom-input"
            defaultValue={0}
            onChange={(e) =>
              e.target.value
                ? setMaxPrice(Number(e.target.value))
                : setMaxPrice(Number.MAX_SAFE_INTEGER)
            }
          />
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
      <div className="foods">
        {foods &&
          foods
            .filter(
              (food) =>
                food.FoodType === selectedFoodType || selectedFoodType === ""
            )
            .filter((food) => food.Price <= maxPrice)
            .filter((food) => food.isAvailable === true)
            .map((food, index) => (
              <FoodCard
                key={index}
                name={food.Name}
                img={food.ImageUrl}
                price={food.Price}
                number = {food.Quantity}
                storeName = {food.StoreName}
              />
            ))}
      </div>
      <div className="food-filter">
        <FoodNav setSelectedFoodType={setSelectedFoodType} />
      </div>
    </div>
  );
};

export default StudentMarket;
