import React, { useState } from "react";
import { Box, Image, Text, Badge, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

export interface Product {
  id: number;
  name: string;
  price: number;
  type: string;
  is_on_sale?: boolean; // Dodany atrybut
}

interface ProductCardProps {
  product: Product;
  inPromotionSection?: boolean;
}

const MotionBox = motion(Box);
const ProductCard: React.FC<ProductCardProps> = ({
  product,
  inPromotionSection,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setQuantity(1); // Reset the quantity when the modal is closed
  };

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://computexapi-55f3a80f11dd.herokuapp.com/cart/",
        {
          product_name: product.name, // Assuming product.name contains the product's name
          product_price: product.price, // Assuming product.price contains the product's price
          quantity: quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      handleCloseModal();
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  };

  const getImageForProduct = (type: string) => {
    switch (type) {
      case "laptop":
        return "laptop.png";
      case "graphicscard":
        return "graphicscard.png";
      case "monitor":
        return "monitor.png";
      case "processor":
        return "processor.png";
      default:
        return "default.png";
    }
  };

  // Obniżka cenowa
  const discountPercentage = inPromotionSection
    ? Math.floor(Math.random() * 30) + 10
    : 0;
  const discountedPrice = product.price * (1 - discountPercentage / 100);

  return (
    <MotionBox
      className="productCard"
      boxShadow="xl"
      p="6"
      rounded="lg"
      bg="white"
      w="250px"
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, boxShadow: "2xl" }}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Image
        src={`/../../../src/assets/main/cards/${getImageForProduct(
          product.type
        )}`}
        alt={product.name}
        mb="4"
        borderRadius="md"
        h="150px"
        objectFit="cover"
      />
      <VStack align="start" spacing={2}>
        <Text fontSize="xl" fontWeight="bold">
          {product.name}
        </Text>
        {inPromotionSection && (
          <Badge colorScheme="red">{discountPercentage}% OFF</Badge>
        )}
        <Text
          fontSize="lg"
          color={inPromotionSection ? "gray.500" : "black"}
          textDecoration={inPromotionSection ? "line-through" : "none"}
        >
          ${Number(product.price).toFixed(2)}
        </Text>
        {inPromotionSection && (
          <Text fontSize="lg" fontWeight="bold" color="red.500">
            ${Number(discountedPrice).toFixed(2)}
          </Text>
        )}
      </VStack>
      <Button onClick={handleOpenModal}>Add to Cart</Button>

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add {product.name} to Cart</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <NumberInput
              value={quantity}
              onChange={(value) => setQuantity(Number(value))}
              min={1}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddToCart}>
              Add
            </Button>
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </MotionBox>
  );
};

export default ProductCard;
