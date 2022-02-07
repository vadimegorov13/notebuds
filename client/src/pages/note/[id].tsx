import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import React from "react";
import NoteBody from "../../components/NoteBody";
import { useGetNoteQuery } from "../../generated/graphql";
import { client } from "../../utils/urqlClient";

const Note: NextPage<{ id: string }> = ({ id }) => {
  const [{ data, error, fetching }] = useGetNoteQuery({
    variables: {
      _id: parseInt(id),
    },
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
    <>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : (
        <>{!data!.note ? null : <NoteBody n={data!.note} />}</>
      )}
    </>
  );
};

Note.getInitialProps = ({ query }) => {
  return {
    id: query.id as string,
  };
};

export default withUrqlClient(client)(Note);
