// auth.ts
import axios from "axios";

const BASE_URL = "http://20.26.112.27:8000";

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/user/login/`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.log(username)
    console.log(password)
    console.error("Login error:", error.response.data);
    throw error;
  }
};



export const register = async ({
  username,
  email,
  password,
  first_name,
  last_name,
  delivery_address,
  payment_details
}: {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  delivery_address: string;
  payment_details: string;
}) => {
  const response = await axios.post(`${BASE_URL}/user/create/`, {
    username,
    email,
    password,
    first_name,
    last_name,
    delivery_address,
    payment_details
  });
  return response.data;
};
