import { Request, Response } from "express";
import { Redis } from "ioredis";
import { Session, SessionData } from "express-session";
import {
  createUserLoader,
  createCommentLoader,
  createSaveLoader,
  createFollowLoader,
  createStickerLoader,
  createBlockLoader,
} from "./utils/loaders";

// Context from redis
type Context = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId: number };
  };
  redis: Redis;
  res: Response;
  userLoader: ReturnType<typeof createUserLoader>;
  commentLoader: ReturnType<typeof createCommentLoader>;
  saveLoader: ReturnType<typeof createSaveLoader>;
  followLoader: ReturnType<typeof createFollowLoader>;
  stickerLoader: ReturnType<typeof createStickerLoader>;
  blockLoader: ReturnType<typeof createBlockLoader>
};

export default Context;
