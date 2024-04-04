import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { CSSTransition } from "react-transition-group";
import "./WelcomeBanner.css"; // importujemy style dla animacji

const titles = [
  {
    main: "Nowa era komputerów!",
    subtitle: "Najlepsze modele w najlepszych cenach",
    img: "../../../src/assets/main/placeholder.png", // example image path
  },
  {
    main: "Akcesoria do gier",
    subtitle: "Zanurz się w świecie wirtualnej rozrywki",
    img: "../../../src/assets/main/placeholder.png", // example image path
  },
  {
    main: "Sprzęt dla profesjonalistów",
    subtitle: "Odkryj naszą ofertę dla specjalistów IT",
    img: "../../../src/assets/main/placeholder.png", // example image path
  },
];

const WelcomeBanner = () => {
  const [currentTitle, setCurrentTitle] = useState(0);
  const [show, setShow] = useState(true); // stan dla animacji

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!show) {
      setCurrentTitle((prevState) => (prevState + 1) % titles.length);
      setShow(true);
    }
  }, [show]);

  return (
    <div className="container-fluid mt-5 welcomeBannerContainer">
      <div className="row">
        <div className="col-md-6">
          <img
            src={titles[currentTitle].img}
            alt="Computex"
            className="img-fluid"
          />
        </div>
        <div className="col-md-6 d-flex align-items-center">
          <div>
            <CSSTransition
              in={show}
              timeout={500}
              classNames="fade"
              unmountOnExit
            >
              <div>
                <h1>{titles[currentTitle].main}</h1>
                <h3>{titles[currentTitle].subtitle}</h3>
              </div>
            </CSSTransition>
            <button className="btn btn-primary mt-3">Zobacz ofertę</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
