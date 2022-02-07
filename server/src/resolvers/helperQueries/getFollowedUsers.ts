import { getManager } from "typeorm";
import { Follow } from "../../entities/Follow";

// Users that current user follows
export const getFollowedUsers = async (userId: number) => {
  const followedUsers = await getManager()
    .createQueryBuilder(Follow, "follow")
    .where(`follow.followerId = ${userId}`)
    .orderBy(`follow.createdAt`, "DESC")
    .getMany();

  if (followedUsers) {
    const followingIds = followedUsers.map(
      (f: { followingId: number }) => f.followingId
    );

    return followingIds;
  }

  return null;
};
