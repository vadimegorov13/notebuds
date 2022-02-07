import { Box, Button, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  NoteParametersFragment,
  useGetNoteCommentsQuery,
} from "../generated/graphql";
import CommentCard from "./CommentCard";

interface GetCommentsProps {
  n: NoteParametersFragment;
}

const GetComments: React.FC<GetCommentsProps> = ({ n }) => {
  let realOffset = 0;

  const [variables, setVariables] = useState({
    noteId: n._id,
    limit: 10,
    offset: realOffset,
  });

  const [{ data, error, fetching }] = useGetNoteCommentsQuery({
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
    body = (
      <Stack>
        {data!.noteComments.comments.map((c) =>
          !c ? null : <CommentCard c={c} key={c._id} />
        )}
        {data!.noteComments.hasMore === true ? (
          <Button
            onClick={() => {
              realOffset += variables.limit;

              setVariables({
                noteId: n._id,
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

export default GetComments;
