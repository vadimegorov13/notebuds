import { Box, Button, Heading, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layouts/Layout";
import { useLoginMutation } from "../generated/graphql";
import { mapErrors } from "../utils/mapErrors";
import { client } from "../utils/urqlClient";
import NextLink from "next/link";

const Login: React.FC<{}> = ({}) => {
  const router = useRouter();
  const [, login] = useLoginMutation();

  return (
    <Layout>
      <Box
        m={8}
        p={8}
        w={"full"}
        maxW={800}
        border="1px"
        borderColor="#6D9886"
        borderRadius="lg"
      >
        <Heading as="h3" size="xl" textAlign={"center"}>
          Log in
        </Heading>
        <Formik
          initialValues={{ emailOrUsername: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const res = await login({ input: values });
            if (res.data?.loginUser.errors) {
              setErrors(mapErrors(res.data.loginUser.errors));
            } else if (res.data?.loginUser.user) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                const username = res.data?.loginUser?.user?.username;
                router.push(`/user/${username}`);
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box>
                <InputField
                  name="emailOrUsername"
                  placeholder="email or username"
                  label="Email or Username"
                />
              </Box>
              <Box mt={4}>
                <InputField
                  name="password"
                  placeholder="password"
                  label="Password"
                  type="password"
                />
              </Box>
              <Button
                size="lg"
                mt={8}
                w={"full"}
                type="submit"
                isLoading={isSubmitting}
                backgroundColor="#6D9886"
                _hover={{
                  background: "#212121",
                  color: "#6D9886",
                }}
              >
                Log in
              </Button>
            </Form>
          )}
        </Formik>
        <Box mt={8} textAlign={"center"}>
          <Link href={`/reset-password`} color="#6D9886">
            <NextLink href={`/reset-password`}>I forgot my password!</NextLink>
          </Link>
        </Box>
        <Box mt={8} textAlign={"center"}>
          Don' have an account?{" "}
          <Link href={`/register`} color="#6D9886">
            <NextLink href={`/register`}>Create account</NextLink>
          </Link>
        </Box>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(client)(Login);
