import { Box, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SearchLayout from "../../components/Layouts/SearchLayout";
import NoteCard from "../../components/NoteCard";
import { useSearchNotesQuery } from "../../generated/graphql";
import { client } from "../../utils/urqlClient";
import { useScrollPosition } from "../../utils/useScrollPosition";

const SearchTags: React.FC<{}> = ({}) => {
  const router = useRouter();
  const query: any = router.query;

  let scrollPosition = -1000;
  let realOffset = 0;

  const [variables, setVariables] = useState({
    search: " ",
    limit: 10,
    offset: realOffset,
  });

  useEffect(() => {
    if (query.q) {
      setVariables({
        search: query.q.toString(),
        limit: variables.limit,
        offset: realOffset,
      });
    }
  }, [query]);

  const [{ data, error, fetching }] = useSearchNotesQuery({
    variables,
  });

  // Load more notes depending on scroll
  useScrollPosition(({ prevPos: _, currPos }) => {
    if (currPos.y < scrollPosition) {
      scrollPosition -= 1500;
      realOffset += variables.limit;

      setVariables({
        search: variables.search,
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
    <SearchLayout>
      <Box w="full" maxW={800}>
        {!data && fetching ? (
          <div>Loading...</div>
        ) : (
          <Stack>
            {data!.searchNotes.notes.slice().map((n) =>
              !n.tags ? null : <NoteCard n={n} key={n._id} />
            )}
          </Stack>
        )}
      </Box>
    </SearchLayout>
  );
};

export default withUrqlClient(client)(SearchTags);
