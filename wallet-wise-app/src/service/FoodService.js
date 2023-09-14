import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection, getDocs } from "firebase/firestore";
import { db, storage } from "../utils/firebase";

export const getFoods = async () => {
  const foodCollection = collection(db, "food");
  const foodSnapshot = await getDocs(foodCollection);
  return foodSnapshot.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
};

export const addFood = async ({ foodName, price, isAvailable, image, foodType, quantity }) => {

  const storageRef = ref(storage, `foodImages/${image.name}`);
  await uploadBytes(storageRef, image);
  const imageUrl = await getDownloadURL(storageRef);

  const foodDocRef = doc(db, "food", foodName);
  await setDoc(foodDocRef, {
    Name: foodName,
    Price: price,
    isAvailable: isAvailable,
    ImageUrl: imageUrl,
    FoodType: foodType,
    Quantity: quantity
  });
};