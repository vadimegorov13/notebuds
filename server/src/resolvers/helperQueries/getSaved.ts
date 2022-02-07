import { Save } from "../../entities/Save";
import { getManager } from "typeorm";

export const getSaved = async (userId: number) => {
  const save = await getManager()
    .createQueryBuilder(Save, "save")
    .where(`save."userId" = ${userId}`)
    .getMany();

  if (save) {
    const savedIds = save.map((s: { noteId: number }) => s.noteId);

    return savedIds;

    // Example
    // query.andWhere(`note._id IN (:...saved)`, { saved });
  }

  return null;
};
