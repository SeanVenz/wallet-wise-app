import { deleteDoc, doc, getDoc, updateDoc } from "@firebase/firestore";
import { db } from "./firebase";

export function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  return formattedDate;
}

export function groupItemsByStore(deliveryItems) {
  const storeItemsMap = new Map();
  deliveryItems.forEach((item) => {
    const storeName = item.storeName;
    if (!storeItemsMap.has(storeName)) {
      storeItemsMap.set(storeName, []);
    }
    storeItemsMap.get(storeName).push(item);
  });
  return storeItemsMap;
}

export function calculatePerPersonTotal(items) {
  let total = 0;
  items.forEach((item) => {
    total += item.totalPrice;
  });
  return total;
}

export const handleCancelOrder = async (ordererId, orderId) => {
  const userRef = doc(db, "users", ordererId);
  const userData = await getDoc(userRef);

  const orderRef = doc(db, "orders", orderId);
  const orderData = await getDoc(orderRef);

  if (userData.exists() && orderData.exists()) {
    await updateDoc(userRef, {
      hasPendingOrder: false,
    });

    await deleteDoc(orderRef);
  }
};
