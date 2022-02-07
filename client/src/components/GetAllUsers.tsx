import { Box, Wrap } from "@chakra-ui/react";
import React, { useState } from "react";
import { useGetAllUsersQuery } from "../generated/graphql";
import { useScrollPosition } from "../utils/useScrollPosition";
import UserCard from "./UserCard";

const GetAllUsers: React.FC = () => {
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

  const [{ data, error, fetching }] = useGetAllUsersQuery({
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
        <Wrap w="-webkit-fit-content">
          {data!.getAllUsers.users.map((u) =>
            !u ? null : <UserCard u={u} key={u._id} />
          )}
        </Wrap>
      )}
    </Box>
  );
};

export default GetAllUsers;
