import { Box, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import HomePageLayout from "../components/Layouts/HomePageLayout";
import NoteCard from "../components/NoteCard";
import { useNotesQuery } from "../generated/graphql";
import { client } from "../utils/urqlClient";
import { useScrollPosition } from "../utils/useScrollPosition";

const Index = () => {
  let scrollPosition = -1000;
  let realOffset = 0;

  const [variables, setVariables] = useState({
    userId: null as number | null,
    limit: 10,
    offset: realOffset,
  });

  const [{ data, error, fetching }] = useNotesQuery({
    variables,
  });

  // Load more notes depending on scroll
  useScrollPosition(({ prevPos: _, currPos }) => {
    if (currPos.y < scrollPosition) {
      scrollPosition -= 1500;
      realOffset += variables.limit;

      setVariables({
        userId: null,
        limit: variables.limit,
        offset: realOffset,
      });
    }
  }, []);

  if (!fetching && !data) {
    return (
      <div>
        <div>You got query failed</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <HomePageLayout>
      <Box w="full">
        {!data && fetching ? (
          <div>Loading...</div>
        ) : (
          <Stack>
            {data!.notes.notes.map((n) =>
              !n ? null : <NoteCard n={n} key={n._id} />
            )}
          </Stack>
        )}
      </Box>
    </HomePageLayout>
  );
};

export default withUrqlClient(client, { ssr: true })(Index);
