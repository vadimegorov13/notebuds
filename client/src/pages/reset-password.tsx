import { Box, Center, Heading, Link, Text } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layouts/Layout";
import { useForgotPasswordMutation } from "../generated/graphql";
import { client } from "../utils/urqlClient";
import NextLink from "next/link";

const ResetPassword = ({}) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [, forgotPassword] = useForgotPasswordMutation();

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
          Change Password
        </Heading>
        <Text mt={2}>
          Tell us an email address associated with your NoteBuds account, and
          we’ll send you an email with a link to reset your password.
        </Text>
        <Formik
          initialValues={{
            email: "",
          }}
          onSubmit={async (values) => {
            console.log(values);
            const res = await forgotPassword(values);
            console.log(res);
            setIsSubmitted(true);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box>
                <InputField name="email" placeholder="email" type="text" />
              </Box>

              <Button
                size="lg"
                w={"full"}
                maxW={800}
                mt={8}
                type="submit"
                isLoading={isSubmitting}
                backgroundColor="#6D9886"
                _hover={{
                  background: "#212121",
                  color: "#6D9886",
                }}
              >
                Reset Password
              </Button>
            </Form>
          )}
        </Formik>

        {isSubmitted ? (
          <Text mt={4} color={"#6D9886"}>
            Thanks! If your NoteBuds email address match, you'll get an email
            with a link to reset your password shortly.
          </Text>
        ) : null}

        <Box mt={8} textAlign={"center"}>
          Don't have an email or need assistance logging in?{" "}
          <Link
            color="#6D9886"
            href={`/help`}
            _hover={{
              outline: false,
            }}
          >
            <NextLink href={`/help`}>Get Help</NextLink>
          </Link>
        </Box>

        <Box mt={8} w="full">
          <Center>
            <Box mr={2}>
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
            <Box>{" | "} </Box>
            <Box ml={2}>
              <Link
                color="#6D9886"
                href={`/register`}
                _hover={{
                  outline: false,
                }}
              >
                <NextLink href={`/register`}>Register</NextLink>
              </Link>
            </Box>
          </Center>
        </Box>
      </Box>
    </Layout>
  );
};

export default withUrqlClient(client)(ResetPassword);
