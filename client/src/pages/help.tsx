import { Box, Center, Heading, Spacer, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import HomePageLayout from "../components/Layouts/HomePageLayout";
import { client } from "../utils/urqlClient";

const help = () => {
  return (
    <HomePageLayout>
      <Center>
        <Stack>
          <Heading align="center" bg="#6D9886" borderRadius="lg">
            Help
          </Heading>
          <Box>
            <text>
              If you experiancing issues with NoteBuds Just create a Note with
              Tag "Help" and a solution will be provided
            </text>
            <Spacer marginBottom={5} />
            <text>
              If that is not possible please email us at notebugs@gmail.com
            </text>
          </Box>
        </Stack>
      </Center>
    </HomePageLayout>
  );
};

export default withUrqlClient(client)(help);
