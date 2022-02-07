import { Box, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
// import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import HomePageLayout from "../components/Layouts/HomePageLayout";
import MySearchBar from "../components/MySearchBar";
import NoteCard from "../components/NoteCard";
import { useMeQuery, useSearchMyNotesQuery } from "../generated/graphql";
import { isAuth } from "../utils/isAuth";
import { client } from "../utils/urqlClient";
import { useScrollPosition } from "../utils/useScrollPosition";

const MyNotes = ({}) => {
  isAuth();
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
        offset: variables.offset,
      });
    }
  }, [query]);

  const [{ data, error, fetching }] = useSearchMyNotesQuery({
    variables,
  });

  const [userMe] = useMeQuery();

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
    <HomePageLayout>
      <Box w="full" maxW={800}>
        <Box size="md" align="center" mb={2}>
          <MySearchBar />
        </Box>
        {!data && fetching ? (
          <div>Loading...</div>
        ) : (
          <Stack>
            {data!.searchMyNotes.notes.slice().map((n) =>
              !(n.authorId === userMe.data?.me?._id) ? null : (
                <Box borderRadius="xl">
                  <NoteCard n={n} key={n._id} />
                </Box>
              )
            )}
          </Stack>
        )}
      </Box>
    </HomePageLayout>
  );
};

export default withUrqlClient(client)(MyNotes);
