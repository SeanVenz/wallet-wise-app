import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection, getDocs, query, addDoc } from "firebase/firestore";
import { db, storage } from "../utils/firebase";

export const getFoods = async () => {
  const vendorsCollection = collection(db, "vendors");
  const vendorSnapshot = await getDocs(vendorsCollection);
  const vendorFoods = [];

  vendorSnapshot.forEach((vendorDoc) => {
    const vendorId = vendorDoc.id;
    const foodsCollection = collection(vendorDoc.ref, "foods"); 
    const foodsSnapshot = getDocs(foodsCollection);

    foodsSnapshot.forEach((foodDoc) => {
      vendorFoods.push({
        ...foodDoc.data(),
        id: foodDoc.id,
        vendorId: vendorId,
      });
    });
  });
  return vendorFoods;
};

export const getVendorFoods = async (userId) => {
  const vendorFoodCollection = collection(db, "vendors", userId, "foods");
  const vendorFoodQuery = query(vendorFoodCollection);
  const vendorFoodSnapshot = await getDocs(vendorFoodQuery);
  console.log(vendorFoodSnapshot)
  return vendorFoodSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

export const addFood = async ({
  foodName,
  price,
  isAvailable,
  image,
  foodType,
  quantity,
  userId, // Add a userId parameter
}) => {
  try {
    const storageRef = ref(storage, `foodImages/${image.name}`);
    await uploadBytes(storageRef, image);
    const imageUrl = await getDownloadURL(storageRef);

    // Create a unique identifier for the food item
    const foodId = `${userId}-${foodName}-${Date.now()}`;

    // Reference to the vendor-specific food collection
    const foodDocRef = doc(db, "vendors", userId, "foods", foodId);

    await setDoc(foodDocRef, {
      Name: foodName,
      Price: price,
      isAvailable: isAvailable,
      ImageUrl: imageUrl,
      FoodType: foodType,
      Quantity: quantity,
    });

    console.log("Food item added with ID:", foodId);
  } catch (error) {
    console.error("Error adding food item:", error);
    throw error;
  }
};


export const getAllFoods = async () => {
  const foodCollection = collection(db, "food");
  const foodSnapshot = await getDocs(foodCollection);
  return foodSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

export const addAllFood = async ({ foodName, price, isAvailable, image, foodType, quantity, storeName }) => {

  const storageRef = ref(storage, `images/${image.name}`);
  await uploadBytes(storageRef, image);
  const imageUrl = await getDownloadURL(storageRef);

  // Get a reference to the "food" collection and use addDoc to create a new document with a random ID
  const foodCollectionRef = collection(db, "food");
  await addDoc(foodCollectionRef, {
    Name: foodName,
    Price: price,
    isAvailable: isAvailable,
    ImageUrl: imageUrl,
    FoodType: foodType,
    Quantity: quantity,
    StoreName: storeName,
  });
};