import { Box, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useMyUpdatedNotesQuery } from "../generated/graphql";
import { isAuth } from "../utils/isAuth";
import { useScrollPosition } from "../utils/useScrollPosition";
import NoteCard from "./NoteCard";

const GetMyNotesUpdated: React.FC = () => {
  isAuth()
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

  const [{ data, error, fetching }] = useMyUpdatedNotesQuery({
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
    <Box w="full" maxW={800}>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <Stack>
          {data!.myUpdatedNotes.notes.map((n) => (!n ? null : <NoteCard n={n} key={n._id}/>))}
        </Stack>
      )}
    </Box>
  );
};

export default GetMyNotesUpdated;