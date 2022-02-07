import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import React from "react";
import {
  useFollowUserMutation,
  useMeQuery,
  UserParametersFragment,
} from "../generated/graphql";

interface UserFollowButton {
  followuser: UserParametersFragment;
}

const FollowButton: React.FC<UserFollowButton> = ({ followuser }) => {
  const [, setFollow] = useFollowUserMutation();
  const [userMe] = useMeQuery();
  if (followuser?.followPointStatus === 1) {
    return (
      <Box align="right">
        <Button
          w={76}
          p={3}
          b={5}
          shadow="lg"
          border="1px"
          borderColor="#6D9886"
          borderRadius="lg"
          fontWeight="bold"
          display="flex"
          bg="gray.400"
          onClick={() => {
            setFollow({ followingId: followuser._id, value: -1 });
          }}
        >
          Unfollow
        </Button>
      </Box>
    );
  } else if (followuser._id === userMe.data?.me?._id) {
    return <Box></Box>;
  } else {
    return (
      <Box align="right">
        <Button
          w={76}
          p={3}
          b={5}
          shadow="lg"
          border="1px"
          borderColor="#6D9886"
          borderRadius="lg"
          fontWeight="bold"
          display="flex"
          bg="green.400"
          onClick={() => {
            setFollow({ followingId: followuser._id, value: 1 });
          }}
        >
          Follow
        </Button>
      </Box>
    );
  }
};

export default FollowButton;
