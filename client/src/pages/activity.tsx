import { withUrqlClient } from "next-urql";
import React from "react";
import GetMyNotesUpdated from "../components/GetMyNotesUpdated";
import HomePageLayout from "../components/Layouts/HomePageLayout";
import UserUpdated from "../components/UserUpdated";
import { isAuth } from "../utils/isAuth";
import { client } from "../utils/urqlClient";

const activity = () => {
  isAuth();
  return (
    <HomePageLayout>
      <UserUpdated />
      <GetMyNotesUpdated />
    </HomePageLayout>
  );
};

export default withUrqlClient(client)(activity);
