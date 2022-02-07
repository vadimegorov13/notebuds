import { Arg, Ctx, Int, Mutation, Resolver, UseMiddleware } from "type-graphql";
import { getConnection } from "typeorm";
import { Context } from "vm";
import { Note } from "../entities/Note";
import { Sticker } from "../entities/Sticker";
import isAuth from "../middleware/isAuth";

@Resolver(Sticker)
export class StickerResolver {
  // Leave a sticker
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async sticker(
    @Arg("noteId", () => Int) noteId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: Context
  ) {
    const isSticker = value !== -1;
    const realValue = isSticker ? 1 : -1;
    const { userId } = req.session;
    const sticker = await Sticker.findOne({ where: { noteId, userId } });
    const note = await Note.findOne({ where: { _id: noteId } });

    // Return false if user tries to save his own note
    // or if note doesn't exist or its privated
    if (note?.authorId == userId || !note || note?.isPrivate) {
      return false;
    }

    // User has voted on the note before
    // and they are changing their vote
    if (sticker && sticker.value !== realValue) {
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `update sticker
          set value = $1
          where "noteId" = $2 and "userId" = $3`,
          [realValue, noteId, userId]
        );

        await tm.query(
          `update note
          set "stickerPoints" = "stickerPoints" + $1
          where _id = $2`,
          [realValue, noteId]
        );
      });
    } else if (!sticker) {
      // never voted before
      await getConnection().transaction(async (tm) => {
        await tm.query(
          `insert into sticker (
          "userId",
          "noteId",
          value
        )
        values($1, $2, $3);`,
          [userId, noteId, realValue]
        );

        await tm.query(
          `update note
          set "stickerPoints" = "stickerPoints" + $1
          where _id = $2`,
          [realValue, noteId]
        );
      });
    }

    return true;
  }
}
