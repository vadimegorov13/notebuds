import { Box, Center } from "@chakra-ui/react";
import React from "react";

export type ContainerVariant = "small" | "regular";

interface ContainerProps {
  variant?: ContainerVariant;
}

const Container: React.FC<ContainerProps> = ({
  children,
  variant = "regular",
}) => {
  return (
    <Box w="100%" h="100%" boxSize={variant === "regular" ? "full" : "auto"}>
      <Center>
      {children}
      </Center>
    </Box>
  );
};

export default Container;
