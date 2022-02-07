import { Box, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import {  useSavedNotesQuery } from "../generated/graphql";
import { useScrollPosition } from "../utils/useScrollPosition";
import NoteCard from "./NoteCard";

const GetSavedNotes: React.FC = () => {
  let scrollPosition = -1000;
  let realOffset = 0;

  const [variables, setVariables] = useState({
    limit: 10,
    offset: realOffset,
  });

  // Load more users depending on scroll
  useScrollPosition(({ prevPos: _, currPos }) => {
    if (currPos.y < scrollPosition) {
      scrollPosition -= 1500;
      realOffset += variables.limit;

      setVariables({
        limit: variables.limit,
        offset: realOffset,
      });
    }
  }, []);

  const [{ data, error, fetching }] = useSavedNotesQuery({
    variables,
  });

  if (!fetching && !data) {
    return (
      <div>
        <div>You got query failed</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  return (
    <Box>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack spacing={8}>
          {data!.savedNotes.notes.map((n) =>
            !(n) ? null : <NoteCard n={n} key={n._id} />
          )}
        </Stack>
      )}
    </Box>
  );
};

export default GetSavedNotes;
