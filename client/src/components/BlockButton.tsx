import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import React from "react";
import {
  useBlockUserMutation,
  useMeQuery,
  UserParametersFragment,
} from "../generated/graphql";

interface BlockButtonButton {
  blockUser: UserParametersFragment;
}

const BlockButton: React.FC<BlockButtonButton> = ({ blockUser }) => {
  const [, setBlock] = useBlockUserMutation();
  const [userMe] = useMeQuery();
  if (blockUser?.blockPointStatus === 1) {
    return (
      <Box align="right">
        <Button
          w={76}
          p={3}
          b={5}
          shadow="lg"
          border="1px"
          borderColor="red"
          borderRadius="lg"
          fontWeight="bold"
          display="flex"
          backgroundColor="red.500"
          color="#212121"
          _hover={{
            background: "#212121",
            color: "red.500",
          }}
          onClick={() => {
            setBlock({ blockedId: blockUser._id, value: -1 });
          }}
        >
          Unblock
        </Button>
      </Box>
    );
  } else if (blockUser._id === userMe.data?.me?._id) {
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
          backgroundColor="red.500"
          color="#212121"
          _hover={{
            background: "#212121",
            color: "red.500",
          }}
          onClick={() => {
            setBlock({ blockedId: blockUser._id, value: 1 });
          }}
        >
          Block
        </Button>
      </Box>
    );
  }
};

export default BlockButton;
