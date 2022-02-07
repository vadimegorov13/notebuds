import { gql } from "@urql/core";
import { cacheExchange } from "@urql/exchange-graphcache";
import { dedupExchange, fetchExchange } from "urql/core";
import {
  BlockUserMutationVariables,
  CreateCommentMutationVariables,
  DeleteNoteMutationVariables,
  FollowUserMutationVariables,
  LoginMutation,
  LogoutMutation,
  MeDocument,
  MeQuery,
  RegisterMutation,
  SaveNoteMutationVariables,
  StickerNoteMutationVariables,
} from "../generated/graphql";
import { errorExchange } from "./errorExchange";
import { invalidateComments, invalidateNotes } from "./invalidate";
import { isServerSide } from "./isServerSide";
import {
  commentPagination,
  notePagination,
  userPagination,
} from "./pagination";
import { myUpdateQuery } from "./updateQuery";

export const client = (ssrExchange: any, context: any) => {
  let cookie = "";
  if (isServerSide()) {
    // Get cookie
    cookie = context?.req?.headers?.cookie;
  }

  // console.log(process.env.NEXT_PUBLIC_API_URL)

  return {
    url: process.env.NEXT_PUBLIC_API_URL as string,
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      // This will update cache without the need of page reload
      cacheExchange({
        keys: {
          NotePagination: () => null,
          UserPagination: () => null,
          CommentPagination: () => null,
        },
        resolvers: {
          Query: {
            notes: notePagination(),
            myNotes: notePagination(),
            savedNotes: notePagination(),
            searchMyNotes: notePagination(),
            getAllUsers: userPagination(),
            blockedUsers: userPagination(),
            followingUsers: userPagination(),
            followedUsers: userPagination(),
            searchNotes: notePagination(),
            searchUsers: userPagination(),
            myUpdatedNotes: notePagination(),
            noteComments: commentPagination(),
            childComments: commentPagination(),
            usersNotes: notePagination(),
          },
        },
        updates: {
          Mutation: {
            follow: (_result, args, cache, _) => {
              const {
                followingId,
                value,
              } = args as FollowUserMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on User {
                    _id
                    followPoints
                    followPointStatus
                  }
                `,
                { _id: followingId }
              );
              if (data) {
                if (data.followPointStatus === value) {
                  return;
                }
                const newFollowPoints = data.followPoints + value;
                cache.writeFragment(
                  gql`
                    fragment _ on User {
                      followPoints
                      followPointStatus
                    }
                  `,
                  {
                    _id: followingId,
                    followPoints: newFollowPoints,
                    followPointStatus: value,
                  }
                );
              }
            },
            block: (_result, args, cache, _) => {
              const { blockedId, value } = args as BlockUserMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on User {
                    _id
                    blockPointStatus
                  }
                `,
                { _id: blockedId }
              );
              if (data) {
                if (data.blockPointStatus === value) {
                  return;
                }
                cache.writeFragment(
                  gql`
                    fragment _ on User {
                      blockPointStatus
                    }
                  `,
                  {
                    _id: blockedId,
                    blockPointStatus: value,
                  }
                );
              }
            },
            save: (_result, args, cache, _) => {
              const { noteId, value } = args as SaveNoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Note {
                    _id
                    savePoints
                    savePointStatus
                  }
                `,
                { _id: noteId }
              );
              // console.log(data)
              if (data) {
                if (data.savePointStatus === value) {
                  return;
                }
                const newSavePoints = data.savePoints + value;
                cache.writeFragment(
                  gql`
                    fragment _ on Note {
                      savePoints
                      savePointStatus
                    }
                  `,
                  {
                    _id: noteId,
                    savePoints: newSavePoints,
                    savePointStatus: value,
                  }
                );
              }
            },
            createComment: (_result, args, cache, _) => {
              const { input } = args as CreateCommentMutationVariables;
              // console.log("noteId: ", input.noteId)
              const data = cache.readFragment(
                gql`
                  fragment _ on Note {
                    _id
                    commentPoints
                  }
                `,
                { _id: input.noteId }
              );
              if (data) {
                const newCommentPoints = data.commentPoints + 1;
                cache.writeFragment(
                  gql`
                    fragment _ on Note {
                      commentPoints
                    }
                  `,
                  {
                    _id: input.noteId,
                    commentPoints: newCommentPoints,
                  }
                );
              }

              invalidateComments(cache);
            },
            sticker: (_result, args, cache, _) => {
              const { noteId, value } = args as StickerNoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Note {
                    _id
                    stickerPoints
                    stickerPointStatus
                  }
                `,
                { _id: noteId }
              );
              console.log(data);
              if (data) {
                if (data.stickerPointStatus === value) {
                  return;
                }
                const newStickerPoints = data.stickerPoints + value;
                cache.writeFragment(
                  gql`
                    fragment _ on Note {
                      stickerPoints
                      stickerPointStatus
                    }
                  `,
                  {
                    _id: noteId,
                    stickerPoints: newStickerPoints,
                    stickerPointStatus: value,
                  }
                );
              }
            },
            deleteNote: (_result, args, cache, _) => {
              cache.invalidate({
                __typename: "Note",
                _id: (args as DeleteNoteMutationVariables)._id,
              });
            },
            // Update cache after login
            loginUser(_result, _, cache, __) {
              myUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.loginUser.errors) {
                    console.log("error");
                    return query;
                  } else {
                    return {
                      me: result.loginUser.user as any,
                    };
                  }
                }
              );
              invalidateNotes(cache);
            },
            // Update cache after register
            registerUser(_result, _, cache, __) {
              myUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.registerUser.errors) {
                    return query;
                  } else {
                    return {
                      me: result.registerUser.user as any,
                    };
                  }
                }
              );
            },
            // Update cache after logout
            logout(_result, _, cache, __) {
              myUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
              invalidateNotes(cache);
            },

            // Relode the data and show new notes
            createNote: (_result, _, cache, __) => {
              invalidateNotes(cache);
            },


            /*follow: (_result, _, cache, __) => {
              myUpdateQuery<FollowUserMutation, FollowedUsersQuery>(
                cache,
                { query: FollowedUsersDocument },
                _result,
                (result, query) => {
                  if (!result.follow) {
                    return query;
                  } else {
                    return {
                      followedUsers: query.followedUsers,
                    };
                  }
                }
              );
              invalidateUsers(cache);
            },*/
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
