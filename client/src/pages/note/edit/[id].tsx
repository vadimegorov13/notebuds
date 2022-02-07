import { Box, Button, Center, Heading, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../../../components/Layouts/Layout";
import {
  NoteContent,
  NoteSwitch,
  NoteTags,
  NoteTitle,
} from "../../../components/NoteInput";
import {
  useGetNoteQuery,
  useUpdateNoteMutation,
} from "../../../generated/graphql";
import { isAuth } from "../../../utils/isAuth";
import { mapErrors } from "../../../utils/mapErrors";
import { client } from "../../../utils/urqlClient";

const EditNote: NextPage<{ id: string }> = ({ id }) => {
  const router = useRouter();
  isAuth();

  const [{ data, fetching }] = useGetNoteQuery({
    variables: {
      _id: parseInt(id),
    },
  });

  const [, updateNote] = useUpdateNoteMutation();
  if (fetching) {
    return (
      <Layout>
        <div>loading...</div>
      </Layout>
    );
  }

  if (!data?.note) {
    return (
      <Layout>
        <Box>could not find post</Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box m={8} w="full" maxW={800}>
        <Heading as="h2" mb={8} size="3xl" textAlign={"center"}>
          Edit Note
        </Heading>
        <Formik
          initialValues={{
            title: data.note.title,
            text: data.note.text,
            isPrivate: data.note.isPrivate,
            tags: data.note.tags,
          }}
          onSubmit={async (values, { setErrors }) => {
            const res = await updateNote({
              _id: parseInt(id),
              input: values,
            });
            if (res.data?.updateNote.errors) {
              setErrors(mapErrors(res.data.updateNote.errors));
            } else if (res.data?.updateNote.note) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                router.back();
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box border="1px" borderColor="#212121" borderRadius="lg">
                <Box p={4}>
                  <NoteTitle name="title" placeholder="Note title..." />
                </Box>

                <Box pl={4} pr={4} pb={4}>
                  <NoteContent
                    textarea
                    name="text"
                    placeholder="Note content..."
                  />
                </Box>

                <Box mt={4} p={4}>
                  <NoteTags
                    name="tags"
                    placeholder="Add tags... (e.g. math, games, typescript)"
                  />
                </Box>
              </Box>

              <Center mt={4}>
                <Text w="350px" fontSize="xl">
                  Make your note private?
                </Text>
                <NoteSwitch name="isPrivate" />
              </Center>

              <Button
                size="lg"
                mt={4}
                type="submit"
                isLoading={isSubmitting}
                backgroundColor="#6D9886"
                _hover={{
                  background: "#212121",
                  color: "#6D9886",
                }}
              >
                Update Note
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Layout>
  );
};

EditNote.getInitialProps = ({ query }) => {
  return {
    id: query.id as string,
  };
};

export default withUrqlClient(client)(EditNote);
