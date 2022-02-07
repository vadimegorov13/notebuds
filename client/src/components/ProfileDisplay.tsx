import {
  Avatar,
  Box,
  Center,
  Divider,
  Flex,
  Grid,
  Heading,
  Stack,
} from "@chakra-ui/react";
import React from "react";
import { UserParametersFragment } from "../generated/graphql";
import BlockButton from "./BlockButton";
import FollowButton from "./FollowButton";
import GetUsersNotes from "./GetUsersNotes";

interface ProfileDisplayProps {
  u: UserParametersFragment;
}

const ProfileDisplay = ({ u }: ProfileDisplayProps) => {
  let body = null;
  let outerBody = null;

  if (u?.blockPointStatus === 1) {
    body = (
      <Box mt={6}>
        <BlockButton blockUser={u} />
      </Box>
    );
  } else if (u) {
    body = (
      <Box>
        <Flex
          align="center"
          color="gray.500"
          fontWeight="semibold"
          fontSize="xs"
          textTransform="uppercase"
          m={2}
        >
          <Box mr={4}>Work: {u.work}</Box>
          <Box mr={4}>
            {"Education: "}
            {u.education}
          </Box>
        </Flex>

        <FollowButton followuser={u} />
        <Box mt={2} w={"full"}>
          <BlockButton blockUser={u} />
        </Box>
      </Box>
    );

    outerBody = (
      <>
        <Center>
          <Heading my={4} as="h2" size="xl" color="#212121" fontWeight="bold">
            {u.username}'s Notes
          </Heading>
        </Center>
        <GetUsersNotes uId={u!._id!} />
      </>
    );
  }

  return (
    <Box w="full" maxW={800} m={4}>
      <Box
        w="full"
        maxW={800}
        p={8}
        shadow="lg"
        border="1px"
        borderColor="#6D9886"
        borderRadius="lg"
        align="center"
      >
        <Box>
          <Avatar size="xl" src={u?.avatarURL} />
          <Stack>
            <Heading my={4} as="h2" size="xl" color="#212121" fontWeight="bold">
              {u?.username}
            </Heading>

            <Box w={"full"}>
              <Center>
                <Grid templateColumns="repeat(2, 1fr)" gap={1}>
                  <Flex mx={4} fontWeight="semibold">
                    {u?.followPoints}
                    {u?.followPoints % 10 === 1 ? (
                      <Box ml={1}>Follower</Box>
                    ) : (
                      <Box ml={1}>Followers</Box>
                    )}
                  </Flex>
                  <Flex mx={4} fontWeight="semibold">
                    {u?.followingPoints}
                    {" Following"}
                  </Flex>
                </Grid>
              </Center>
            </Box>

            {u.bio ? (
              <Box
                color="#212121"
                fontWeight="semibold"
                textTransform="none"
                fontSize="sm"
                mb={4}
              >
                {u.bio}
              </Box>
            ) : null}

            <Box
              color="gray.500"
              fontWeight="semibold"
              fontSize="xs"
              textTransform="uppercase"
            >
              Joined on{" "}
              {new Date(parseInt(u.createdAt)).toLocaleDateString("en-US", {
                weekday: undefined,
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Box>
          </Stack>
        </Box>

        <Divider p={1} mb={2} />

        {body}
      </Box>
      {outerBody}
    </Box>
  );
};

export default ProfileDisplay;
