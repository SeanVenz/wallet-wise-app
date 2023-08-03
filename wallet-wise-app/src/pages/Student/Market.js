import React, { useState, useEffect } from "react";
import { getAllFoods } from "../../service/FoodService";
import PHP from "../../images/php.png";
import "./Market.css";
import { FoodNav } from "./FoodNav";
import { FoodCard } from "./FoodCard";

const StudentMarket = () => {
  const [foods, setFoods] = useState([]);
  const [maxPrice, setMaxPrice] = useState(Number.MAX_SAFE_INTEGER);
  const [selectedFoodType, setSelectedFoodType] = useState("");

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
        console.error("Error fetching foods:", error);
      }
    };

    fetchFoods();
  }, []);

  console.log("TEST", foods);

  //sample data
  const foodss = [
    {
      name: "Pizza",
      foodType: "Italian",
      price: 12.99,
      isAvailable: true,
      imageUrl: "https://example.com/pizza.jpg",
    },
    {
      name: "Pizza",
      foodType: "Italian",
      price: 12.99,
      isAvailable: true,
      imageUrl: "https://example.com/pizza.jpg",
    },
    {
      name: "Pizza",
      foodType: "Italian",
      price: 12.99,
      isAvailable: true,
      imageUrl: "https://example.com/pizza.jpg",
    },
    {
      name: "Pizza",
      foodType: "Italian",
      price: 12.99,
      isAvailable: true,
      imageUrl: "https://example.com/pizza.jpg",
    },
    {
      name: "Pizza",
      foodType: "Italian",
      price: 12.99,
      isAvailable: true,
      imageUrl: "https://example.com/pizza.jpg",
    },
    {
      name: "Pizza",
      foodType: "Italian",
      price: 12.99,
      isAvailable: true,
      imageUrl: "https://example.com/pizza.jpg",
    },
    {
      name: "Pizza",
      foodType: "Italian",
      price: 12.99,
      isAvailable: true,
      imageUrl: "https://example.com/pizza.jpg",
    },
    {
      name: "Pizza",
      foodType: "Italian",
      price: 12.99,
      isAvailable: true,
      imageUrl: "https://example.com/pizza.jpg",
    },
    {
      name: "Pizza",
      foodType: "Italian",
      price: 12.99,
      isAvailable: true,
      imageUrl: "https://example.com/pizza.jpg",
    },
    {
      name: "Pizza",
      foodType: "Italian",
      price: 12.99,
      isAvailable: true,
      imageUrl: "https://example.com/pizza.jpg",
    },
    {
      name: "Burger",
      foodType: "Kakanin",
      price: 8.49,
      isAvailable: true,
      imageUrl: "https://example.com/burger.jpg",
    },
    {
      name: "Sushi",
      foodType: "Kakanin",
      price: 18.99,
      isAvailable: true,
      imageUrl: "https://example.com/sushi.jpg",
    },
  ];

  return (
    <div className="market-parent">
      {/* FILTER BAR BUDGET AND SHOP */}
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
      {/* {foods &&
        foods.map((food, index) => (
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
      <div className="foods">
        {foodss
          .filter(
            (food) =>
              food.foodType === selectedFoodType || selectedFoodType === ""
          )
          .filter((food) => food.price <= maxPrice)
          .filter((food) => food.isAvailable === true)
          .map((food) => (
            <FoodCard
              key={1}
              name={food.name}
              img={food.imageUrl}
              price={food.price}
            />
          ))}
      </div>
      {/* FILTER BAR FOOD TYPE */}
      <div className="food-filter">
        <FoodNav setSelectedFoodType={setSelectedFoodType} />
      </div>
    </div>
  );
};

export default StudentMarket;
