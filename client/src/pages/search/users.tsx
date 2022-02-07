import { Box, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import SearchLayout from "../../components/Layouts/SearchLayout";
import UserCard from "../../components/UserCard";
import { useSearchUsersQuery } from "../../generated/graphql";
import { client } from "../../utils/urqlClient";
import { useScrollPosition } from "../../utils/useScrollPosition";

const SearchUsers: React.FC<{}> = ({}) => {
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

  const [{ data, error, fetching }] = useSearchUsersQuery({
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
            {data!.searchUsers.users.slice().map((u) =>
              !u ? null : <UserCard u={u} />
            )}
          </Stack>
        )}
      </Box>
    </SearchLayout>
  );
};

export default withUrqlClient(client)(SearchUsers);
