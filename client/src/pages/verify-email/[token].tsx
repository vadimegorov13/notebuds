import { Box, Heading } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import Layout from "../../components/Layouts/Layout";
import { useVerifyEmailMutation } from "../../generated/graphql";
import { client } from "../../utils/urqlClient";

const VerifyEmail: NextPage<{ token: string }> = ({ token }) => {
  const [, verifyEmail] = useVerifyEmailMutation();
  const [isEmailVerified, setIsEmailVerified] = useState(false);

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
        {isEmailVerified ? (
          <Heading as="h3" size="xl" textAlign={"center"}>
            Your email has been verified!
          </Heading>
        ) : (
          <Heading as="h3" size="xl" textAlign={"center"}>
            Verify your email
          </Heading>
        )}
        <Formik
          initialValues={{
            token,
          }}
          onSubmit={async (values) => {
            const res = await verifyEmail(values);
            if (res.data?.verifyEmail === true) {
              setIsEmailVerified(true);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
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
                Verify
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Layout>
  );
};

VerifyEmail.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(client)(VerifyEmail);
