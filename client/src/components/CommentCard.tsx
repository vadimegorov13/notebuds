import {
  Avatar,
  Box,
  Divider,
  Flex,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";
import React, { useState } from "react";
import { CommentParametersFragment } from "../generated/graphql";
import CommentReply from "./CommentReply";
import GetCommentReplies from "./GetCommentReplies";

interface CommentCardProps {
  c: CommentParametersFragment;
}

const CommentCard = ({ c }: CommentCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box borderLeft={"1px"} w="full" pt={2}>
      <Box ml={4}>
        <Flex>
          <Avatar size="md" src={c.author?.avatarURL} />
          <Stack ml={2}>
            <Box color="#212121" fontWeight="bold" textTransform="uppercase">
              <Link
                href={`/user/${c.author?.username}`}
                w="full"
                _hover={{ outline: false, color: "#6D9886" }}
              >
                <NextLink href={`/user/${c.author?.username}`}>
                  {c.author?.username}
                </NextLink>
              </Link>
            </Box>

            <Box
              color="gray.500"
              fontWeight="semibold"
              fontSize="xs"
              textTransform="uppercase"
            >
              {new Date(parseInt(c.createdAt)).toLocaleDateString("en-US", {
                weekday: undefined,
                year: undefined,
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "numeric",
              })}
            </Box>
          </Stack>
        </Flex>

        <Divider />
        <Box my={4}>
          <Text whiteSpace={"pre-line"}>{c.text}</Text>
        </Box>

        <Box my={4}>
          <CommentReply
            noteId={c.noteId}
            parentId={c._id}
            username={c.author!.username}
          />
        </Box>

        {c.childrenIds != null ? (
          <>
            {isOpen ? (
              <Box mt={2} ml={4}>
                <GetCommentReplies parentId={c._id} />
              </Box>
            ) : (
              <Link
                onClick={() => {
                  setIsOpen(true);
                }}
              >
                {c.childrenIds!.length % 10 === 1 ? (
                  <Box color="blue.400">{c.childrenIds!.length} reply</Box>
                ) : (
                  <Box color="blue.400">{c.childrenIds!.length} replies</Box>
                )}
              </Link>
            )}
          </>
        ) : null}
      </Box>
    </Box>
  );
};

export default CommentCard;
