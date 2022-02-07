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
const HomeSidebar = ({ isOpen, variant, onClose }: Props) => {
  const router = useRouter();

  let pathname = router.pathname;

  const body = (
    <>
      <VStack borderRadius="lg">
        <Link
          href="/"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href="/">
            <Button
              w="full"
              isActive={pathname === "/"}
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
              Home
            </Button>
          </NextLink>
        </Link>

        <Link
          href="/myNotes"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href="/myNotes">
            <Button
              w="full"
              isActive={pathname === "/myNotes"}
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
              My Notes
            </Button>
          </NextLink>
        </Link>

        <Link
          href="/savedNotes"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href="/savedNotes">
            <Button
              w="full"
              isActive={pathname === "/savedNotes"}
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
              Saved Notes
            </Button>
          </NextLink>
        </Link>

        <Link
          href="/following"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href="/following">
            <Button
              w="full"
              isActive={pathname === "/following"}
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
              Following
            </Button>
          </NextLink>
        </Link>

        <Link
          href="/followers"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href="/followers">
            <Button
              w="full"
              isActive={pathname === "/followers"}
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
              Followers
            </Button>
          </NextLink>
        </Link>

        <Link
          href="/activity"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href="/activity">
            <Button
              w="full"
              isActive={pathname === "/activity"}
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
              Activity
            </Button>
          </NextLink>
        </Link>

        <Link
          href="/about"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href="/about">
            <Button
              w="full"
              isActive={pathname === "/about"}
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
              About
            </Button>
          </NextLink>
        </Link>

        <Link
          href="/help"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href="/help">
            <Button
              w="full"
              isActive={pathname === "/help"}
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
              Help
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

export default HomeSidebar;
