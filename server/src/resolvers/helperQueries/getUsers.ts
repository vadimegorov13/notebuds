import { Brackets, getConnection, getManager } from "typeorm";
import { User } from "../../entities/User";
import { getFollowedUsers } from "./getFollowedUsers";
import { getFollowingUsers } from "./getFollowingUsers";

export const getUsers = async (userId: number | null) => {
  // get users with the scope "everyone"
  const openUsers = await getManager()
    .createQueryBuilder(User, "user")
    .where(`user.everyone = true`)
    .orWhere("user._id = :_id", { _id: userId })
    .getMany();

  let userIds = openUsers.map((u: { _id: number }) => u._id);

  if (userId) {
    // get users that current user follows (where current user is in following)
    // users with scope "onlyFollowers"
    const followingIds = await getFollowedUsers(userId);

    if (followingIds?.length) {
      const onlyFollowersUsers = await getConnection()
        .createQueryBuilder(User, "user")
        .where(`user.onlyFollowers = true`)
        .andWhere("user._id IN (:...followingIds)", { followingIds })
        .orWhere("user._id = :_id", { _id: userId })
        .getMany();

      const onlyFollowersUserIds = onlyFollowersUsers.map(
        (u: { _id: number }) => u._id
      );

      userIds = userIds.concat(onlyFollowersUserIds);

      // get users that current user follows and they follow them
      // users with scope "onlyFolowersYouFollow"

      const followerIds = await getFollowingUsers(userId);

      if (followerIds?.length) {
        const followingUsers = await getManager()
          .createQueryBuilder(User, "user")
          .where(`user.onlyFolowersYouFollow = true`)
          .andWhere(
            new Brackets((qb) => {
              qb.where("user._id IN (:...followingIds)", {
                followingIds,
              }).andWhere("user._id IN (:...followerIds)", { followerIds });
            })
          )
          .orWhere("user._id = :_id", { _id: userId })
          .getMany();

        const onlyFolowersYouFollowUserIds = followingUsers.map(
          (u: { _id: number }) => u._id
        );

        userIds = userIds.concat(onlyFolowersYouFollowUserIds);
      }
    }
  }

  if (userIds) {
    return userIds;
  }

  return null;
};
