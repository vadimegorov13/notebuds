import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { Box, Button, IconButton, Link } from "@chakra-ui/react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  NoteParametersFragment,
  useDeleteNoteMutation,
  useMeQuery,
  useSaveNoteMutation,
} from "../generated/graphql";

interface NoteEditDeleteSaveButtons {
  note: NoteParametersFragment;
  authorId?: number;
}

export const NoteEditDeleteSaveButtons: React.FC<NoteEditDeleteSaveButtons> = ({
  note,
  authorId,
}) => {
  const router = useRouter();
  const [{ data: meData }] = useMeQuery();
  const [, deleteNote] = useDeleteNoteMutation();

  // For save Button
  const [loadingState, setLoadingState] = useState<"loading" | "not-loading">(
    "not-loading"
  );
  const [, save] = useSaveNoteMutation();

  let saveValue: number = 1;
  let body = null;

  if (meData?.me && authorId) {
    if (meData?.me?._id !== authorId) {
      body = (
        <Box>
          <Button
            size="md"
            backgroundColor="blue.200"
            color="#212121"
            _hover={{
              background: "#212121",
              color: "blue.200",
            }}
            aria-label="Save Note"
            onClick={async () => {
              // Already saved the note
              if (note.savePointStatus === 1) {
                saveValue = -1;
              }
              setLoadingState("loading");
              await save({
                noteId: note._id,
                value: saveValue,
              });
              setLoadingState("not-loading");
            }}
            isLoading={loadingState === "loading"}
          >
            {note.savePointStatus === 1 ? <Box>Saved</Box> : <Box>Save</Box>}
          </Button>
        </Box>
      );
    } else {
      body = (
        <Box>
          <NextLink href="/note/edit/[id]" as={`/note/edit/${note._id}`}>
            <IconButton
              size="md"
              backgroundColor="blue.200"
              color="#212121"
              _hover={{
                background: "#212121",
                color: "blue.200",
              }}
              as={Link}
              mr={4}
              icon={<EditIcon />}
              aria-label="Edit Note"
            />
          </NextLink>

          <IconButton
            size="md"
            backgroundColor="red.500"
            color="#212121"
            _hover={{
              background: "#212121",
              color: "red.500",
            }}
            icon={<DeleteIcon />}
            aria-label="Delete Note"
            onClick={async () => {
              await deleteNote({
                _id: note._id,
              });
            }}
          />
        </Box>
      );
    }
  } else {
    body = (
      <Box>
        <Button
          w={76}
          size="md"
          backgroundColor="blue.200"
          color="#212121"
          _hover={{
            background: "#212121",
            color: "blue.200",
          }}
          aria-label="Save Note"
          onClick={async () => {
            router.replace("/login?next=" + router.pathname);
          }}
        >
          <Box>Save</Box>
        </Button>
      </Box>
    );
  }

  return <>{body}</>;
};
