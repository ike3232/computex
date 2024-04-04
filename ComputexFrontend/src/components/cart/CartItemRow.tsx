import {
  HStack,
  Text,
  IconButton,
  ScaleFade,
  useColorModeValue,
} from "@chakra-ui/react";
import { AddIcon, MinusIcon, DeleteIcon } from "@chakra-ui/icons";

interface CartItem {
  id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface CartItemRowProps {
  item: CartItem;
  handleIncreaseQuantity: (id: number) => void;
  handleDecreaseQuantity: (id: number) => void;
  handleRemoveItem: (id: number) => void; // Dodano nową funkcję
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  handleIncreaseQuantity,
  handleDecreaseQuantity,
  handleRemoveItem, // Dodano nową funkcję
}) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");

  return (
    <ScaleFade initialScale={0.9} in={true}>
      <HStack
        bg={bgColor}
        p={4}
        borderRadius="md"
        width="80%"
        justifyContent="space-between"
        alignItems="center"
        _hover={{ transform: "scale(1.02)" }}
      >
        <Text fontSize="lg">{item.product_name}</Text>
        <Text fontSize="lg">{item.product_price}$</Text>
        <HStack spacing={2}>
          <IconButton
            icon={<MinusIcon />}
            onClick={() => handleDecreaseQuantity(item.id)}
            isRound
            aria-label="Decrease Quantity"
          />
          <Text fontSize="lg">{item.quantity}</Text>
          <IconButton
            icon={<AddIcon />}
            onClick={() => handleIncreaseQuantity(item.id)}
            isRound
            aria-label="Increase Quantity"
          />
          <IconButton
            icon={<DeleteIcon />}
            onClick={() => handleRemoveItem(item.id)}
            isRound
            aria-label="Remove Item"
            colorScheme="red" // Dodano styl dla przycisku usuwania
          />
        </HStack>
      </HStack>
    </ScaleFade>
  );
};

export default CartItemRow;
