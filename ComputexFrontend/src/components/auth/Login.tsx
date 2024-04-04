import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/auth";
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

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setShowForm(true), 1000);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await login(username, password);
      if (response.access) {
        localStorage.setItem("token", response.access);
        localStorage.setItem("username", response.username);
        window.location.assign("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
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
          style={{ filter: showForm ? "blur(0)" : "blur(8px)" }}
        >
          <VStack spacing={4} w="sm">
            <Box fontSize="xl" color="white">
              Login
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
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    bgColor="rgba(255, 255, 255, 0.1)"
                    color="white"
                  />
                  <Button type="submit" colorScheme="blue">
                    Login
                  </Button>
                </VStack>
              </Box>
            )}
            <Link href="/register" color="white">
              Nie masz konta? Zarejestruj się tutaj.
            </Link>
          </VStack>
        </ScaleFade>
      </Center>
    </Box>
  );
};

export default Login;
