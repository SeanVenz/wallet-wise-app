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
  const [storeName, setStoreName] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [storeNames, setStoreNames] = useState([]);

  useEffect(() => {
    console.log(foods);
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    console.log(selectedFoodType);
  }, [selectedFoodType]);

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const foodsData = await getAllFoods();
        setFoods(foodsData);

        const uniqueStoreNames = [
          ...new Set(foodsData.map((food) => food.StoreName)),
        ];
        setStoreNames(uniqueStoreNames);
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
          <select
            className="custom-input-shop"
            defaultValue={"All"}
            onChange={(e) => setStoreName(e.target.value)}
          >
            <option value="All">All</option>
            {storeNames.map((storeName, index) => (
              <option key={index} value={storeName}>
                {storeName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="foods">
        {foods &&
          foods
            .filter((food) => food.Price <= maxPrice)
            .filter((food) => food.isAvailable === true)
            .filter((food) => food.Quantity > 0)
            .filter(
              (food) =>
                storeName === "All" ||
                food.StoreName.toLowerCase().includes(storeName.toLowerCase())
            )
            .map((food, index) => (
              <FoodCard
                key={index}
                name={food.Name}
                img={food.ImageUrl}
                price={food.Price}
                number={food.Quantity}
                storeName={food.StoreName}
                id={food.id}
                longitude = {food.Longitude}
                latitude = {food.Latitude}
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
