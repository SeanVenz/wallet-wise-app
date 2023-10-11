import React, { useEffect, useState } from "react";
import "./FoodCard.css";
import cart from "../../images/cart.png";
import map from "../../images/location.png";
import { db } from "../../utils/firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import authService from "../../utils/auth";
import MapboxMarker from "components/Mapbox/MapBoxMarker";

export const FoodCard = (props) => {
  const { img, name, price, number, storeName, id, latitude, longitude } =
    props;
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [errorMsg, setErrorMsg] = useState("");
  const [showMap, setShowMap] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const handleOpenMapModal = () => {
    setShowMapModal(true);
  };

  const handleCloseMapModal = () => {
    setShowMapModal(false);
  };

  const handleOpenMap = () => {
    setShowMap(true);
  };

  const handleCloseMap = () => {
    setShowMap(false);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddToCart = async () => {
    try {
      if (quantity > number) {
        setErrorMsg("There is not enough stock!");
        return false;
      }
      const user = authService.getCurrentUser();
      if (user) {
        const userId = user.uid;
        const itemId = `${userId}-${name}-${id}`;

        const cartDocRef = doc(db, "carts", userId, "items", itemId);

        const cartCollection = collection(db, "carts", userId, "items");
        const querySnapshot = await getDocs(cartCollection);

        let foundExistingItem = false;

        querySnapshot.forEach(async (doc) => {
          if (doc.data().foodId === id) {
            foundExistingItem = true;

            const existingQuantity = doc.data().quantity;
            const existingPrice = doc.data().unitPrice;
            const existingTotalPrice = doc.data().totalPrice;
            await updateDoc(cartDocRef, {
              quantity: existingQuantity + quantity,
              totalPrice: existingTotalPrice + existingPrice * quantity,
            });
          }
        });

        if (!foundExistingItem) {
          await setDoc(cartDocRef, {
            foodId: id,
            name: name,
            unitPrice: price,
            quantity: quantity,
            totalPrice: price * quantity,
            storeName: storeName,
            number: number,
            img: img,
          });
        }

        console.log("Item added to cart with ID:", itemId);

        setQuantity(1);
        setShowModal(false);
      } else {
        console.error("User is not authenticated.");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };

  return (
    <div>
      <div className="card flex justify-between items-center flex-col flex-grow overflow-auto">
        <div className="foodname flex flex-col items-center justify-between h-full pt-10">
          <img src={img} alt="Food" className="market-food-image flex" />

          <div className="detailsFood flex flex-col">
            <h3>{name}</h3>
            <div>
              <h5>
                <strong>₱{parseFloat(price).toFixed(2)}</strong>
              </h5>
              <p>In Stock: {number}</p>
              <span className="text-[16px] font-thin">{storeName}</span>
            </div>
          </div>
        </div>

        <div className="bottom">
          <img src={cart} alt="cart" onClick={handleOpenModal} />
          <img src={map} alt="map" onClick={handleOpenMapModal} />
        </div>
      </div>
      {showModal && (
        <div className="modal">
          <div className="modal-content addToCart-Modal">
            <h2 className="add-to-cart-label">ADD TO CART</h2>
            <h2 className="item-name-label">Item Name:</h2>
            <h2 className="item-name">{name}</h2>
            <h2 className="quantity-label">Quantity:</h2>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />
            <strong>{errorMsg}</strong>

            <hr></hr>
            <div>
              <button className="add-btn" onClick={handleAddToCart}>
                ADD TO CART
              </button>
              <button className="cancel-btn" onClick={handleCloseModal}>
                CANCEL
              </button>
            </div>
          </div>
        </div>
      )}
      {showMapModal && (
        <div className="modal">
          <div className="mapModal justify-center bg-red-500">
            <h2>MAP</h2>
            <div className="map-container">
              <MapboxMarker latitude={latitude} longitude={longitude} />
            </div>
            <button onClick={handleCloseMapModal} className="close-button">
              Close Map
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
