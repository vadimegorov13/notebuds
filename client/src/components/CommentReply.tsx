import { ChatIcon } from "@chakra-ui/icons";
import { Box, Flex, Link, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import React, { useState } from "react";
import { useCreateCommentMutation, useMeQuery } from "../generated/graphql";
import { mapErrors } from "../utils/mapErrors";
import { CommentContent } from "./NoteInput";

interface CommentReplyProps {
  noteId: number;
  parentId: number;
  username: string;
}

const CommentNote = ({ noteId, parentId, username }: CommentReplyProps) => {
  const [, createComment] = useCreateCommentMutation();
  const [{ data, fetching }] = useMeQuery();
  const [isOpen, setIsOpen] = useState(false);

  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <Flex align="center">
        <Link href="/login">
          <NextLink href="/login">
            <Button mr={2}>Log in</Button>
          </NextLink>
        </Link>

        <Link href="/register">
          <NextLink href="/register">
            <Button>Create account</Button>
          </NextLink>
        </Link>
      </Flex>
    );
    // user is logged in
  } else {
    body = (
      <Formik
        initialValues={{ text: "", noteId, parentId }}
        onSubmit={async (values, { setErrors }) => {
          const res = await createComment({ input: values });
          if (res.data?.createComment.errors) {
            setErrors(mapErrors(res.data.createComment.errors));
          } else if (res.data?.createComment.errors === null) {
            values.text = "";
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Text mb={2} size="sm">
              Comment as{" "}
              <Link href={`/user/${data.me?.username}`} color={"#6D9886"}>
                <NextLink href={`/user/${data.me?.username}`}>
                  {data.me?.username}
                </NextLink>
              </Link>
            </Text>

            <Flex>
              <Box
                border="1px"
                borderColor="#212121"
                borderRadius="lg"
                p={2}
                w={"full"}
              >
                <CommentContent
                  textarea
                  name="text"
                  placeholder={`Reply to ${username}`}
                />
              </Box>
            </Flex>
            <Button
              size="lg"
              mt={2}
              type="submit"
              isLoading={isSubmitting}
              backgroundColor="#6D9886"
              _hover={{
                background: "#212121",
                color: "#6D9886",
              }}
            >
              Comment
            </Button>
          </Form>
        )}
      </Formik>
    );
  }

  return (
    <Box w="full">
      <Link
        _hover={{ fontWeight: "semibold" }}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <ChatIcon /> Reply
      </Link>

      {isOpen ? (
        <Box w="full" mt={2}>
          {body}
        </Box>
      ) : null}
    </Box>
  );
};

export default CommentNote;
