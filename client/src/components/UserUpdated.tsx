import { Box } from "@chakra-ui/react";
import React from "react";
import { useMeQuery } from "../generated/graphql";

const UserUpdated: React.FC = () => {
  const [{ data, error, fetching }] = useMeQuery();

  const [userMe] = useMeQuery();

  let body = null;

  if (!fetching && !data) {
    body = (
      <div>
        <div>You got query failed</div>
        <div>{error?.message}</div>
      </div>
    );
  } else {
    body = (
      <Box
        mb={4}
        color="gray.500"
        fontWeight="semibold"
        fontSize="xs"
        textTransform="uppercase"
        allign="center"
      >
        <text>
          Account Last Updated{" "}
          {!userMe.data?.me
            ? " "
            : new Date(parseInt(userMe.data?.me?.updatedAt)).toLocaleDateString(
                "en-US",
                {
                  weekday: undefined,
                  year: "2-digit",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                }
              )}
        </text>
      </Box>
    );
  }

  return <Box>{!data && fetching ? <div>Loading...</div> : <>{body}</>}</Box>;
};

export default UserUpdated;
