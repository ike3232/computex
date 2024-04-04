import React, { useState, useEffect } from "react";
import {
  Box,
  Input,
  VStack,
  HStack,
  Select,
  Button,
  Grid,
  Text,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import ProductCard from "../mainPage/ui/ProductCard";
import { fetchProducts } from "../api/products";
import { Product } from "../mainPage/ui/ProductCard";
const MotionBox = motion(Box);
const Offer: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPrice, setFilterPrice] = useState<number | null>(null);

  useEffect(() => {
    const loadProducts = async () => {
      const fetchedProducts = await fetchProducts();
      setProducts(fetchedProducts);
    };

    loadProducts();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterType(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterPrice(Number(e.target.value));
  };

  const filteredProducts = products.filter((product) => {
    if (
      searchTerm &&
      !product.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (filterType !== "all" && product.type !== filterType) {
      return false;
    }
    if (filterPrice && product.price > filterPrice) {
      return false;
    }
    return true;
  });

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("black", "white");
  const primaryColor = useColorModeValue("blue.500", "blue.300");
  const gridColumns = useBreakpointValue({
    base: "repeat(1, 1fr)",
    md: "repeat(2, 1fr)",
    lg: "repeat(4, 1fr)",
  });

  return (
    <MotionBox
      mt="calc(7rem + 16px)" // Uwzględniając pasek nawigacyjny
      p={4}
      bg={bgColor}
      color={textColor}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <VStack spacing={4} align="start" mb={4}>
        <Input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by name..."
          bg="white"
          border={`1px solid ${primaryColor}`}
          _focus={{
            borderColor: primaryColor,
            boxShadow: `0 0 0 1px ${primaryColor}`,
          }}
        />
        <HStack spacing={4}>
          <Select value={filterType} onChange={handleTypeChange}>
            <option value="all">All Types</option>
            <option value="laptop">Laptop</option>
            <option value="graphicscard">Graphics Card</option>
            <option value="monitor">Monitor</option>
            <option value="processor">Processor</option>
          </Select>
          <Input
            type="number"
            placeholder="Max Price"
            onChange={handlePriceChange}
            bg="white"
            border={`1px solid ${primaryColor}`}
            _focus={{
              borderColor: primaryColor,
              boxShadow: `0 0 0 1px ${primaryColor}`,
            }}
          />
        </HStack>
      </VStack>
      <Grid templateColumns="repeat(4, 1fr)" gap={4}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <Text>No products found</Text>
        )}
      </Grid>
    </MotionBox>
  );
};

export default Offer;
