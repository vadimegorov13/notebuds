import { UserPagination } from "../utils/pagination";
import {
  Arg,
  Ctx,
  Int,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { Follow } from "../entities/Follow";
import { User } from "../entities/User";
import isAuth from "../middleware/isAuth";
import Context from "../types";
import { getFollowingUsers } from "./helperQueries/getFollowingUsers";
import { getFollowedUsers } from "./helperQueries/getFollowedUsers";

@Resolver(Follow)
export class FollowResolver {
  // Follow a user
  // or unfollow user
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async follow(
    @Arg("followingId", () => Int) followingId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: Context
  ) {
    const isFollow = value !== -1;
    const realValue = isFollow ? 1 : -1;
    const { userId } = req.session;

    // User can't follow themself lol
    if (followingId === userId) {
      return false;
    }

    const follow = await Follow.findOne({
      where: { followingId, followerId: userId },
    });

    // User has followed this user before
    // and they are unfollowing them
    if (follow && follow.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm
          .createQueryBuilder()
          .delete()
          .from(Follow)
          .where(
            `"followingId" = :followingId and "followerId" = :followerId`,
            { followingId, followerId: userId }
          )
          .execute();

        await tm
          .createQueryBuilder()
          .update(User)
          .set({
            followPoints: () => `"followPoints" + ${realValue}`,
          })
          .where("_id = :_id", { _id: followingId })
          .execute();

        await tm
          .createQueryBuilder()
          .update(User)
          .set({
            followingPoints: () => `"followingPoints" + ${realValue}`,
          })
          .where("_id = :_id", { _id: userId })
          .execute();
      });
    } else if (!follow && realValue === 1) {
      // never followed before
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `insert into follow (
          "followerId",
          "followingId",
          value
        )
        values($1, $2, $3);`,
          [userId, followingId, realValue]
        );

        await tm
          .createQueryBuilder()
          .update(User)
          .set({
            followPoints: () => `"followPoints" + ${realValue}`,
          })
          .where("_id = :_id", { _id: followingId })
          .execute();

        await tm
          .createQueryBuilder()
          .update(User)
          .set({
            followingPoints: () => `"followingPoints" + ${realValue}`,
          })
          .where("_id = :_id", { _id: userId })
          .execute();
      });
    } else {
      return false;
    }

    return true;
  }

  // Get all following users (sorted by new)
  // Users that follows current user
  @Query(() => UserPagination)
  // @UseMiddleware(isAuth)
  async followingUsers(
    // Pagenation
    @Arg("userId", () => Int) userId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null
  ): Promise<UserPagination> {
    const realLimit = Math.min(100, limit) + 1; // limit + 1
    const followerIds = await getFollowingUsers(userId);

    if (followerIds?.length === 0) {
      return {
        users: [],
        hasMore: false,
      };
    }

    const query = getConnection()
      .createQueryBuilder(User, "user")
      .where("user._id IN (:...followerIds)", { followerIds });

    // Offset (ignore first n rows)
    if (offset) {
      query.offset(offset);
    }

    const users = await query.limit(realLimit).getMany();

    return {
      users: users.slice(0, realLimit - 1),
      hasMore: users.length === realLimit,
    };
  }

  // Get all followed users (sorted by new)
  // Users that current user follows
  @Query(() => UserPagination)
  // @UseMiddleware(isAuth)
  async followedUsers(
    // Pagenation
    @Arg("userId", () => Int) userId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null
  ): Promise<UserPagination> {
    const realLimit = Math.min(100, limit) + 1; // limit + 1
    const followingIds = await getFollowedUsers(userId);

    if (followingIds?.length === 0) {
      return {
        users: [],
        hasMore: false,
      };
    }

    const query = getConnection()
      .createQueryBuilder(User, "user")
      .where("user._id IN (:...followingIds)", { followingIds });

    // Offset (ignore first n rows)
    if (offset) {
      query.offset(offset);
    }

    const users = await query.limit(realLimit).getMany();

    return {
      users: users.slice(0, realLimit - 1),
      hasMore: users.length === realLimit,
    };
  }
}
