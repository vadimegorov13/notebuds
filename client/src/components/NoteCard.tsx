import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { NoteParametersFragment } from "../generated/graphql";
import { NoteEditDeleteSaveButtons } from "./NoteButtons";
import NoteExtras from "./NoteExtras";
import NextLink from "next/link";

interface NoteCardProps {
  n: NoteParametersFragment;
}

const NoteCard = ({ n }: NoteCardProps) => {
  let tags = n.tags.split(" ");

  return (
    <Flex>
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
            <Link
              href={`/user/${n.author?.username}`}
              bg="transparent"
              _hover={{
                color: "#6D9886",
                outline: false,
              }}
              color="#212121"
              fontWeight="bold"
              textTransform="uppercase"
            >
              <NextLink href={`/user/${n.author?.username}`}>
                {n.author?.username}
              </NextLink>
            </Link>
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
          <Box ml={"auto"}>
            <NoteEditDeleteSaveButtons note={n} authorId={n.author?._id} />
          </Box>
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

        <Text my={2} fontSize="xl" whiteSpace={"pre-line"} noOfLines={6}>
          {n.textSnippet}
        </Text>
        <NoteExtras n={n} />
      </Box>
    </Flex>
  );
};

export default NoteCard;
