import React, { useState, FormEvent } from "react";
import { ContactFormData } from "./types";
import {
  Input,
  Textarea,
  Button,
  VStack,
  FormControl,
  FormLabel,
  Box,
  useToast,
  Center,
  Heading,
  Fade,
} from "@chakra-ui/react";

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    toast({
      title: "Form Submitted",
      description: "We've received your message!",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    // Handle form submission (e.g., send data to an API)
  };

  return (
    <Box w="100vw" h="100vh">
      <Center h="100vh">
        <Box
          width={{ base: "90%", md: "75%" }}
          bg="white"
          p={5}
          borderRadius="md"
          boxShadow="sm"
        >
          <Heading as="h2" size="xl" textAlign="center" mb={6}>
            Contact Us
          </Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <Fade in={true} delay={0.4}>
                <FormControl isRequired>
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <Input
                    id="name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </FormControl>
              </Fade>
              <Fade in={true} delay={0.5}>
                <FormControl isRequired>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </FormControl>
              </Fade>
              <Fade in={true} delay={0.6}>
                <FormControl isRequired>
                  <FormLabel htmlFor="message">Message</FormLabel>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </FormControl>
              </Fade>
              <Fade in={true} delay={0.7}>
                <Button type="submit" colorScheme="blue" size="md">
                  Submit
                </Button>
              </Fade>
            </VStack>
          </form>
        </Box>
      </Center>
    </Box>
  );
};
export default ContactForm;
