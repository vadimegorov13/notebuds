import { Box, Stack } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import React, { useState } from "react";
import SettingsLayout from "../../components/Layouts/SettingsLayout";
import BlockedUserCard from "../../components/BlockedUserCard";
import { useBlockedUsersQuery, useMeQuery } from "../../generated/graphql";
import { isAuth } from "../../utils/isAuth";
import { isServerSide } from "../../utils/isServerSide";
import { client } from "../../utils/urqlClient";
import { useScrollPosition } from "../../utils/useScrollPosition";

const BlockedUsers: React.FC<{}> = ({}) => {
  isAuth();

  const [{ data, fetching }] = useMeQuery({
    pause: isServerSide(),
  });

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

  const [
    { data: dataUsers, error, fetching: fetchingUsers },
  ] = useBlockedUsersQuery({
    variables,
  });

  let body: any = null;

  if (!fetching && !data) {
    body = (
      <SettingsLayout>
        <div>You got query failed</div>
        <div>{error?.message}</div>
      </SettingsLayout>
    );
  } else {
    body = (
      <SettingsLayout>
        <Box w="full" maxW={800}>
          {!dataUsers && fetchingUsers ? (
            <div>Loading...</div>
          ) : (
            <Stack>
              {dataUsers!.blockedUsers.users
                .map((u) => (!u ? null : <BlockedUserCard u={u} />))}
            </Stack>
          )}
        </Box>
      </SettingsLayout>
    );
  }

  return <>{body}</>;
};

export default withUrqlClient(client)(BlockedUsers);
