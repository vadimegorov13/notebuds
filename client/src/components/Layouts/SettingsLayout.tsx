import {
  Box, Flex,
  Heading,
  useBreakpointValue
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useMeQuery } from "../../generated/graphql";
import { isAuth } from "../../utils/isAuth";
import { isServerSide } from "../../utils/isServerSide";
import Container, { ContainerVariant } from "../Container";
import NavBar from "../NavBar";
import SettingsSidebar from "../Sidebars/SettingsSideBar";

const smVariant = { navigation: "drawer", sidebar: false };
const mdVariant = { navigation: "sidebar", sidebar: true };

interface LayoutProps {
  variant?: ContainerVariant;
}

const SettingsLayout: React.FC<LayoutProps> = ({ children, variant }) => {
  isAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const variants: any = useBreakpointValue({ base: smVariant, md: mdVariant });

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const [{ data, fetching }] = useMeQuery({
    pause: isServerSide(),
  });
  let body = null;

  if (fetching) {
  } else if (data?.me) {
    body = (
      <Container variant={variant}>
        <Flex w={"full"} maxW={1000} m={8}>
          <SettingsSidebar
            variant={variants?.navigation}
            isOpen={isSidebarOpen}
            onClose={toggleSidebar}
          />
          <Box w={"full"}>
            {children}
          </Box>
        </Flex>
      </Container>
    );
  }

  return (
    <>
      <NavBar
        showSidebarButton={!variants?.sidebar}
        onShowSidebar={toggleSidebar}
      />

      <Heading left={0} mt={8} as="h3" size="xl" textAlign={"center"}>
        Settings for {data?.me?.username}
      </Heading>
      <Box w={"full"}>{body}</Box>
    </>
  );
};

export default SettingsLayout;
