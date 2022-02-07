import { Box, Button, Heading, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layouts/Layout";
import { useRegisterMutation } from "../generated/graphql";
import { mapErrors } from "../utils/mapErrors";
import { client } from "../utils/urqlClient";

const Register: React.FC = ({}) => {
  const [, register] = useRegisterMutation();
  const router = useRouter();

  return (
    <Layout>
      <Box
        m={8}
        p={8}
        w={800}
        border="1px"
        borderColor="#6D9886"
        borderRadius="lg"
      >
        <Heading as="h3" size="xl" textAlign={"center"}>
          Welcome to NoteBuds Community
        </Heading>
        <Formik
          initialValues={{ email: "", username: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const res = await register({ input: values });
            if (res.data?.registerUser.errors) {
              const mappedErrors = mapErrors(res.data.registerUser.errors);
              console.log(mappedErrors);
              setErrors(mappedErrors);
            } else if (res.data?.registerUser.user) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                const username = res.data?.registerUser?.user?.username;
                router.push(`/user/${username}`);
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <InputField
                name="username"
                placeholder="username"
                label="Username"
              />
              <InputField name="email" placeholder="email" label="Email" />
              <InputField
                name="password"
                placeholder="password"
                label="Password"
                type="password"
              />
              <Button
                size="lg"
                mt={8}
                w="full"
                type="submit"
                isLoading={isSubmitting}
                backgroundColor="#6D9886"
                _hover={{
                  background: "#212121",
                  color: "#6D9886",
                }}
              >
                Create Account
              </Button>
            </Form>
          )}
        </Formik>
        <Box mt={8} textAlign={"center"}>
          Already have an account?{" "}
          <Link
            color="#6D9886"
            href={`/login`}
            _hover={{
              outline: false,
            }}
          >
            <NextLink href={`/login`}>Log in</NextLink>
          </Link>
        </Box>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(client)(Register);
