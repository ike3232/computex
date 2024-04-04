import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  VStack,
  Text,
  Heading,
  HStack,
  IconButton,
  useToast,
  SlideFade,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Spinner,
  useDisclosure,
  Grid,
  GridItem,
  Container,
  Fade,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon } from "@chakra-ui/icons";
import { FaShoppingCart } from "react-icons/fa";
import CartItemRow from "./CartItemRow";

interface CartItem {
  id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://computexapi-55f3a80f11dd.herokuapp.com/cart/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCartItems(response.data.cart_items);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      }
    };

    fetchCartItems();
  }, []);

  const handleIncreaseQuantity = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://computexapi-55f3a80f11dd.herokuapp.com/cart/add-quantity/${id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        })
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item quantity.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDecreaseQuantity = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://computexapi-55f3a80f11dd.herokuapp.com/cart/subtract-quantity/${id}/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCartItems((prevItems) =>
        prevItems.map((item) => {
          if (item.id === id && item.quantity > 1) {
            return { ...item, quantity: item.quantity - 1 };
          }
          return item;
        })
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update item quantity.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePurchase = async () => {
    onOpen();
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://computexapi-55f3a80f11dd.herokuapp.com/cart/buy/",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setIsLoading(false);
      setCartItems([]);
      toast({
        title: "Success",
        description: "Purchase successful! Cart cleared.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: "Error",
        description: "Failed to complete the purchase.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    }
  };
  const handleRemoveItem = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://computexapi-55f3a80f11dd.herokuapp.com/cart/remove-item/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
      toast({
        title: "Item Removed",
        description: "The item has been removed from your cart.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove the item.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" mt="calc(6rem + 16px)" py={5}>
      <SlideFade in={true} offsetY="20px">
        <Heading as="h1" size="xl" mb={6} shadow="md">
          <FaShoppingCart mr={3} /> Your Cart
        </Heading>
      </SlideFade>
      {!cartItems || cartItems.length === 0 ? (
        <Text>Your cart is empty.</Text>
      ) : (
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          {cartItems.map((item) => (
            <GridItem key={item.id}>
              <CartItemRow
                item={item}
                handleIncreaseQuantity={handleIncreaseQuantity}
                handleDecreaseQuantity={handleDecreaseQuantity}
                handleRemoveItem={handleRemoveItem}
              />
            </GridItem>
          ))}
        </Grid>
      )}
      <SlideFade in={true} offsetY="-20px">
        <Button colorScheme="blue" onClick={handlePurchase} size="lg" mt={6}>
          <FaShoppingCart mr={2} />
          Purchase
        </Button>
      </SlideFade>
    </Container>
  );
};
export default CartPage;
