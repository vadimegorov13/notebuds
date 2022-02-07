import {
  Avatar,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { NoteParametersFragment } from "../generated/graphql";
import GetComments from "./GetComments";
import Layout from "./Layouts/Layout";
import { NoteEditDeleteSaveButtons } from "./NoteButtons";
import NextLink from "next/link";
import CommentNote from "./CommentNote";
import { ChatIcon, ViewIcon } from "@chakra-ui/icons";
import StickerBox from "./StickerBox";

interface NoteBodyProps {
  n: NoteParametersFragment;
}

const NoteBody = ({ n }: NoteBodyProps) => {
  let tags = n.tags.split(" ");

  return (
    <Layout>
      <Box m={4} w="full">
        <Box
          w="full"
          maxW={800}
          p={8}
          shadow="lg"
          border="1px"
          borderColor="#6D9886"
          borderRadius="lg"
        >
          <Box display="flex">
            <Avatar size="md" src={n.author?.avatarURL} />
            <Stack ml={2}>
              <Box color="#212121" fontWeight="bold" textTransform="uppercase">
                <Link
                  href={`/user/${n.author?.username}`}
                  _hover={{ outline: false }}
                >
                  <NextLink href={`/user/${n.author?.username}`}>
                    {n.author?.username}
                  </NextLink>
                </Link>
              </Box>
              <Box
                color="gray.500"
                fontWeight="semibold"
                fontSize="xs"
                textTransform="uppercase"
              >
                {new Date(parseInt(n.createdAt)).toLocaleDateString("en-US", {
                  weekday: undefined,
                  year: undefined,
                  month: "long",
                  day: "numeric",
                })}
              </Box>
            </Stack>
          </Box>

          <Link
            href={`/note/${n._id}`}
            bg="transparent"
            _hover={{
              color: "#6D9886",
              outline: false,
            }}
          >
            <NextLink href={`/note/${n._id}`}>
              <Heading my={2}>{n.title}</Heading>
            </NextLink>
          </Link>
          <Flex>
            {tags.map((t: any) =>
              !t ? null : (
                <Link
                  href={`/search/tags?q=${t}`}
                  key={t}
                  _hover={{
                    outline: false,
                  }}
                >
                  <NextLink href={`/search/tags?q=${t}`}>
                    <Button
                      size="xs"
                      p={1}
                      mr={2}
                      color="gray.500"
                      fontWeight="semibold"
                      fontSize="xs"
                      textTransform="uppercase"
                      _hover={{
                        backgroundColor: "#212121",
                        color: "#6D9886",
                        outline: false,
                      }}
                    >
                      #{t}
                    </Button>
                  </NextLink>
                </Link>
              )
            )}
          </Flex>

          <Divider p={1} />

          <Text whiteSpace={"pre-line"} my={2} fontSize="xl">
            {n.text}
          </Text>

          <Box>
            <Flex fontSize="md" align="center">
              <Box mr={4} _hover={{ fontWeight: "semibold" }}>
                <ViewIcon /> {n.viewsPoints}{" "}
                {n.viewsPoints % 10 == 1 ? <>View</> : <>Views</>}
              </Box>
              <StickerBox note={n} />
              <Box mr={4}>
                <ChatIcon /> {n.commentPoints}{" "}
                {n.commentPoints % 10 == 1 ? <>Comment</> : <>Comments</>}
              </Box>
              <Box ml={"auto"}>
                <NoteEditDeleteSaveButtons note={n} authorId={n.author?._id} />
              </Box>
            </Flex>
          </Box>
        </Box>
        <Box marginTop={4} w="full">
          <Center>
            <Heading color="#212121" fontWeight="bold">
              Comments
            </Heading>
          </Center>

          <Box mb={4}>
            <CommentNote n={n} />
          </Box>

          <Box
            w="full"
            maxW={800}
            p={8}
            shadow="lg"
            border="1px"
            borderColor="#6D9886"
            borderRadius="lg"
          >
            <GetComments n={n} />
          </Box>
        </Box>
      </Box>
    </Layout>
  );
};

export default NoteBody;
