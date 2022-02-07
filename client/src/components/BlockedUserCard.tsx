import { Avatar, Box, Flex, Icon, Link, Stack } from "@chakra-ui/react";
import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { UserParametersFragment } from "../generated/graphql";
import BlockButton from "./BlockButton";
import NextLink from "next/link";

interface BlockedUserCardProps {
  u: UserParametersFragment;
}

const BlockedUserCard = ({ u }: BlockedUserCardProps) => {
  let body = (
    <Box display="flex">
      <Avatar size="md" src={u.avatarURL} />
      <Stack ml={2}>
        <Box color="#212121" fontWeight="bold">
          {u.username}
        </Box>
        <Flex
          color="gray.500"
          fontWeight="semibold"
          fontSize="xs"
          textTransform="uppercase"
          allign="center"
        >
          <Flex>
            <Icon as={FaUserAlt} w={4} h={4} color={"#6D9886"} />
            <Box ml={1}>{u.followingPoints}</Box>
            {u.followingPoints % 10 === 1 ? (
              <Box ml={1}>Following</Box>
            ) : (
              <Box ml={1}>Following</Box>
            )}
          </Flex>
          <Flex ml={2}>
            <Icon as={FaUserAlt} w={4} h={4} color={"#6D9886"} />
            <Box ml={1}>{u.followPoints}</Box>
            {u.followPoints % 10 === 1 ? (
              <Box ml={1}>Follower</Box>
            ) : (
              <Box ml={1}>Followers</Box>
            )}
          </Flex>
        </Flex>
      </Stack>
    </Box>
  );

  return (
    <Flex>
      <Box
        w="full"
        p={8}
        shadow="lg"
        border="1px"
        borderColor="#6D9886"
        borderRadius="lg"
      >
        {u.blockPointStatus === 1 ? (
          <>
            <Link w="full" _hover={{ outline: false }}>
              {body}
            </Link>
          </>
        ) : (
          <>
            <Link
              href={`/user/${u.username}`}
              w="full"
              _hover={{ outline: false }}
            >
              <NextLink href={`/user/${u.username}`}>{body}</NextLink>
            </Link>
          </>
        )}
        <BlockButton blockUser={u} />
      </Box>
    </Flex>
  );
};

export default BlockedUserCard;
