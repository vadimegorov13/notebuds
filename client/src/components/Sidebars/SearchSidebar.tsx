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

const SearchSidebar = ({ isOpen, variant, onClose }: Props) => {
  const router = useRouter();

  let pathname = router.pathname;

  const body = (
    <>
      <VStack borderRadius="lg">
        <Link
          href="/search/notes"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href={`/search/notes`}>
            <Button
              w="full"
              isActive={pathname === "/search/notes"}
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
              Notes
            </Button>
          </NextLink>
        </Link>

        <Link
          href="/search/users"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href={`/search/users`}>
            <Button
              w="full"
              isActive={pathname === "/search/users"}
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
              Users
            </Button>
          </NextLink>
        </Link>

        <Link
          href="/search/tags"
          _hover={{
            outline: false,
          }}
          w="full"
        >
          <NextLink href={`/search/tags`}>
            <Button
              w="full"
              isActive={pathname === "/search/tags"}
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
              Tags
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

export default SearchSidebar;
