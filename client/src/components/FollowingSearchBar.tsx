import { SearchIcon } from "@chakra-ui/icons";
import { Flex, IconButton } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React from "react";
import { SearchInput } from "./NoteInput";

const FollowingSearchBar = () => {
    const router = useRouter();
    let pathname = "/following";
  
    if (router.pathname.includes("following")) {
      pathname = router.pathname;
    }
  
    return (
      <Flex mx={4} align="center">
        <Formik
          initialValues={{
            search: " ",
          }}
          onSubmit={async (values) => {
            await router.push({
              pathname: pathname,
              query: { q: values.search },
            });
          }}
        >
          {() => (
            <Form>
              <Flex>
                <SearchInput name="search" placeholder="search..." />
                <IconButton
                  type="submit"
                  aria-label="Search database"
                  icon={<SearchIcon />}
                  bgColor="#6D9886"
                />
              </Flex>
            </Form>
          )}
        </Formik>
      </Flex>
    );
  };
  
  export default FollowingSearchBar;