import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import React, { useState } from "react";
import Container, { ContainerVariant } from "../Container";
import NavBar from "../NavBar";
import HomeSidebar from "../Sidebars/HomeSidebar";

const smVariant = { navigation: "drawer", sidebar: false };
const mdVariant = { navigation: "sidebar", sidebar: true };

interface LayoutProps {
  variant?: ContainerVariant;
}

const HomePageLayout: React.FC<LayoutProps> = ({ children, variant }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const variants: any = useBreakpointValue({ base: smVariant, md: mdVariant });

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <>
      <NavBar
        showSidebarButton={!variants?.sidebar}
        onShowSidebar={toggleSidebar}
      />
      <Container variant={variant}>
        <Flex w={"full"} maxW={1000} m={8}>
          <HomeSidebar
            variant={variants?.navigation}
            isOpen={isSidebarOpen}
            onClose={toggleSidebar}
          />
          <Box w={"full"}>{children}</Box>
        </Flex>
      </Container>
    </>
  );
};

export default HomePageLayout;
