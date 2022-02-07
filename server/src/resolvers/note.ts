import { Views } from "../entities/Views";
import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { Brackets, getConnection, getManager } from "typeorm";
import { Note } from "../entities/Note";
import { User } from "../entities/User";
import isAuth from "../middleware/isAuth";
import Context from "../types";
import { NotePagination } from "../utils/pagination";
import { NoteResponse } from "../utils/responses";
import { NoteInput } from "../utils/userInput";
import { validateNoteInput } from "../utils/validateUserInput";
import { getBlocked } from "./helperQueries/getBlocked";
import { getSaved } from "./helperQueries/getSaved";
import { getUsers } from "./helperQueries/getUsers";

@Resolver(Note)
export class NoteResolver {
  // Add text snippet field
  @FieldResolver(() => String)
  textSnippet(@Root() note: Note) {
    return note.text.slice(0, 400);
  }

  // Add author field to get necessary information about author
  @FieldResolver(() => User)
  author(@Root() note: Note, @Ctx() { userLoader }: Context) {
    return userLoader.load(note.authorId);
  }

  // Add sticker point status field
  @FieldResolver(() => Int, { nullable: true })
  async stickerPointStatus(
    @Root() note: Note,
    @Ctx() { stickerLoader, req }: Context
  ) {
    if (!req.session.userId) {
      return null;
    }

    const sticker = await stickerLoader.load({
      noteId: note._id,
      userId: req.session.userId,
    });

    return sticker ? sticker.value : null;
  }

  // Add save point status field
  @FieldResolver(() => Int, { nullable: true })
  async savePointStatus(
    @Root() note: Note,
    @Ctx() { saveLoader, req }: Context
  ) {
    if (!req.session.userId) {
      return null;
    }

    const save = await saveLoader.load({
      noteId: note._id,
      userId: req.session.userId,
    });

    return save ? save.value : null;
  }

  // Get all notes (sorted by new)
  @Query(() => NotePagination)
  async notes(
    // Pagination
    @Arg("userId", () => Int, { nullable: true }) userId: number | null,
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null,
    @Ctx() { req }: Context
  ): Promise<NotePagination> {
    const realLimit = Math.min(100, limit) + 1; // limit + 1
    const userIds = await getUsers(req.session.userId);
    const query = getManager().createQueryBuilder(Note, "note");

    // Check if note is private and give access to private notes only to author of this note
    if (userId !== req.session.userId) {
      query.where("note.isPrivate = false");
    } else {
      query.where("note.isPrivate = false or note.isPrivate = true");
    }

    // Get all notes only from one user
    if (userId) {
      query.andWhere(`note.authorId = ${userId}`);
    }

    // Get notes from users that current user has access to
    if (userIds?.length) {
      query.andWhere(`note.authorId IN (:...userIds)`, { userIds });
    }

    // If current user is logged in get notes that are not blocked
    if (req.session.userId) {
      // Get all blocked Ids
      const blockedIds = await getBlocked(req.session.userId);

      if (blockedIds?.length) {
        query.andWhere(`note.authorId NOT IN (:...blockedIds)`, { blockedIds });
      }
    }

    // Order by date of creation
    query.orderBy(`note.createdAt`, "DESC");

    // Offset (ignore first n rows)
    if (offset) {
      query.offset(offset);
    }

    // Limit and get many
    const notes = await query.limit(realLimit).getMany();

    return {
      notes: notes.slice(0, realLimit - 1),
      hasMore: notes.length === realLimit,
    };
  }

  // Get all users notes (sorted by new)
  @Query(() => NotePagination)
  async usersNotes(
    // Pagination
    @Arg("userId", () => Int) userId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null,
    @Ctx() { req }: Context
  ): Promise<NotePagination> {
    const realLimit = Math.min(100, limit) + 1; // limit + 1
    const query = getManager().createQueryBuilder(Note, "note");

    // Get all notes only from one user
    query.where(`note.authorId = ${userId}`);

    // Check if note is private and give access to private notes only to author of this note
    if (userId !== req.session.userId) {
      query.andWhere(`note.isPrivate = false`);
    } else {
      query.andWhere(`note.isPrivate = false or note.isPrivate = true and note.authorId = ${req.session.userId}`);
    }

    // Order by date of creation
    query.orderBy(`note.createdAt`, "DESC");

    // Offset (ignore first n rows)
    if (offset) {
      query.offset(offset);
    }

    // Limit and get many
    const notes = await query.limit(realLimit).getMany();

    return {
      notes: notes.slice(0, realLimit - 1),
      hasMore: notes.length === realLimit,
    };
  }

