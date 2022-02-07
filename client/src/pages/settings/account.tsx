import {
  Box,
  Button,
  FormControl,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import InputField from "../../components/InputField";
import SettingsLayout from "../../components/Layouts/SettingsLayout";
import {
  useDeleteUserMutation,
  useMeQuery,
  useUpdateEmailMutation,
  useUpdatePasswordMutation,
  useUpdateScopeMutation,
} from "../../generated/graphql";
import { isAuth } from "../../utils/isAuth";
import { mapErrors } from "../../utils/mapErrors";
import { client } from "../../utils/urqlClient";

const ProfileSettings: React.FC<{}> = ({}) => {
  isAuth();
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery();

  const [, updatePassword] = useUpdatePasswordMutation();
  const [, updateEmail] = useUpdateEmailMutation();
  const [, deleteUser] = useDeleteUserMutation();
  const [, updateScope] = useUpdateScopeMutation();
  const [scope, setScope] = React.useState("");

  let body: any = null;

  if (fetching) {
    // user not logged in
  } else if (!data?.me) {
    body = <Box></Box>;
  } else {
    body = (
      <>
        <Box
          p={8}
          w={"full"}
          border="1px"
          borderColor="#6D9886"
          borderRadius="lg"
        >
          <Formik
            initialValues={{}}
            onSubmit={async () => {
              let everyoneBool = false;
              let onlyFollowersBool = false;
              let onlyFolowersYouFollowBool = false;

              if (scope === "everyone") {
                everyoneBool = true;
              } else if (scope === "onlyFollowers") {
                onlyFollowersBool = true;
              } else if (scope === "onlyFolowersYouFollow") {
                onlyFolowersYouFollowBool = true;
              }

              const res = await updateScope({
                input: {
                  everyone: everyoneBool,
                  onlyFollowers: onlyFollowersBool,
                  onlyFolowersYouFollow: onlyFolowersYouFollowBool,
                },
              });
              console.log(res);
            }}
          >
            {({ isSubmitting }) => {
              return (
                <Form>
                  <Heading as="h3" size="lg" mb={2}>
                    Who can see your notes?
                  </Heading>
                  <FormControl>
                    <RadioGroup onChange={setScope} value={scope}>
                      <Stack direction="column" mt={1}>
                        <Radio
                          value="everyone"
                          _checked={{ backgroundColor: "#6D9886" }}
                        >
                          Everyone
                        </Radio>
                        <Radio
                          value="onlyFollowers"
                          _checked={{ backgroundColor: "#6D9886" }}
                        >
                          Only my followers
                        </Radio>
                        <Radio
                          value="onlyFolowersYouFollow"
                          _checked={{ backgroundColor: "#6D9886" }}
                        >
                          Only followers I follow
                        </Radio>
                      </Stack>
                    </RadioGroup>
                  </FormControl>

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
                    Change Scope
                  </Button>
                </Form>
              );
            }}
          </Formik>
        </Box>

        {/* Updated Email */}
        <Box
          p={8}
          mt={8}
          w={"full"}
          maxW={800}
          border="1px"
          borderColor="#6D9886"
          borderRadius="lg"
        >
          <Formik
            initialValues={{
              email: data?.me?.email,
              newEmail: "",
              confirmNewEmail: "",
            }}
            onSubmit={async (values, { setErrors }) => {
              const res = await updateEmail({ input: values });
              if (res.data?.updateEmail.errors) {
                setErrors(mapErrors(res.data.updateEmail.errors));
              } else if (res.data?.updateEmail.user) {
                if (typeof router.query.next === "string") {
                  router.push(router.query.next);
                } else {
                  router.push(`/settings/account`);
                }
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Heading as="h3" size="lg" mb={2}>
                  Change email
                </Heading>
                <Box>
                  <InputField
                    name="email"
                    placeholder=""
                    label="Current email"
                    type="text"
                  />
                </Box>
                <Box>
                  <InputField
                    name="newEmail"
                    placeholder=""
                    label="Email"
                    type="text"
                  />
                </Box>
                <Box>
                  <InputField
                    name="confirmNewEmail"
                    placeholder=""
                    label="Confirm new email"
                    type="text"
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

        <Box
          p={8}
          mt={8}
          w={"full"}
          maxW={800}
          border="1px"
          borderColor="#6D9886"
          borderRadius="lg"
        >
          <Formik
            initialValues={{
              password: "",
              newPassword: "",
              confirmPassword: "",
            }}
            onSubmit={async (values, { setErrors }) => {
              const res = await updatePassword({ input: values });
              if (res.data?.updatePassword.errors) {
                setErrors(mapErrors(res.data.updatePassword.errors));
              } else if (res.data?.updatePassword.user) {
                if (typeof router.query.next === "string") {
                  router.push(router.query.next);
                } else {
                  router.push(`/settings/account`);
                }
              }
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <Heading as="h3" size="lg" mb={2}>
                  Change password
                </Heading>
                <Box>
                  <InputField
                    name="password"
                    placeholder=""
                    label="Current password"
                    type="password"
                  />
                </Box>
                <Box>
                  <InputField
                    name="newPassword"
                    placeholder=""
                    label="Password"
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

        <Box
          p={8}
          mt={8}
          w={"full"}
          maxW={800}
          border="1px"
          borderColor="#6D9886"
          borderRadius="lg"
        >
          <Heading as="h3" size="lg" mb={2} color="red.500">
            Delete Account
          </Heading>
          <Text mb={2}>Deleting your account will:</Text>
          <Text>
            Delete your profile, along with your authentication associations.
          </Text>
          <Text>
            Delete any and all content you have, such as notes, comments, and
            your saved notes.
          </Text>
          <Text>Allow your username to become available to anyone.</Text>

          <Button
            size="lg"
            mt={8}
            w={"full"}
            maxW={800}
            type="submit"
            backgroundColor="red.500"
            color="#212121"
            _hover={{
              background: "#212121",
              color: "red.500",
            }}
            onClick={() => {
              deleteUser();
              router.push(`/`);
            }}
          >
            Delete Account
          </Button>
        </Box>
      </>
    );
  }

  return <SettingsLayout>{body}</SettingsLayout>;
};

export default withUrqlClient(client)(ProfileSettings);
