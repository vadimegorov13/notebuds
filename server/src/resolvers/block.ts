import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection, getManager } from "typeorm";
import { Block } from "../entities/Block";
import { Follow } from "../entities/Follow";
import { Note } from "../entities/Note";
import { Save } from "../entities/Save";
import { User } from "../entities/User";
import isAuth from "../middleware/isAuth";
import Context from "../types";
import { UserPagination } from "../utils/pagination";
import { getSaved } from "./helperQueries/getSaved";

@Resolver(Block)
export class BlockResolver {
  // Get all blocked users
  @Query(() => UserPagination)
  @UseMiddleware(isAuth)
  async blockedUsers(
    // Pagenation
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null,
    @Ctx() { req }: Context
  ): Promise<UserPagination> {
    const realLimit = Math.min(100, limit) + 1; // limit + 1
    const { userId } = req.session;

    const query = getManager()
      .createQueryBuilder(Block, "block")
      .where(`block.blockerId = ${userId}`)
      .orderBy(`block.createdAt`, "DESC");

    // Offset (ignore first n rows)
    if (offset) {
      query.offset(offset);
    }

    const blockedUsers = await query.limit(realLimit).getMany();

    const blockedIds = blockedUsers.map(
      (b: { blockedId: number }) => b.blockedId
    );

    if (blockedIds.length === 0) {
      return {
        users: [],
        hasMore: false,
      };
    }

    const users = await getConnection()
      .createQueryBuilder(User, "user")
      .where("user._id IN (:...blockedIds)", { blockedIds })
      .getMany();

    return {
      users: users.slice(0, realLimit - 1),
      hasMore: users.length === realLimit,
    };
  }

  // Block a user
  // or unblock user
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async block(
    @Arg("blockedId", () => Int) blockedId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: Context
  ) {
    const isBlock = value !== -1;
    const realValue = isBlock ? 1 : -1;
    const { userId } = req.session;

    // You can't block yourself ding dong
    if (blockedId === userId) {
      return false;
    }

    const block = await Block.findOne({
      where: { blockedId, blockerId: userId },
    });

    // User has blocked this user before
    // and they are unblocking them
    if (block && block.value !== realValue) {
      // Delete Block object that corresponds to blockedId and blockerId
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Block)
        .where(`"blockedId" = :blockedId and "blockerId" = :blockerId`, {
          blockedId,
          blockerId: userId,
        })
        .execute();
    } else if (!block && realValue === 1) {
      // never blocked before

      // Current user follows the user they are blocking
      const follower = await Follow.findOne({
        where: { followingId: blockedId, followerId: userId },
      });

      // User that getting blocked follows current user
      const following = await Follow.findOne({
        where: { followingId: userId, followerId: blockedId },
      });

      // Blocker's saved notes
      const blockerSaved = await getSaved(userId);

      // Blocked user's saved notes
      const blockedSaved = await getSaved(blockedId);

      await getConnection().transaction(async (tm) => {
        await tm.query(
          `insert into block (
          "blockerId",
          "blockedId",
          value
        )
        values($1, $2, $3);`,
          [userId, blockedId, realValue]
        );

        // Unfollow the user we are blocking
        if (follower) {
          await tm
            .createQueryBuilder()
            .delete()
            .from(Follow)
            .where(
              `"followingId" = :followingId and "followerId" = :followerId`,
              { followingId: blockedId, followerId: userId }
            )
            .execute();

          await tm
            .createQueryBuilder()
            .update(User)
            .set({
              followPoints: () => `"followPoints" - ${1}`,
            })
            .where("_id = :_id", { _id: blockedId })
            .execute();

          await tm
            .createQueryBuilder()
            .update(User)
            .set({
              followingPoints: () => `"followingPoints" - ${1}`,
            })
            .where("_id = :_id", { _id: userId })
            .execute();
        }

        // Blocked user unfollows current user
        if (following) {
          await tm
            .createQueryBuilder()
            .delete()
            .from(Follow)
            .where(
              `"followingId" = :followingId and "followerId" = :followerId`,
              { followingId: userId, followerId: blockedId }
            )
            .execute();

          await tm
            .createQueryBuilder()
            .update(User)
            .set({
              followPoints: () => `"followPoints" - ${1}`,
            })
            .where("_id = :_id", { _id: userId })
            .execute();

          await tm
            .createQueryBuilder()
            .update(User)
            .set({
              followingPoints: () => `"followingPoints" - ${1}`,
            })
            .where("_id = :_id", { _id: blockedId })
            .execute();
        }

        // Remove notes from Saved
        if (blockerSaved?.length) {
          // get notes that have the same userId and noteId
          const savedNotes = await getManager()
            .createQueryBuilder(Note, "note")
            .where(`note._id IN (:...blockerSaved)`, { blockerSaved })
            .andWhere(`note.authorId = :blockedId`, { blockedId })
            .getMany();

          const savedIds = savedNotes.map((s: { _id: number }) => s._id);

          await tm
            .createQueryBuilder()
            .delete()
            .from(Save)
            .where(`"noteId" IN (:...savedIds)`, {
              savedIds,
            })
            .andWhere(`"userId" = :userId`, { userId })
            .execute();

          await tm
            .createQueryBuilder()
            .update(Note)
            .set({
              savePoints: () => `"savePoints" - ${1}`,
            })
            .where(`_id IN (:...savedIds)`, {
              savedIds,
            })
            .execute();
        }

        // Remove notes from Saved
        if (blockedSaved?.length) {
          // get notes that have the same userId and noteId
          const savedNotes = await getManager()
            .createQueryBuilder(Note, "note")
            .where(`note._id IN (:...blockedSaved)`, { blockedSaved })
            .andWhere(`note.authorId = :userId`, { userId })
            .getMany();

          const savedIds = savedNotes.map((s: { _id: number }) => s._id);

          await tm
            .createQueryBuilder()
            .delete()
            .from(Save)
            .where(`"noteId" IN (:...savedIds)`, {
              savedIds,
            })
            .andWhere(`"userId" = :blockedId`, { blockedId })
            .execute();

          await tm
            .createQueryBuilder()
            .update(Note)
            .set({
              savePoints: () => `"savePoints" - ${1}`,
            })
            .where(`_id IN (:...savedIds)`, {
              savedIds,
            })
            .execute();
        }
      });
    } else {
      return false;
    }
    return true;
  }
}
