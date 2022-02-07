import { Box, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useNotesQuery } from "../generated/graphql";
import { useScrollPosition } from "../utils/useScrollPosition";
import NoteCard from "./NoteCard";

const GetNotes: React.FC = () => {
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
    <Box w="full">
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack>
          {data!.notes.notes.map((n) => (!n ? null : <NoteCard n={n} key={n._id}/>))}
        </Stack>
      )}
    </Box>
  );
};

export default GetNotes;
