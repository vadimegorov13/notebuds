import { Box, Button, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useGetCommentRepliesQuery } from "../generated/graphql";
import CommentCard from "./CommentCard";

interface GetCommentRepliesProps {
  parentId: number;
}

const GetCommentReplies: React.FC<GetCommentRepliesProps> = ({ parentId }) => {
  let realOffset = 0;

  const [variables, setVariables] = useState({
    parentId,
    limit: 10,
    offset: realOffset,
  });

  const [{ data, error, fetching }] = useGetCommentRepliesQuery({
    variables,
  });

  let body = null;

  if (!fetching && !data) {
    return (
      <div>
        <div>You got query failed</div>
        <div>{error?.message}</div>
      </div>
    );
  }

  if (!data && fetching) {
    body = <div>Loading...</div>;
  } else {
    data!.childComments.comments = data!.childComments.comments.filter((r) => {
      return r._id !== parentId;
    });

    body = (
      <Stack>
        {data!.childComments.comments.map((c) => (!c ? null : <CommentCard c={c} key={c._id} />))}
        {data!.childComments.hasMore === true ? (
          <Button
            onClick={() => {
              realOffset += variables.limit;

              setVariables({
                parentId,
                limit: variables.limit,
                offset: realOffset,
              });
            }}
          >
            Load more
          </Button>
        ) : null}
      </Stack>
    );
  }

  return <Box>{body}</Box>;
};

export default GetCommentReplies;
