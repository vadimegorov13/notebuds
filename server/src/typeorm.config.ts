import { __prod__ } from "./constants";
import { Note } from "./entities/Note";
import "dotenv-safe/config";
import { User } from "./entities/User";
import { ConnectionOptions } from "typeorm";
import path from "path";
import { Comment } from "./entities/Comment";
import { Save } from "./entities/Save";
import { UserNotification } from "./entities/UserNotification";
import { Follow } from "./entities/Follow";
import { Block } from "./entities/Block";
import { Views } from "./entities/Views";
import { Sticker } from "./entities/Sticker";

// Configuration for typeorm
const config: ConnectionOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL,
  logging: true,
  // synchronize: true,
  migrations: [path.join(__dirname, "./migrations/*")],
  entities: [User, Note, Comment, Save, UserNotification, Follow, Block, Views, Sticker],
};

export default config;
