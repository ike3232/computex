import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  FaHome,
  FaBriefcase,
  FaLaptop,
  FaEnvelope,
  FaUser,
} from "react-icons/fa";
import "./Navbar.css";
import Logout from "../../auth/Logout";
import logo from "../../../../src/assets/main/logo.png";
import { useNavigate } from "react-router-dom";
const Navbar: React.FC = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (token && storedUsername) {
      setIsUserLoggedIn(true);
      setUsername(storedUsername);
    }
  }, []);
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark custom-navbar">
      <div className="container-fluid">
        <NavLink className="navbar-brand custom-navbar-brand" to="#home">
          <img src={logo} alt="Logo" className="navbar-logo" />
        </NavLink>
        <button
          className="navbar-toggler custom-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <NavLink className="nav-link custom-nav-link" to="/">
                <FaHome /> Strona główna
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-nav-link" to="/offer">
                <FaBriefcase /> Oferta
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link custom-nav-link"
                to="/build-computer"
              >
                <FaLaptop /> Składak komputerów
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link custom-nav-link" to="/contact">
                <FaEnvelope /> Kontakt
              </NavLink>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            {isUserLoggedIn ? (
              <li className="nav-item dropdown">
                <span
                  className="nav-link dropdown-toggle custom-nav-link"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <FaUser /> {username}
                </span>
                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <NavLink className="dropdown-item" to="/cart">
                    Koszyk
                  </NavLink>
                  <NavLink className="dropdown-item" to="/profile">
                    Dane
                  </NavLink>
                  <div className="dropdown-divider"></div>
                  <span
                    className="dropdown-item"
                    onClick={() => navigate("/logout")}
                  >
                    Wyloguj
                  </span>
                </div>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link custom-nav-link" to="/login">
                    <FaUser /> Logowanie
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link custom-nav-link" to="/register">
                    <FaUser /> Rejestracja
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
