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
import { Note } from "../entities/Note";
import { Save } from "../entities/Save";
import isAuth from "../middleware/isAuth";
import Context from "../types";
import { NotePagination } from "../utils/pagination";
import { getUsers } from "./helperQueries/getUsers";

@Resolver(Save)
export class SaveResolver {
  // Save the note
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async save(
    @Arg("noteId", () => Int) noteId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: Context
  ) {
    const isSave = value !== -1;
    const realValue = isSave ? 1 : -1;
    const { userId } = req.session;
    const save = await Save.findOne({ where: { noteId, userId } });
    const note = await Note.findOne({ where: { _id: noteId } });

    // Return false if user tries to save his own note
    // or if note doesn't exist or its privated
    if (note?.authorId == userId || !note || note?.isPrivate) {
      return false;
    }

    if (save && save.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `update save
            set value = $1
            where "noteId" = $2 and "userId" = $3`,
          [realValue, noteId, userId]
        );

        await tm.query(
          `update note
            set "savePoints" = "savePoints" + $1
            where _id = $2`,
          [realValue, noteId]
        );

        Save.delete({ noteId, userId });
      });
    } else if (!save) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `
        insert into save (
          "userId",
          "noteId",
          value
        )
        values($1, $2, $3)
        `,
          [userId, noteId, realValue]
        );

        await tm.query(
          `
        update note
        set "savePoints" = "savePoints" + $1
        
        where _id = $2
        `,
          [realValue, noteId]
        );
      });
    }

    return true;
  }

  // Get all saved notes
  @Query(() => NotePagination)
  @UseMiddleware(isAuth)
  async savedNotes(
    // Pagenation
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null,
    @Ctx() { req }: Context
  ): Promise<NotePagination> {
    const realLimit = Math.min(100, limit) + 1; // limit + 1
    const { userId } = req.session;
    const userIds = await getUsers(userId);

    const query = getManager()
      .createQueryBuilder(Save, "save")
      .where(`save.userId = ${userId}`);

    query.orderBy(`save.createdAt`, "DESC");

    // Offset (ignore first n rows)
    if (offset) {
      query.offset(offset);
    }

    const savedNotes = await query.limit(realLimit).getMany();

    const savedIds = savedNotes.map((s: { noteId: number }) => s.noteId);

    if (savedIds.length === 0) {
      return {
        notes: [],
        hasMore: false,
      };
    }

    const notesQuery = getConnection()
      .createQueryBuilder(Note, "note")
      .where("note._id IN (:...savedIds)", { savedIds });

    // Get notes from users that current user has access to
    if (userIds?.length) {
      notesQuery.andWhere(`note.authorId IN (:...userIds)`, { userIds });
    }

    const notes = await notesQuery.getMany();

    return {
      notes: notes.slice(0, realLimit - 1),
      hasMore: notes.length === realLimit,
    };
  }
}
