import { NextPage } from "next";
import { withUrqlClient } from "next-urql";
import React from "react";
import Layout from "../../components/Layouts/Layout";
import ProfileDisplay from "../../components/ProfileDisplay";
import { useFindUserQuery } from "../../generated/graphql";
import { client } from "../../utils/urqlClient";

const Profile: NextPage<{ username: string }> = ({ username }) => {
  const [{ data, fetching }] = useFindUserQuery({
    variables: {
      username,
    },
  });

  if (!fetching && !data) {
    return <div>yo error</div>;
  }
  return (
    <Layout>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : !data ? (
        <div>Something Went Wrong</div>
      ) : (
        <ProfileDisplay u={data!.findUser!} />
      )}
    </Layout>
  );
};

Profile.getInitialProps = ({ query }) => {
  return {
    username: query.username as string,
  };
};

export default withUrqlClient(client)(Profile);
