import React from "react";
import { useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.location.assign("/"); // przekierowuje na stronę główną lub można przekierować na stronę logowania
  }, [navigate]);

  return null; // Komponent nie renderuje niczego w DOM
};

export default Logout;
