import { Box, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useUsersNotesQuery } from "../generated/graphql";
import { useScrollPosition } from "../utils/useScrollPosition";
import NoteCard from "./NoteCard";

const GetUsersNotes: React.FC<{ uId: number }> = ({ uId }) => {
  let scrollPosition = -1000;
  let realOffset = 0;

  const [variables, setVariables] = useState({
    userId: uId,
    limit: 10,
    offset: realOffset,
  });

  // Load more users depending on scroll
  useScrollPosition(({ prevPos: _, currPos }) => {
    if (currPos.y < scrollPosition) {
      scrollPosition -= 1500;
      realOffset += variables.limit;

      setVariables({
        userId: uId,
        limit: variables.limit,
        offset: realOffset,
      });
    }
  }, []);

  const [{ data, error, fetching }] = useUsersNotesQuery({
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
          {data!.usersNotes.notes.map((n) => (
            <NoteCard n={n} key={n._id} />
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default GetUsersNotes;