  // Get all notes from the current user (sorted by new)
  @Query(() => NotePagination)
  @UseMiddleware(isAuth)
  async myNotes(
    // Pagenation
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null,
    @Ctx() { req }: Context
  ): Promise<NotePagination> {
    const realLimit = Math.min(100, limit) + 1; // limit + 1
    const { userId } = req.session;
    const userIds = await getUsers(userId);

    const savedIds = await getSaved(userId);

    const query = getManager().createQueryBuilder(Note, "note");

    if (savedIds?.length) {
      query.where(
        new Brackets((qb) => {
          qb.where(`note.authorId = ${userId}`).orWhere(
            `note._id IN (:...savedIds)`,
            { savedIds }
          );
        })
      );
    } else {
      query.where(`note.authorId = ${userId}`);
    }

    // Get notes from users that current user has access to
    if (userIds?.length) {
      query.andWhere(`note.authorId IN (:...userIds)`, { userIds });
    }

    query.orderBy(`note.createdAt`, "DESC");

    // Offset (ignore first n rows)
    if (offset) {
      query.offset(offset);
    }

    // Limit and get many
    const notes = await query.limit(realLimit).getMany();

    return {
      notes: notes.slice(0, realLimit - 1),
      hasMore: notes.length === realLimit,
    };
  }

  // Get all notes from the current user (sorted by updated)
  @Query(() => NotePagination)
  @UseMiddleware(isAuth)
  async myUpdatedNotes(
    // Pagenation
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null,
    @Ctx() { req }: Context
  ): Promise<NotePagination> {
    const realLimit = Math.min(100, limit) + 1; // limit + 1
    const { userId } = req.session;
    const userIds = await getUsers(userId);

    const savedIds = await getSaved(userId);

    const query = getManager().createQueryBuilder(Note, "note");

    if (savedIds?.length) {
      query.where(
        new Brackets((qb) => {
          qb.where(`note.authorId = ${userId}`).orWhere(
            `note._id IN (:...savedIds)`,
            { savedIds }
          );
        })
      );
    } else {
      query.where(`note.authorId = ${userId}`);
    }

    // Get notes from users that current user has access to
    if (userIds?.length) {
      query.andWhere(`note.authorId IN (:...userIds)`, { userIds });
    }

    query.orderBy(`note.updatedAt`, "DESC");

    // Offset (ignore first n rows)
    if (offset) {
      query.offset(offset);
    }

    // Limit and get many
    const notes = await query.limit(realLimit).getMany();

    return {
      notes: notes.slice(0, realLimit - 1),
      hasMore: notes.length === realLimit,
    };
  }

  // Get note by id
  @Query(() => Note, { nullable: true })
  async note(
    @Arg("_id", () => Int) _id: number,
    @Ctx() { req }: Context
  ): Promise<Note | undefined> {
    const { userId } = req.session;
    const userIds = await getUsers(userId);
    const query = getManager()
      .createQueryBuilder(Note, "note")
      .where(`note._id = :_id`, { _id });

    // Return note only if its not blocked
    if (userId) {
      const blockedIds = await getBlocked(userId);

      // Get users that are not blocked
      if (blockedIds?.length) {
        query.andWhere(`note.authorId NOT IN (:...blockedIds)`, { blockedIds });
      }
    }

    // Get notes from users that current user has access to
    if (userIds?.length) {
      query.andWhere(`note.authorId IN (:...userIds)`, { userIds });
    }

    const note = await query.getOne();

    if (userId && note) {
      const view = await Views.findOne({ where: { noteId: _id, userId } });

      if (!view) {
        await getConnection().transaction(async (tm) => {
          await tm.query(
            `insert into views (
            "userId",
            "noteId"
            )
            values($1, $2);`,
            [userId, _id]
          );

          await tm.query(
            `update note
            set "viewsPoints" = "viewsPoints" + 1
            where _id = $1`,
            [_id]
          );
        });
      }
    }

    return note;
  }

  // Create Note
  @Mutation(() => NoteResponse)
  @UseMiddleware(isAuth)
  async createNote(
    @Arg("input") input: NoteInput,
    @Ctx() { req }: Context
  ): Promise<NoteResponse> {
    let errors = validateNoteInput(input);
    if (errors) {
      return { errors };
    }

    if (input.tags) {
      const tags = input.tags?.replace(/\s+/g, "").trim().replace(/,/g, " ");

      input.tags = tags;
    }

    const note = await Note.create({
      ...input,
      authorId: req.session.userId,
    }).save();

    return { note };
  }

  // Update note
  @Mutation(() => NoteResponse)
  @UseMiddleware(isAuth)
  async updateNote(
    @Arg("_id", () => Int) _id: number,
    @Arg("input") input: NoteInput,
    @Ctx() { req }: Context
  ): Promise<NoteResponse> {
    let errors = validateNoteInput(input);
    if (errors) {
      return { errors };
    }

    if (input.tags) {
      const tags = input.tags?.replace(/\s+/g, "").trim().replace(/,/g, " ");

      input.tags = tags;
    }

    const note = await getConnection()
      .createQueryBuilder()
      .update(Note)
      .set({ ...input })
      .where('_id = :_id and "authorId" = :authorId', {
        _id,
        authorId: req.session.userId,
      })
      .returning("*")
      .execute();

    return { note: note.raw[0] };
  }

  // Delete note
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteNote(
    @Arg("_id", () => Int) _id: number,
    @Ctx() { req }: Context
  ): Promise<boolean> {
    // Check if it is author who is deleting a note
    await Note.delete({ _id, authorId: req.session.userId });
    return true;
  }
}
