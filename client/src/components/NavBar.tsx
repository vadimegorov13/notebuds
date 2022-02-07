import { ChevronRightIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  Heading,
  IconButton,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServerSide } from "../utils/isServerSide";
import SearchBar from "./SearchBar";
import NextLink from "next/link";

interface NavBarProps {
  onShowSidebar?: Function | any;
  showSidebarButton?: boolean;
  smallLogo?: boolean;
}

// Sidebar with drawer function
const NavBar = ({
  showSidebarButton = true,
  onShowSidebar,
  smallLogo = false,
}: NavBarProps) => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery({
    pause: isServerSide(),
  });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <Flex align="center">
        <Link
          href="/login"
          _hover={{
            outline: false,
          }}
        >
          <NextLink href="/login">
            <Button mr={2}>Log in</Button>
          </NextLink>
        </Link>

        <Link
          href="/register"
          _hover={{
            outline: false,
          }}
        >
          <NextLink href="/register">
            <Button>Create account</Button>
          </NextLink>
        </Link>
      </Flex>
    );
    // user is logged in
  } else {
    body = (
      <Flex align="center">
        <Box mr={2}>
          <Link
            href="/create-note"
            _hover={{
              outline: false,
            }}
          >
            <NextLink href="/create-note">
              <Button
                color="#212121"
                bg="blue.200"
                _hover={{
                  color: "blue.200",
                  backgroundColor: "#212121",
                }}
              >
                New Note
              </Button>
            </NextLink>
          </Link>
        </Box>
        <Menu>
          <MenuButton>
            <Avatar src={data?.me?.avatarURL} />
          </MenuButton>
          <MenuList>
            <Link
              style={{ textDecoration: "none" }}
              href={`/user/${data.me.username}`}
              _hover={{
                outline: false,
              }}
            >
              <NextLink href={`/user/${data.me.username}`}>
                <MenuItem color="white">Profile</MenuItem>
              </NextLink>
            </Link>

            <Link
              href="/myNotes"
              _hover={{
                outline: false,
              }}
            >
              <NextLink href="/myNotes">
                <MenuItem color="white">My Notes</MenuItem>
              </NextLink>
            </Link>

            <Link
              href="/following"
              _hover={{
                outline: false,
              }}
            >
              <NextLink href="/following">
                <MenuItem color="white">Followed</MenuItem>
              </NextLink>
            </Link>

            <Link
              href="/settings/profile"
              _hover={{
                outline: false,
              }}
            >
              <NextLink href="/settings/profile">
                <MenuItem color="white">Settings</MenuItem>
              </NextLink>
            </Link>

            <Link
              onClick={async () => {
                await logout();
                router.push("/");
              }}
              isLoading={logoutFetching}
              bg="transparent"
              color="white"
              _hover={{
                outline: false,
              }}
            >
              <MenuItem>Sign Out</MenuItem>
            </Link>
          </MenuList>
        </Menu>
      </Flex>
    );
  }

  return (
    <Flex
      position="sticky"
      zIndex={1}
      top={0}
      bgColor="#6D9886"
      p={2}
      w={"full"}
      spacing="30px"
    >
      <Flex flex={1} align="center">
        <>
          {showSidebarButton && onShowSidebar ? (
            <Flex p={2}>
              <Center>
                <IconButton
                  aria-label="Show sidebar"
                  icon={<ChevronRightIcon w={8} h={8} color="#6D9886" />}
                  bg="#212121"
                  variant="outline"
                  onClick={onShowSidebar}
                />
              </Center>
            </Flex>
          ) : (
            <Link
              href="/"
              _hover={{
                outline: false,
              }}
            >
              <NextLink href="/">
                {smallLogo ? (
                  <Heading as="h3" size="xl">
                    NB
                  </Heading>
                ) : (
                  <Heading as="h3" size="xl">
                    NoteBuds
                  </Heading>
                )}
              </NextLink>
            </Link>
          )}
        </>

        <Box size="md" align="center">
          <SearchBar />
        </Box>
        <Box ml={"auto"}>{body}</Box>
      </Flex>
    </Flex>
  );
};

export default NavBar;
