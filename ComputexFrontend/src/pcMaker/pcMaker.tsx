import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  Heading,
  Text,
  Image,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import axios from "axios";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};
const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("https://computexapi-55f3a80f11dd.herokuapp.com/products/");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("There was an error fetching the products:", error);
    throw error;
  }
};

const ProductSelector: React.FC<{
  products: Product[];
  onSelect: (product: Product) => void;
}> = ({ products, onSelect }) => {
  return (
    <Stack direction="row" wrap="wrap" spacing={4}>
      {products.map((product) => (
        <Button key={product.id} onClick={() => onSelect(product)}>
          {product.name} - ${product.price}
        </Button>
      ))}
    </Stack>
  );
};

const ComputerPreview: React.FC<{ selectedProducts: Product[] }> = ({
  selectedProducts,
}) => {
  // Ensure all prices are numbers and accumulate total price.
  const totalPrice = selectedProducts.reduce((acc, product) => {
    // Parse the price to a number if it's not already, or default to 0 if undefined or null
    const price =
      typeof product.price === "number"
        ? product.price
        : parseFloat(product.price) || 0;
    return acc + price;
  }, 0);

  // Calculate rating based on the number of selected products.
  const rating = Math.min(10, selectedProducts.length * 2);

  // Use toFixed to display the price as a string with two decimal places.
  const formattedTotalPrice = totalPrice.toFixed(2);

  return (
    <Box p={5} shadow="md" borderWidth="1px">
      <Heading mb={4}>Your Computer</Heading>
      <List spacing={3}>
        {selectedProducts.map(
          (
            product // Here 'product' is defined in the scope of map function
          ) => (
            <ListItem key={product.id}>
              {product.name} - ${product.price}
            </ListItem>
          )
        )}
      </List>
      <Text mt={4}>Total Price: ${formattedTotalPrice}</Text>
      <Text>Rating: {rating}/10</Text>
    </Box>
  );
};

const RecommendedProducts: React.FC<{
  onSelect: (product: Product) => void;
  products: Product[];
}> = ({ onSelect, products }) => {
  const recommendedProducts = products.slice(0, 3);

  return (
    <Box mt={5}>
      <Heading mb={4}>Recommended for you</Heading>
      <Stack direction="row" wrap="wrap" spacing={4}>
        {recommendedProducts.map((product) => (
          <Box
            as={motion.div}
            key={product.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(product)}
            p={5}
            shadow="md"
            borderWidth="1px"
            rounded="md"
            cursor="pointer"
          >
            <Text>{product.name}</Text>
            <Image
              src={product.image || "https://via.placeholder.com/50"}
              alt={product.name}
              boxSize="50px"
            />
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

const ComputerBuilderPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  useEffect(() => {
    let mounted = true;
    fetchProducts()
      .then((items) => {
        if (mounted) {
          setProducts(items);
        }
      })
      .catch(console.error);

    return () => {
      mounted = false;
    };
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProducts((prevSelectedProducts) => [
      ...prevSelectedProducts,
      product,
    ]);
  };
  const handleAddToCart = async (product: Product) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://127.0.0.1:8000/cart/",
        {
          product_name: product.name,
          product_price: product.price,
          quantity: 1, // Możesz ustawić domyślną ilość lub dodać funkcjonalność do zmiany ilości
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // Możesz dodać tutaj powiadomienie o sukcesie
    } catch (error) {
      console.error("Error adding product to cart:", error);
      // Możesz dodać tutaj powiadomienie o błędzie
    }
  };
  return (
    <Box p={5}>
      <Heading mb={6}>Build your computer</Heading>
      <ProductSelector products={products} onSelect={handleSelectProduct} />
      <ComputerPreview selectedProducts={selectedProducts} />
      <Button
        colorScheme="blue"
        onClick={() =>
          selectedProducts.forEach((product) => handleAddToCart(product))
        }
      >
        Add to Cart
      </Button>
      <RecommendedProducts onSelect={handleSelectProduct} products={products} />
    </Box>
  );
};

export default ComputerBuilderPage;
