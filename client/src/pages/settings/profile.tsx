import { Box, Button, Heading } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../../components/InputField";
import SettingsLayout from "../../components/Layouts/SettingsLayout";
import { useMeQuery, useUpdateProfileMutation } from "../../generated/graphql";
import { isAuth } from "../../utils/isAuth";
import { isServerSide } from "../../utils/isServerSide";
import { mapErrors } from "../../utils/mapErrors";
import { client } from "../../utils/urqlClient";

const ProfileSettings: React.FC<{}> = ({}) => {
  isAuth();
  
  const router = useRouter();

  const [{ data, fetching }] = useMeQuery({
    pause: isServerSide(),
  });

  const [, updateProfile] = useUpdateProfileMutation();

  let body: any = null;

  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = <Box></Box>;
  } else {
    body = (
      <Formik
        initialValues={{
          // name: data?.me?.name
          // email: data?.me?.email,
          // newEmail: "",
          // confirmNewEmail: "",
          // username: data?.me?.username,
          bio: data?.me?.bio,
          work: data?.me?.work,
          education: data?.me?.education,
          color: "#" + data?.me?.color,
        }}
        onSubmit={async (values, { setErrors }) => {
          const res = await updateProfile({ input: values as any });
          if (res.data?.updateProfile.errors) {
            setErrors(mapErrors(res.data.updateProfile.errors));
          } else if (res.data?.updateProfile.user) {
            if (typeof router.query.next === "string") {
              router.push(router.query.next);
            } else {
              router.push(`/settings/profile`);
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            {/* <Box
              w={"full"}
              p={8}
              border="1px"
              borderColor="#6D9886"
              borderRadius="lg"
            >
              <Heading as="h3" size="lg" mb={2}>
                User
              </Heading>
              <Box>
                <InputField name="name" placeholder="name" label="Name" />
              </Box>
              <Box>
                <InputField
                  name="email"
                  placeholder="email"
                  label="Email"
                  type="email"
                />
              </Box>
              <Box>
                <InputField
                  name="username"
                  placeholder="username"
                  label="Username"
                />
              </Box>
            </Box> */}
            <Box
              w={"full"}
              maxW={800}
              p={8}
              border="1px"
              borderColor="#6D9886"
              borderRadius="lg"
            >
              <Heading as="h3" size="lg" mb={2}>
                Background
              </Heading>
              <Box>
                <InputField name="bio" placeholder="bio" label="Bio" />
              </Box>
              <Box>
                <InputField name="work" placeholder="work" label="Work" />
              </Box>
              <Box>
                <InputField
                  name="education"
                  placeholder="education"
                  label="Education"
                />
              </Box>
            </Box>

            <Box
              w={"full"}
              maxW={800}
              mt={8}
              p={8}
              border="1px"
              borderColor="#6D9886"
              borderRadius="lg"
            >
              <Heading as="h3" size="lg" mb={2}>
                Other
              </Heading>
              <Box>
                <InputField name="color" placeholder="color" label="Color" />
              </Box>
            </Box>
            <Button
              w={"full"}
              maxW={800}
              mt={8}
              size="lg"
              type="submit"
              isLoading={isSubmitting}
              backgroundColor="#6D9886"
              _hover={{
                background: "#212121",
                color: "#6D9886",
              }}
            >
              Save
            </Button>
          </Form>
        )}
      </Formik>
    );
  }

  return <SettingsLayout>{body}</SettingsLayout>;
};

export default withUrqlClient(client)(ProfileSettings);
