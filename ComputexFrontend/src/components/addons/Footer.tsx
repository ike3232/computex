import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Link,
  Text,
  Stack,
  Spacer,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

const MyComponent: React.FC = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const response = await fetch("url");
      const receivedData = await response.json();
      setData(receivedData);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div style={{ paddingBottom: "100px" }}>
      {" "}
      {/* Dodanie paddingu na dole */}
      <h1>Data:</h1>
      {isLoading ? (
        <p>Data loading...</p>
      ) : (
        <p>Data loaded : {JSON.stringify(data)}</p>
      )}
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <Box
      bg="#242424"
      color="white"
      p={4}
      w="100%"
      position="relative" // Zmiana z 'fixed' na 'relative'
      bottom="0"
      left="0"
      overflowX="hidden"
    >
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        maxW="container.xl"
        m="0 auto"
      >
        <Text>© {new Date().getFullYear()} Sklep Komputerowy</Text>
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing={4}
          align="center"
        >
          <Link href="#">Polityka prywatności</Link>
          <Link href="#">Warunki korzystania</Link>
          <Link href="#">Wsparcie klienta</Link>
          <Spacer />
          <Icon as={FaFacebook} w={6} h={6} />
          <Icon as={FaTwitter} w={6} h={6} />
          <Icon as={FaInstagram} w={6} h={6} />
        </Stack>
      </Flex>
    </Box>
  );
};

export default Footer;
