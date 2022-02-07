import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import React from "react";

interface Props {
  isOpen: boolean;
  onClose: Function;
  body: any;
}

const DrawerForSidebar = ({ isOpen, onClose, body }: Props) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose as any}>
      <DrawerOverlay>
        <DrawerContent>
          <DrawerHeader bg="#6D9886">NoteBuds</DrawerHeader>
          <DrawerCloseButton color="white" />
          <DrawerBody bg="#6D9886">{body}</DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default DrawerForSidebar;
