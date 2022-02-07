import { ApolloServer } from "apollo-server-express";
import redisConnect from "connect-redis";
import cors from "cors";
import "dotenv-safe/config";
import express from "express";
import session from "express-session";
import Redis from "ioredis";
import "reflect-metadata";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { COOKIE_NAME, __prod__ } from "./constants";
import { BlockResolver } from "./resolvers/block";
import { CommentResolver } from "./resolvers/comment";
import { FollowResolver } from "./resolvers/follow";
import { NoteResolver } from "./resolvers/note";
import { SaveResolver } from "./resolvers/save";
import { SearchResolver } from "./resolvers/search";
import { StickerResolver } from "./resolvers/sticker";
import { UserResolver } from "./resolvers/user";
import config from "./typeorm.config";
// import { clearDB } from "./utils/clearDB";
import {
  createBlockLoader,
  createCommentLoader,
  createFollowLoader,
  createSaveLoader,
  createStickerLoader,
  createUserLoader,
} from "./utils/loaders";

const main = async () => {
  // Connect typeorm to DB to interact with it
  const connection = await createConnection(config);
  await connection.runMigrations();
  // await clearDB();

  // Server setup
  const app = express();

  // Serup redis DB
  const RedisStore = redisConnect(session);
  const redis = new Redis(process.env.REDIS_URL);
  app.set("trust proxy", 1);

  // Allow server to be requested by client
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    })
  );

  // Setup cookies
  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({
        client: redis,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        // graphql cookies only works with this values for sameSite and secure
        sameSite: "lax", // protecting csrf // change it to "lax"
        secure: __prod__, // cookie only works in https // change it to __prod__
        domain: __prod__ ? ".notebuds.com" : undefined,
      },
      saveUninitialized: false,
      secret: process.env.SESSION_SECRET,
      resave: false,
    })
  );

  // Create Apollo Server
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [
        NoteResolver,
        UserResolver,
        CommentResolver,
        SaveResolver,
        FollowResolver,
        BlockResolver,
        SearchResolver,
        StickerResolver,
      ],
      validate: false,
    }),
    context: ({ req, res }) => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
      commentLoader: createCommentLoader(),
      saveLoader: createSaveLoader(),
      followLoader: createFollowLoader(),
      stickerLoader: createStickerLoader(),
      blockLoader: createBlockLoader(),
    }),
  });

  // Connect app to Apollo
  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  // Start server
  app.listen(process.env.PORT, () => {
    console.log("Server started on localhost, port:", process.env.PORT);
  });
};

main().catch((err) => {
  console.log(err);
});
