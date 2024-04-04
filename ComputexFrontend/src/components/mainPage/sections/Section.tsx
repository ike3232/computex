import React, { useState } from "react";
import {
  Box,
  Heading,
  Button,
  SimpleGrid,
  useDisclosure,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

interface SectionProps {
  title: string;
  children?: React.ReactNode;
}

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);

const Section: React.FC<SectionProps> = ({ title, children }) => {
  const { isOpen, onToggle } = useDisclosure();
  const [visibleItems, setVisibleItems] = useState(6);

  const handleShowMore = () => {
    onToggle();
    if (isOpen) {
      setVisibleItems(6);
    } else {
      setVisibleItems(React.Children.count(children));
    }
  };

  const childArray = React.Children.toArray(children);

  return (
    <MotionBox
      className="sectionContainer"
      bgGradient="linear(to-r, black, gray.800, gray.700)"
      p={8}
      boxShadow="2xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MotionHeading
        className="sectionTitle"
        mb={6}
        color="white"
        fontFamily="'Orbitron', sans-serif"
        fontSize="2xl"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
      >
        {title}
      </MotionHeading>
      <SimpleGrid
        className="sectionGrid"
        columns={{ base: 1, sm: 3, md: 4 }}
        spacing={6}
      >
        {childArray.slice(0, visibleItems).map((child, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2, duration: 0.5 }}
          >
            {child}
          </motion.div>
        ))}
      </SimpleGrid>
      {/* <Button mt={6} onClick={handleShowMore} colorScheme="teal">
        {isOpen ? "Show Less" : "Show More"}
      </Button> */}
    </MotionBox>
  );
};

export default Section;
