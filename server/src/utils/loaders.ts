import DataLoader from "dataloader";
import { User } from "../entities/User";
import { Comment } from "../entities/Comment";
import { Save } from "../entities/Save";
import { Follow } from "../entities/Follow";
import { Sticker } from "../entities/Sticker";
import { Block } from "../entities/Block";
// need to add every new loader into apollo context

// [1, 7, 8, 9]
// [{id: 1, username: 'bob1'}, {}, {}, {}]
export const createUserLoader = () =>
  new DataLoader<number, User>(async (userIds) => {
    const users = await User.findByIds(userIds as number[]);
    const userIdToUser: Record<number, User> = {};
    users.forEach((u) => {
      if (u._id !== 0) {
        userIdToUser[u._id] = u;
      }
    });

    const sortedUsers = userIds.map((userId) => userIdToUser[userId]);

    // console.log("userIds", userIds);
    // console.log("map", userIdToUser);
    // console.log("sortedUsers", sortedUsers);

    return sortedUsers;
  });

export const createCommentLoader = () =>
  new DataLoader<number, Comment>(async (commentIds) => {
    const comments = await Comment.findByIds(commentIds as number[]);
    const commentIdtoComment: Record<number, Comment> = {};
    comments.forEach((c) => {
      commentIdtoComment[c._id] = c;
    });

    const sortedComments = commentIds.map(
      (commentId) => commentIdtoComment[commentId]
    );

    // console.log("commentIds", commentIds)
    // console.log("map", commentIdtoComment)
    // console.log("sortedComments", sortedComments)

    return sortedComments;
  });

export const createSaveLoader = () =>
  new DataLoader<{ noteId: number; userId: number }, Save | null>(
    async (keys) => {
      const saves = await Save.findByIds(keys as any);
      const saveIdsToSave: Record<string, Save> = {};
      saves.forEach((save) => {
        saveIdsToSave[`${save.userId}|${save.noteId}`] = save;
      });

      return keys.map((key) => saveIdsToSave[`${key.userId}|${key.noteId}`]);
    }
  );

export const createFollowLoader = () =>
  new DataLoader<{ followingId: number; followerId: number }, Follow | null>(
    async (keys) => {
      const followers = await Follow.findByIds(keys as any);
      const followIdsToFollow: Record<string, Follow> = {};
      followers.forEach((follow) => {
        followIdsToFollow[`${follow.followerId}|${follow.followingId}`] =
          follow;
      });

      return keys.map(
        (key) => followIdsToFollow[`${key.followerId}|${key.followingId}`]
      );
    }
  );

export const createBlockLoader = () =>
  new DataLoader<{ blockedId: number; blockerId: number }, Block | null>(
    async (keys) => {
      const blocked = await Block.findByIds(keys as any);
      const blockIdsToBlock: Record<string, Block> = {};
      blocked.forEach((block) => {
        blockIdsToBlock[`${block.blockerId}|${block.blockedId}`] = block;
      });

      return keys.map(
        (key) => blockIdsToBlock[`${key.blockerId}|${key.blockedId}`]
      );
    }
  );

export const createStickerLoader = () =>
  new DataLoader<{ noteId: number; userId: number }, Sticker | null>(
    async (keys) => {
      const stickers = await Sticker.findByIds(keys as any);
      const stickerIdsToSticker: Record<string, Sticker> = {};
      stickers.forEach((sticker) => {
        stickerIdsToSticker[`${sticker.userId}|${sticker.noteId}`] = sticker;
      });

      return keys.map(
        (key) => stickerIdsToSticker[`${key.userId}|${key.noteId}`]
      );
    }
  );
