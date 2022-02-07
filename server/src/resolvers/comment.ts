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
import { getConnection, getManager } from "typeorm";
import { Comment } from "../entities/Comment";
import { Note } from "../entities/Note";
import { User } from "../entities/User";
import isAuth from "../middleware/isAuth";
import Context from "../types";
import { CommentPagination } from "../utils/pagination";
import { CommentResponse } from "../utils/responses";
import { CommentInput } from "../utils/userInput";
import { validateCommentInput } from "../utils/validateUserInput";
import { getBlocked } from "./helperQueries/getBlocked";

@Resolver(Comment)
export class CommentResolver {
  // Assign author field
  @FieldResolver(() => User)
  author(@Root() comment: Comment, @Ctx() { userLoader }: Context) {
    return userLoader.load(comment.authorId);
  }

  // Assign parent comment field
  @FieldResolver(() => Comment)
  parent(@Root() comment: Comment, @Ctx() { commentLoader }: Context) {
    if (!comment.parentId) {
      return null;
    }

    // console.log("comment.parentId", comment.parentId);

    return commentLoader.load(comment.parentId);
  }

  // Assign children comment field
  @FieldResolver(() => Comment)
  children(@Root() comment: Comment, @Ctx() { commentLoader }: Context) {
    if (!comment.childrenIds) {
      return null;
    }

    const sortedChildren = comment.childrenIds.map((childrenIds) =>
      commentLoader.load(childrenIds)
    );

    return sortedChildren;
  }

  // Get comment by id
  @Query(() => Comment, { nullable: true })
  async comment(
    @Arg("_id", () => Int) _id: number
  ): Promise<Comment | undefined> {
    return Comment.findOne(_id);
  }

  // Get all comments under a note (sorted by new)
  @Query(() => CommentPagination)
  async noteComments(
    // Pagination
    @Arg("noteId", () => Int) noteId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null,
    @Ctx() { req }: Context
  ): Promise<CommentPagination> {
    const realLimit = Math.min(100, limit) + 1;
    const query = getManager()
      .createQueryBuilder(Comment, "comment")
      .where("comment.noteId = :noteId", { noteId })
      .andWhere("comment.parentId is NULL");

    // If current user is logged in get comments that are not blocked
    if (req.session.userId) {
      // Get all blocked Ids
      const blockedIds = await getBlocked(req.session.userId);

      if (blockedIds?.length) {
        query.andWhere(`comment.authorId NOT IN (:...blockedIds)`, {
          blockedIds,
        });
      }
    }

    // Offset (ignore first n rows)
    if (offset) {
      query.offset(offset);
    }

    const comments = await query
      .orderBy(`comment.createdAt`, "DESC")
      .limit(realLimit)
      .getMany();

    return {
      comments: comments.slice(0, realLimit - 1),
      hasMore: comments.length === realLimit,
    };
  }

  // Get all replies to the comment
  @Query(() => CommentPagination)
  async childComments(
    // Pagenation
    @Arg("parentId", () => Int) parentId: number,
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null,
    @Ctx() { req }: Context
  ): Promise<CommentPagination> {
    const realLimit = Math.min(100, limit) + 1;
    const query = getManager()
      .createQueryBuilder(Comment, "comment")
      .where("comment.parentId = :parentId", { parentId });

    // If current user is logged in get comments that are not blocked
    if (req.session.userId) {
      // Get all blocked Ids
      const blockedIds = await getBlocked(req.session.userId);

      if (blockedIds?.length) {
        query.andWhere(`comment.authorId NOT IN (:...blockedIds)`, {
          blockedIds,
        });
      }
    }

    // Offset (ignore first n rows)
    if (offset) {
      query.offset(offset);
    }

    const comments = await query
      .orderBy(`comment.createdAt`, "DESC")
      .limit(realLimit)
      .getMany();

    return {
      comments: comments.slice(0, realLimit - 1),
      hasMore: comments.length === realLimit,
    };
  }

  // Create comment
  @Mutation(() => CommentResponse)
  @UseMiddleware(isAuth)
  async createComment(
    @Arg("input") input: CommentInput,
    @Ctx() { req }: Context
  ): Promise<CommentResponse> {
    let errors = validateCommentInput(input.text);
    if (errors) {
      return { errors };
    }

    // Check if noteId is valid
    const note = await Note.findOne({ _id: input.noteId });

    if (!note) {
      // Sometimes error will be weird and it says it returns NULL, use this syntax if so
      return {
        errors: [
          {
            field: "note",
            message: "Note doesn't exist",
          },
        ],
      };
    }

    // Check if parentId is valid
    let parentComment;
    if (input.parentId) {
      parentComment = await Comment.findOne({ _id: input.parentId });
      if (!parentComment) {
        return {
          errors: [
            {
              field: "comment",
              message: "Comment doesn't exist",
            },
          ],
        };
      }
    }

    // Save new comment
    const createdComment = await Comment.create({
      ...input,
      authorId: req.session.userId,
    }).save();

    // Add comment to the childrenIds of the parent comment
    if (parentComment) {
      let childrenIds = parentComment?.childrenIds;

      if (!childrenIds) {
        childrenIds = [createdComment._id];
      } else {
        childrenIds.push(createdComment._id);
      }

      await getConnection().query(
        `update comment
        set "childrenIds" = $2
        where _id = $1`,
        [input.parentId, childrenIds]
      );
    }

    // Update comment counter on the note
    await getConnection().query(
      `update note
        set "commentPoints" = "commentPoints" + 1
        where _id = $1`,
      [createdComment?.noteId]
    );

    return { comment: createdComment };
  }

  // Update comment
  @Mutation(() => CommentResponse)
  @UseMiddleware(isAuth)
  async updateComment(
    @Arg("_id", () => Int) _id: number,
    @Arg("text") text: string,
    @Ctx() { req }: Context
  ): Promise<CommentResponse> {
    let errors = validateCommentInput(text);
    if (errors) {
      return { errors };
    }

    const comment = await getConnection()
      .createQueryBuilder()
      .update(Comment)
      .set({ text, isEdited: true })
      .where('_id = :_id and "authorId" = :authorId', {
        _id,
        authorId: req.session.userId,
      })
      .returning("*")
      .execute();

    // console.log(comment);

    return { comment: comment.raw[0] };
  }

  // Delete comment
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteComment(
    @Arg("_id", () => Int) _id: number,
    @Ctx() { req }: Context
  ): Promise<boolean> {
    // Check if it is op who is deleting a comment
    const comment = await Comment.findOne({ _id });

    // Get parent to remove current comment from childrenIds list
    const parent = await Comment.findOne({ _id: comment?.parentId });
    // Remove comment from childrenIds
    if (parent) {
      parent.childrenIds.splice(parent.childrenIds.indexOf(_id), 1);

      await getConnection().query(
        `update comment
          set "childrenIds" = $1
          where _id = $2`,
        [parent?.childrenIds, comment?.parentId]
      );
    }

    // Decrease comment counter from the note
    await getConnection().query(
      `update note
        set "commentPoints" = "commentPoints" - 1
        where _id = $1`,
      [comment?.noteId]
    );

    await Comment.delete({ _id, authorId: req.session.userId });

    return true;
  }
}
