import { Flex, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import Container, { ContainerVariant } from "../Container";
import NavBar from "../NavBar";

const smVariant = { smallLogo: true };
const mdVariant = { smallLogo: false };

interface LayoutProps {
  variant?: ContainerVariant;
}

// Layout for every page that doesnt need a sidebar
const Layout: React.FC<LayoutProps> = ({ children, variant }) => {
  const variants: any = useBreakpointValue({ base: smVariant, md: mdVariant });
  return (
    <>
      <NavBar smallLogo={variants?.smallLogo} />
      <Container variant={variant}>
        <Flex w={"full"} maxW={800}>
          {children}
        </Flex>
      </Container>
    </>
  );
};

export default Layout;
