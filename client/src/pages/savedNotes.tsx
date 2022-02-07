import { withUrqlClient } from "next-urql";
// import { useRouter } from "next/router";
import React from "react";
import GetSavedNotes from "../components/GetSavedNotes";
import HomePageLayout from "../components/Layouts/HomePageLayout";
import { isAuth } from "../utils/isAuth";
import { client } from "../utils/urqlClient";

const SavedNotes = ({}) => {
  isAuth();

  return (
    <HomePageLayout>
      <GetSavedNotes  />
    </HomePageLayout>
  );
};

export default withUrqlClient(client, { ssr: true })(SavedNotes);
