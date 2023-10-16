import React, { useState, useEffect } from "react";
import { getAllFoods, getFoods } from "../../service/FoodService";
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
  const [isFullCourseMeal, setIsFullCourseMeal] = useState(false);
  const [budget, setBudget] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);

  useEffect(() => {
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

  const filterFullCourse = (food) => {
    if (isFullCourseMeal) {
      let remainingBudget = budget;
  
      if (food.Name === "Rice" && parseFloat(food.Price) <= remainingBudget) {
        remainingBudget = remainingBudget - parseFloat(food.Price);
        console.log(remainingBudget)
        return true; // Include rice and update the remaining budget
      }
      console.log(remainingBudget)
      if (food.FoodType === "Main Dish") {
        console.log(remainingBudget)
        const mainDishItems = foods.filter((item) => item.FoodType === "Main Dish");
        if (mainDishItems.length > 0) {
          // Sort main dishes by price in descending order (most expensive first)
          mainDishItems.sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price));
  
          for (const mainDish of mainDishItems) {
            if (parseFloat(mainDish.Price) <= remainingBudget) {
              remainingBudget -= parseFloat(mainDish.Price);
              console.log(remainingBudget)
              return food === mainDish; // Include the most expensive main dish within the remaining budget
            }
          }
        }
        return false; // Exclude non-main dish items
      }
  
      if (food.FoodType === "Drinks" && parseFloat(food.Price) <= remainingBudget) {
        remainingBudget -= parseFloat(food.Price);
        return true; // Include drinks within the remaining budget
      }
  
      return false; // Exclude any other items if they don't fit the budget
    } else {
      return true; // Include all items if the checkbox is not checked
    }
  };
  

  return (
    <div className="market-parent">
      {/* MARKET FILTER */}
      <div className="market-filter flex-wrap w-[80%] lg:w-[90%] gap-2 md:bg-[#eae2f3] top-10 md:top-0 md:sticky">
        <div className="budget-filter text-[20px] md:text-25[px] lg:text-[30px]">
          <div className="php-logo left-[100px] md:left-[150px]">
            <img src={PHP} alt="php" className="php" />
          </div>
          BUDGET:
          <input
            type="number"
            className="custom-input w-[130px] md:w-[120px] lg:w-[170px]"
            defaultValue={0}
            onChange={(e) =>
              e.target.value
                ? (setMaxPrice(Number(e.target.value)), setBudget(Number(e.target.value)))
                : setMaxPrice(Number.MAX_SAFE_INTEGER)
            }
          />
        </div>
        <div className="shop-filter text-[20px] md:text-25[px] lg:text-[30px]">
          SHOP:
          <select
            className="custom-input-shop w-[155px] md:w-[250px] lg:w-[305px] text-[15px] flex-wrap"
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
        <div className="full-course-meal-filter">
          <label>
            Full Course Meal
            <input
              type="checkbox"
              onChange={(e) => setIsFullCourseMeal(e.target.checked)}
            />
          </label>
        </div>
      </div>

      {/* FOOD CHOICES */}
      <div className="foods flex flex-wrap gap-[60px] p-10">
        {foods &&
          foods
            .filter((food) => food.Price <= maxPrice)
            .filter((food) => food.isAvailable === true)
            .filter((food) => food.Quantity > 0)
            .filter((food) => {
              return selectedFoodType === ""
                ? true
                : food.FoodType === selectedFoodType;
            })
            .filter(
              (food) =>
                storeName === "All" ||
                food.StoreName.toLowerCase().includes(storeName.toLowerCase())
            )
            .filter((food) => filterFullCourse(food))
            .map((food, index) => (
              <FoodCard
                key={index}
                name={food.Name}
                img={food.ImageUrl}
                price={food.Price}
                number={food.Quantity}
                storeName={food.StoreName}
                id={food.id}
                longitude={food.Longitude}
                latitude={food.Latitude}
              />
            ))}
      </div>

      {/* FOOD TYPES */}
      <div className="food-filter">
        <FoodNav setSelectedFoodType={setSelectedFoodType} />
      </div>
    </div>
  );
};

export default StudentMarket;
