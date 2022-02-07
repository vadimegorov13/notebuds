import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React from "react";
import HomePageLayout from "../components/Layouts/HomePageLayout";
import { client } from "../utils/urqlClient";

const About = () => {
  return (
    <HomePageLayout>
      <Center>
        <Stack>
          <Heading align="center" bg="#6D9886" borderRadius="lg">
            About
          </Heading>
          <Box>
            <text>
              {"\t"}As a student of any discipline, you are bound to take a lot
              of notes on a variety of topics in order to master the subject
              quickly. But how and where will you store them? Most students take
              notes in their notebooks or on sheets of paper or save them in
              some kind of cloud (Google Docs, notion, etc.).
            </text>
            <Spacer marginBottom={5} />
            <text>
              But over time, students often start to face a problem where they
              cannot find a specific note. We believe that by providing a web
              app that can keep everything in one place and easily find any
              notes students have taken before, we will help students to save a
              lot of time, keep track of what they have learned, and by making
              it interactive with other students it can encourage learning.
            </text>
          </Box>
          <Heading align="center" marginTop={10}>
            Created By
          </Heading>
          <Divider />
          <Flex>
            <text>Vadim Egorov</text>
            <Spacer w={2} />
            <text>Calvin MaryLand V</text>
            <Spacer w={2} />
            <text>Emily Massie</text>
          </Flex>
        </Stack>
      </Center>
    </HomePageLayout>
  );
};

export default withUrqlClient(client)(About);
