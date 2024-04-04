import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import {
  Box,
  Center,
  Input,
  Button,
  Link,
  ScaleFade,
  VStack,
  keyframes,
} from "@chakra-ui/react";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setShowForm(true), 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await register({
        username,
        email,
        password,
        first_name: firstName,
        last_name: lastName,
        delivery_address: deliveryAddress,
        payment_details: paymentDetails,
      });
      if (response.access) {
        localStorage.setItem("token", response.access);
        // Przekierowuje i odświeża stronę główną
        window.location.assign("/");
      }
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const bgAnimation = keyframes`
    0% { background-color: black; }
    50% { background-color: #111; }
    100% { background-color: black; }
  `;

  return (
    <Box w="100vw" h="100vh" animation={`${bgAnimation} 10s infinite`}>
      <Center h="100vh">
        <ScaleFade
          initialScale={0.7}
          in={showForm}
          style={{ filter: showForm ? "blur(0)" : "blur(8px)" }} // Blur effect
        >
          <VStack spacing={4} w="sm">
            <Box fontSize="xl" color="white">
              Register
            </Box>
            {showForm && (
              <Box as="form" w="100%" onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <Input
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    bgColor="rgba(255, 255, 255, 0.1)"
                    color="white"
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    bgColor="rgba(255, 255, 255, 0.1)"
                    color="white"
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bgColor="rgba(255, 255, 255, 0.1)"
                    color="white"
                  />
                  <Input
                    placeholder="First Name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    bgColor="rgba(255, 255, 255, 0.1)"
                    color="white"
                  />
                  <Input
                    placeholder="Last Name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    bgColor="rgba(255, 255, 255, 0.1)"
                    color="white"
                  />
                  <Input
                    placeholder="Delivery Address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    bgColor="rgba(255, 255, 255, 0.1)"
                    color="white"
                  />
                  <Input
                    placeholder="Payment Details"
                    value={paymentDetails}
                    onChange={(e) => setPaymentDetails(e.target.value)}
                    bgColor="rgba(255, 255, 255, 0.1)"
                    color="white"
                  />
                  <Button type="submit" colorScheme="blue">
                    Register
                  </Button>
                </VStack>
              </Box>
            )}
            <Link href="/login" color="white">
              Already have an account? Login here.
            </Link>
          </VStack>
        </ScaleFade>
      </Center>
    </Box>
  );
};

export default Register;
