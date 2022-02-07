import { Box, Button, Center, Heading, Text } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layouts/Layout";
import {
  NoteContent,
  NoteSwitch,
  NoteTags,
  NoteTitle,
} from "../components/NoteInput";
import { useCreateNoteMutation } from "../generated/graphql";
import { isAuth } from "../utils/isAuth";
import { mapErrors } from "../utils/mapErrors";
import { client } from "../utils/urqlClient";

const createNote: React.FC<{}> = ({}) => {
  const router = useRouter();
  isAuth();

  const [, createNote] = useCreateNoteMutation();

  return (
    <Layout>
      <Box m={8} w="full" maxW={800}>
        <Heading as="h2" mb={8} size="3xl" textAlign={"center"}>
          Create your Note
        </Heading>
        <Formik
          initialValues={{ title: "", text: "", isPrivate: false, tags: "" }}
          onSubmit={async (values, { setErrors }) => {
            const res = await createNote({ input: values });
            if (res.data?.createNote.errors) {
              setErrors(mapErrors(res.data.createNote.errors));
            } else if (res.data?.createNote.note) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                router.push(`/note/${res.data?.createNote.note._id}`);
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
                Create Note
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(client)(createNote);
