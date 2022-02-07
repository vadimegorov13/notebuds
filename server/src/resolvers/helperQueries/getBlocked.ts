import { getManager } from "typeorm";
import { Block } from "../../entities/Block";

export const getBlocked = async (userId: number) => {
  const block = await getManager()
    .createQueryBuilder(Block, "block")
    .where(`block."blockedId" = ${userId} or block."blockerId" = ${userId}`)
    .getMany();

  if (block) {
    const blockedIds = block.map(
      (b: { blockerId: number; blockedId: number }) => {
        if (b.blockerId == userId) {
          return b.blockedId;
        } else {
          return b.blockerId;
        }
      }
    );

    return blockedIds;

    // Example
    // query.andWhere(`note.authorId NOT IN (:...blockedIds)`, { blockedIds });
  }

  return null;
};
