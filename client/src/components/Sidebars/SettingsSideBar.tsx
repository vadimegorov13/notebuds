import { Box, Button, Link, VStack } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import DrawerForSidebar from "./DrawerForSidebar";

interface Props {
  onClose: Function;
  isOpen: boolean;
  variant: "drawer" | "sidebar";
}

// Sidebar with drawer function
const SettingsSidebar = ({ isOpen, variant, onClose }: Props) => {
  const router = useRouter();

  let pathname = router.pathname;

  const body = (
    <>
      <VStack borderRadius="lg">
        <Link
          href="/settings/profile"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href="/settings/profile">
            <Button
              w="full"
              isActive={pathname === "/settings/profile"}
              backgroundColor="#6D9886"
              _hover={{
                background: "#212121",
                color: "#6D9886",
              }}
              _active={{
                background: "#212121",
                color: "#6D9886",
              }}
            >
              Profile
            </Button>
          </NextLink>
        </Link>

        <Link
          href="/settings/account"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href="/settings/account">
            <Button
              w="full"
              isActive={pathname === "/settings/account"}
              backgroundColor="#6D9886"
              _hover={{
                background: "#212121",
                color: "#6D9886",
              }}
              _active={{
                background: "#212121",
                color: "#6D9886",
              }}
            >
              Account
            </Button>
          </NextLink>
        </Link>

        <Link
          href="/settings/blocked-users"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href="/settings/blocked-users">
            <Button
              w="full"
              isActive={pathname === "/settings/blocked-users"}
              backgroundColor="#6D9886"
              _hover={{
                background: "#212121",
                color: "#6D9886",
              }}
              _active={{
                background: "#212121",
                color: "#6D9886",
              }}
            >
              Blocked Users
            </Button>
          </NextLink>
        </Link>
      </VStack>
    </>
  );

  return variant === "sidebar" ? (
    <Box left={0} mr={8} w="300px" maxW="300px" top={0} h="100%">
      {body}
    </Box>
  ) : (
    <DrawerForSidebar isOpen={isOpen} onClose={onClose} body={body} />
  );
};

export default SettingsSidebar;
