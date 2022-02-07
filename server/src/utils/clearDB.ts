import { Note } from "../entities/Note";
import { User } from "../entities/User";
import { Comment } from "../entities/Comment";
import { Save } from "../entities/Save";
import { Follow } from "../entities/Follow";
import { Block } from "../entities/Block";
import { UserNotification } from "../entities/UserNotification";
import { Views } from "../entities/Views";
import { Sticker } from "../entities/Sticker";

export const clearDB = async () => {
  await User.delete({});
  await Note.delete({});
  await Comment.delete({});
  await Save.delete({});
  await Follow.delete({}) 
  await Block.delete({})
  await Views.delete({})
  await Sticker.delete({})
  await UserNotification.delete({})
};
