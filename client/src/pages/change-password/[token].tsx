import { Box, Heading } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../../components/InputField";
import Layout from "../../components/Layouts/Layout";
import { useCreateNewPasswordMutation } from "../../generated/graphql";
import { mapErrors } from "../../utils/mapErrors";
import { client } from "../../utils/urqlClient";

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const router = useRouter();

  const [, createNewPassword] = useCreateNewPasswordMutation();

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
        <Formik
          initialValues={{
            token,
            newPassword: "",
            confirmPassword: "",
          }}
          onSubmit={async (values, { setErrors }) => {
            const res = await createNewPassword({ input: values });
            if (res.data?.createNewPassword.errors) {
              setErrors(mapErrors(res.data.createNewPassword.errors));
            } else if (res.data?.createNewPassword.user) {
              if (typeof router.query.next === "string") {
                router.push(router.query.next);
              } else {
                router.push(`/login`);
              }
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Box>
                <InputField
                  name="newPassword"
                  placeholder=""
                  label="New password"
                  type="password"
                />
              </Box>
              <Box>
                <InputField
                  name="confirmPassword"
                  placeholder=""
                  label="Confirm new password"
                  type="password"
                />
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
                Change Password
              </Button>
            </Form>
          )}
        </Formik>
      </Box>
    </Layout>
  );
};

ChangePassword.getInitialProps = ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(client)(ChangePassword);
