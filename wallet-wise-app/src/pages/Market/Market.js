import React, { useState, useEffect } from "react";
import { getAllFoods } from "../../service/FoodService";
import PHP from "../../images/php.png";
import "./Market.css";
import { FoodNav } from "../../components/FoodNav/FoodNav";
import { FoodCard } from "../../components/FoodCard/FoodCard";
import CartConfirmationModal from "../../components/ConfirmationModal/CartConfirmationModal";
import Cart from "../Cart/Cart";

const StudentMarket = () => {
  const [foods, setFoods] = useState([]);
  const [maxPrice, setMaxPrice] = useState(Number.MAX_SAFE_INTEGER);
  const [selectedFoodType, setSelectedFoodType] = useState("");
  const [cart, setCart] = useState([]); // State to manage cart items
  const [selectedFood, setSelectedFood] = useState(null); // State to store the selected food item
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  console.log(cart);

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

  // Function to add a food item to the cart
  const addToCart = (food) => {
    setSelectedFood(food); // Store the selected food
    setIsModalOpen(true); // Open the confirmation modal
    console.log("Adding to cart:", food);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Function to confirm adding the food to the cart
  const confirmAddToCart = () => {
    if (selectedFood) {
      // Create a new item object with details from the selected food
      const newItem = {
        name: selectedFood.name,
        img: selectedFood.imageUrl,
        price: selectedFood.price,
      };

      // Update the cart state with the new item
      setCart((prevCart) => [...prevCart, newItem]);

      // Close the modal
      console.log("Item added to cart:", newItem); 
      closeModal();
    }
  };

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
      <div className="foods">
        {foods &&
          foods
            .filter(
              (food) =>
                food.foodType === selectedFoodType || selectedFoodType === ""
            )
            .filter((food) => food.price <= maxPrice)
            .filter((food) => food.isAvailable === true)
            .map((food, index) => (
              <FoodCard
                key={index}
                name={food.name}
                img={food.imageUrl}
                price={food.price}
                onAddToCart={() => addToCart(food)} // Add to cart function
              />
            ))}
      </div>
      {/* FILTER BAR FOOD TYPE */}
      <div className="food-filter">
        <FoodNav setSelectedFoodType={setSelectedFoodType} />
      </div>
      {cart.length > 0 && <Cart cartItems={cart} />}
      <CartConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddToCart={confirmAddToCart}
      />
    </div>
  );
};

export default StudentMarket;
