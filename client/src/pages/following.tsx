import { withUrqlClient } from "next-urql";
import React from "react";
import GetFollowing from "../components/GetFollowers";
import HomePageLayout from "../components/Layouts/HomePageLayout";
import { useMeQuery } from "../generated/graphql";
import { isAuth } from "../utils/isAuth";
import { client } from "../utils/urqlClient";

const Following = () => {
  isAuth();
  const [{ data, fetching }] = useMeQuery();

  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = <div>Loading...</div>;
    // user is logged in
  } else {
    body = <GetFollowing userId={data!.me!._id as number} />;
  }

  return <HomePageLayout>{body}</HomePageLayout>;
};

export default withUrqlClient(client)(Following);
