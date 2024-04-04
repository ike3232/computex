// App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/mainPage/sections/Navbar";
import "./App.css";
import WelcomeBanner from "./components/mainPage/sections/WelcomeBanner";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Divider from "./components/mainPage/ui/Divider";
import ProductsSection from "./components/mainPage/sections/ProductSection";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Logout from "./components/auth/Logout";
import CartPage from "./components/cart/Cart";
import Offer from "./components/offerPage/Offer";
import Footer from "./components/addons/Footer";
import ComputerBuilderPage from "./pcMaker/pcMaker";
import ContactForm from "./components/ContactForm/ContactForm";

const App: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
  });
  const controls = useAnimation();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <>
      <div className="App">
        <Router>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/offer" element={<Offer />} />
            <Route path="/build-computer" element={<ComputerBuilderPage />} />
            <Route path="/contact" element={<ContactForm />} />
            <Route
              path="/"
              element={
                <>
                  <WelcomeBanner />
                  <motion.div
                    ref={ref}
                    animate={controls}
                    initial="hidden"
                    variants={{
                      visible: { opacity: 1, y: 0 },
                      hidden: { opacity: 0, y: 100 },
                    }}
                    transition={{ duration: 0.8 }}
                  >
                    <Divider />
                    <ProductsSection
                      title="Promocja"
                      filterFn={(product) => product.is_on_sale}
                      inPromotion={true}
                    />
                    <Divider />
                    <ProductsSection title="Najnowsze" filterFn={() => true} />
                  </motion.div>
                </>
              }
            />
          </Routes>
        </Router>
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default App;
