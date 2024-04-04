import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Divider: React.FC = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    threshold: 0.1, // uruchom animację, gdy co najmniej 10% paska jest widoczne
    triggerOnce: true, // uruchom animację tylko raz
  });

  useEffect(() => {
    if (inView) {
      controls.start({ scaleX: 1 });
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      className="divider"
      initial={{ scaleX: 0 }}
      animate={controls}
      transition={{ duration: 3.5, ease: "easeInOut" }}
    ></motion.div>
  );
};

export default Divider;
