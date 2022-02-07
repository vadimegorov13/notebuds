import { Arg, Ctx, Int, Query, Resolver, UseMiddleware } from "type-graphql";
import { Brackets, getManager } from "typeorm";
import { Note } from "../entities/Note";
import { User } from "../entities/User";
import isAuth from "../middleware/isAuth";
import Context from "../types";
import { NotePagination, UserPagination } from "../utils/pagination";
import { getBlocked } from "./helperQueries/getBlocked";
import { getSaved } from "./helperQueries/getSaved";
import { getUsers } from "./helperQueries/getUsers";

@Resolver()
export class SearchResolver {
  // Search through notes(sorted by new)
  @Query(() => NotePagination)
  async searchNotes(
    @Arg("search", () => String, { nullable: true }) search: string | null,
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null,
    @Ctx() { req }: Context
  ): Promise<NotePagination> {
    const realLimit = Math.min(100, limit) + 1; // limit + 1
    const { userId } = req.session;

    const userIds = await getUsers(userId);

    let searchArray = "";

    if (search) {
      searchArray = search.toLowerCase().replace(/\s+/g, " ").trim().replace(/\s/g, "|");
      searchArray = "%(" + searchArray + ")%";
    }

    const query = getManager()
      .createQueryBuilder(Note, "note")
      .andWhere("note.isPrivate = false")
      .andWhere(
        new Brackets((qb) => {
          qb.where(`lower(note.title) similar to '${searchArray}'`)
            .orWhere(`lower(note.text) similar to '${searchArray}'`)
            .orWhere(`lower(note.tags) similar to '${searchArray}'`);
        })
      );

    // If current user is logged in get notes that are not blocked
    if (userId) {
      // Get all blocked Ids
      const blockedIds = await getBlocked(userId);

      if (blockedIds?.length) {
        query.andWhere(`note.authorId NOT IN (:...blockedIds)`, { blockedIds });
      }
    }

    // Get notes from users that current user has access to
    if (userIds?.length) {
      query.andWhere(`note.authorId IN (:...userIds)`, { userIds });
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

  // Search through notes of a current user (sorted by new)
  // I just copied it from above and added three lines lmao
  @Query(() => NotePagination)
  @UseMiddleware(isAuth)
  async searchMyNotes(
    @Arg("search", () => String, { nullable: true }) search: string | null,
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null,
    @Ctx() { req }: Context
  ): Promise<NotePagination> {
    const realLimit = Math.min(100, limit) + 1; // limit + 1
    const { userId } = req.session;
    const savedIds = await getSaved(userId);

    let searchArray = "";

    if (search) {
      searchArray = search.toLowerCase().replace(/\s+/g, " ").trim().replace(/\s/g, "|");
      searchArray = "%(" + searchArray + ")%";
    }

    const query = getManager()
      .createQueryBuilder(Note, "note")
      .where("note.authorId = :userId", { userId })
      .andWhere(
        new Brackets((qb) => {
          qb.where(`lower(note.title) similar to '${searchArray}'`)
            .orWhere(`lower(note.text) similar to '${searchArray}'`)
            .orWhere(`lower(note.tags) similar to '${searchArray}'`);
        })
      );

    // Get all saved notes
    if (savedIds?.length) {
      query.orWhere(`note._id IN (:...savedIds)`, { savedIds });
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

  // Search through users (sorted by new)
  @Query(() => UserPagination)
  async searchUsers(
    @Arg("search", () => String, { nullable: true }) search: string | null,
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null,
    @Ctx() { req }: Context
  ): Promise<UserPagination> {
    const realLimit = Math.min(100, limit) + 1; // limit + 1
    const { userId } = req.session;
    // Remove extra whitespace, trim, split words in array
    let searchArray = "";

    if (search) {
      searchArray = search.replace(/\s+/g, " ").trim().replace(/\s/g, "|");
      searchArray = "%(" + searchArray + ")%";
    }

    const query = getManager()
      .createQueryBuilder(User, "user")
      .where(`lower(user.username) similar to '${searchArray}'`);

    // If current user is logged in get users that are not blocked
    if (userId) {
      query.andWhere(`user._id != ${userId}`);
      // Get all blocked Ids
      const blockedIds = await getBlocked(userId);

      if (blockedIds?.length) {
        query.andWhere(`user._id NOT IN (:...blockedIds)`, { blockedIds });
      }
    }

    // Order by date of creation
    query.orderBy(`user.createdAt`, "DESC");

    // Offset (ignore first n rows)
    if (offset) {
      query.offset(offset);
    }

    // Limit and get many
    const users = await query.limit(realLimit).getMany();

    return {
      users: users.slice(0, realLimit - 1),
      hasMore: users.length === realLimit,
    };
  }
}
