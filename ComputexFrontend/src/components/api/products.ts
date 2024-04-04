const API_URL = "http://localhost:8000/products/";

export const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There was an error fetching the products:", error);
    throw error;
  }
};
