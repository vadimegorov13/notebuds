import { Box, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useFollowingUsersQuery } from "../generated/graphql";
import { useScrollPosition } from "../utils/useScrollPosition";
import UserCard from "./UserCard";

interface GetFollowingProps {
  userId: number;
}

const GetFollowing: React.FC<GetFollowingProps> = ({ userId }) => {
  let scrollPosition = -1000;
  let realOffset = 0;

  const [variables, setVariables] = useState({
    userId: userId,
    limit: 10,
    offset: realOffset,
  });

  // Load more users depending on scroll
  useScrollPosition(({ prevPos: _, currPos }) => {
    if (currPos.y < scrollPosition) {
      scrollPosition -= 1500;
      realOffset += variables.limit;

      setVariables({
        userId,
        limit: variables.limit,
        offset: realOffset,
      });
    }
  }, []);

  const [{ data, error, fetching }] = useFollowingUsersQuery({
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
        <Stack>
          {data!.followingUsers.users.map((u) =>
            !u ? null : <UserCard u={u} key={u._id} />
          )}
        </Stack>
      )}
    </Box>
  );
};

export default GetFollowing;
