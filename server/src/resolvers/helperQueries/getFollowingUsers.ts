import { getManager } from "typeorm";
import { Follow } from "../../entities/Follow";

// Users that current user follows
export const getFollowingUsers = async (userId: number) => {
  const followingUsers = await getManager()
    .createQueryBuilder(Follow, "follow")
    .where(`follow.followingId = ${userId}`)
    .orderBy(`follow.createdAt`, "DESC")
    .getMany();

  if (followingUsers) {
    const followedIds = followingUsers.map(
      (f: { followerId: number }) => f.followerId
    );

    return followedIds;
  }

  return null;
};
