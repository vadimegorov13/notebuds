import { withUrqlClient } from "next-urql";
import React from "react";
import GetFollowers from "../components/GetFollowing";
import HomePageLayout from "../components/Layouts/HomePageLayout";
import { useMeQuery } from "../generated/graphql";
import { isAuth } from "../utils/isAuth";
import { client } from "../utils/urqlClient";

const Followers = () => {
  isAuth();
  const [{ data, fetching }] = useMeQuery();

  if (!fetching && !data) {
    return <div>yo error</div>;
  }
  return (
    <HomePageLayout>
      {!data && fetching ? (
        <div>Loading...</div>
      ) : !data ? (
        <div>Something Went Wrong</div>
      ) : (
        <GetFollowers userId={data!.me!._id as number} />
      )}
    </HomePageLayout>
  );
};

export default withUrqlClient(client)(Followers);
