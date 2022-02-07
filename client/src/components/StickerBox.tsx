import { StarIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/layout";
import React from "react";
import {
  NoteParametersFragment,
  useStickerNoteMutation,
} from "../generated/graphql";

interface StickerButton {
  note: NoteParametersFragment;
}

const StickerBox: React.FC<StickerButton> = ({ note }) => {
  const [, setSticker] = useStickerNoteMutation();
  if (note?.stickerPointStatus === 1) {
    return (
      <Box
        mr={4}
        _hover={{ fontWeight: "semibold" }}
        onClick={() => {
          setSticker({ noteId: note._id, value: -1 });
        }}
        color="yellow.700"
      >
        <StarIcon /> {note.stickerPoints}{" "}
        {note.stickerPoints % 10 == 1 ? <>Sticker</> : <>Stickers</>}
      </Box>
    );
  } else {
    return (
      <Box
        mr={4}
        _hover={{ fontWeight: "semibold" }}
        onClick={() => {
          setSticker({ noteId: note._id, value: 1 });
        }}
      >
        <StarIcon /> {note.stickerPoints}{" "}
        {note.stickerPoints % 10 == 1 ? <>Sticker</> : <>Stickers</>}
      </Box>
    );
  }
};

export default StickerBox;
