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