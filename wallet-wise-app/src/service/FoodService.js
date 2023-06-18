import axios from "axios";

const API_BASE_URL = "https://localhost:7273/api";

export const createFood = async (foodData) => {
  try {
    const formData = new FormData();
    for (const key in foodData) {
      formData.append(key, foodData[key]);
    }

    const response = await axios.post(`${API_BASE_URL}/foods`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error(`Error creating food: ${error}`);
    throw error;
  }
};

export const getAllFoods = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/foods`);
    return response.data;
  } catch (error) {
    console.error(`Error getting all foods: ${error}`);
    throw error;
  }
};
