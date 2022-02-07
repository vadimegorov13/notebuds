import argon2 from "argon2";
import { sendEmail } from "../utils/sendEmail";
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
import {
  COOKIE_NAME,
  FORGET_PASSWORD_PREFIX,
  VERIFY_EMAIL_PREFIX,
} from "../constants";
import { Block } from "../entities/Block";
import { Comment } from "../entities/Comment";
import { Follow } from "../entities/Follow";
import { Note } from "../entities/Note";
import { Save } from "../entities/Save";
import { Sticker } from "../entities/Sticker";
import { User } from "../entities/User";
import { Views } from "../entities/Views";
import isAuth from "../middleware/isAuth";
import Context from "../types";
import { UserPagination } from "../utils/pagination";
import { UserResponse } from "../utils/responses";
import {
  EmailUpdateInput,
  ForgotPasswordInput,
  LoginInput,
  ProfileUpdateInput,
  RegisterInput,
  ScopeUpdateInput,
  UpdatePasswordInput,
} from "../utils/userInput";
import {
  validateEmailUpdateInput,
  validateForgotPasswordInput,
  validateLoginInput,
  validateProfileUpdateInput,
  validateRegisterInput,
  validateUpdatePasswordInput,
} from "../utils/validateUserInput";
import { getBlocked } from "./helperQueries/getBlocked";
import { v4 } from "uuid";

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: Context) {
    // This is the current user and it is ok to show them their own email
    if (req.session.userId === user._id) {
      return user.email;
    }
    // user wants to see someone elses email
    return "";
  }

  // Add point status field
  @FieldResolver(() => Int, { nullable: true })
  async followPointStatus(
    @Root() user: User,
    @Ctx() { followLoader, req }: Context
  ) {
    if (!req.session.userId) {
      return null;
    }

    const follow = await followLoader.load({
      followingId: user._id,
      followerId: req.session.userId,
    });

    return follow ? follow.value : null;
  }

  // Add block status field
  @FieldResolver(() => Int, { nullable: true })
  async blockPointStatus(
    @Root() user: User,
    @Ctx() { blockLoader, req }: Context
  ) {
    if (!req.session.userId) {
      return null;
    }

    const block = await blockLoader.load({
      blockedId: user._id,
      blockerId: req.session.userId,
    });

    return block ? block.value : null;
  }

  @Query(() => UserPagination)
  async getAllUsers(
    // Pagenation
    @Arg("limit", () => Int) limit: number,
    @Arg("offset", () => Int, { nullable: true }) offset: number | null,
    @Ctx() { req }: Context
  ): Promise<UserPagination> {
    const realLimit = Math.min(100, limit) + 1; // limit + 1
    const { userId } = req.session;

    const query = getManager()
      .createQueryBuilder(User, "user")
      .where(`user._id != 0`);

    if (userId) {
      query.andWhere(`user._id != ${userId}`);

      const blockedIds = await getBlocked(userId);

      // Get users that are not blocked
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

  // Get user by username
  @Query(() => User, { nullable: true })
  async findUser(
    @Arg("username", () => String) username: string
    // @Ctx() { req }: Context
  ): Promise<User | undefined> {
    const query = getManager()
      .createQueryBuilder(User, "user")
      .where(`user.username = :username`, { username });

    // Check scope

    // Return user only if they did not block current user
    // if (req.session.userId) {
    //   const blockedIds = await getBlocked(req.session.userId);

    //   // Get users that are not blocked
    //   if (blockedIds?.length) {
    //     query.andWhere(`user._id NOT IN (:...blockedIds)`, { blockedIds });
    //   }
    // }

    const user = await query.getOne();

    return user;
  }

  // Get current user
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: Context) {
    // User is not logged in
    if (!req.session.userId) {
      return null;
    }

    // Return user
    return User.findOne(req.session.userId);
  }

  // Update profile
  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async updateProfile(
    @Arg("input") input: ProfileUpdateInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    if (input.color.includes("#")) {
      const color = input.color.replace(/#/g, "");

      input.color = color;
    }

    let errors = validateProfileUpdateInput(input);
    if (errors) {
      return { errors };
    }

    const user = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ ...input })
      .where("_id = :_id", {
        _id: req.session.userId,
      })
      .returning("*")
      .execute();

    return { user: user.raw[0] };
  }

  // Update email
  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async updateEmail(
    @Arg("input") input: EmailUpdateInput,
    @Ctx() { req, redis }: Context
  ): Promise<UserResponse> {
    let errors = validateEmailUpdateInput(input);
    if (errors) {
      return { errors };
    }

    const user = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ email: input.newEmail, isVerified: false })
      .where("_id = :_id", {
        _id: req.session.userId,
      })
      .returning("*")
      .execute();

    const token = v4();
    const text = `<a href="${process.env.CORS_ORIGIN}/verify-email/${token}">verify your new email</a>`;

    await redis.set(
      VERIFY_EMAIL_PREFIX + token,
      user.raw[0]._id,
      "ex",
      1000 * 60 * 60 * 24
    );

    await sendEmail(input.newEmail, text, "Verify your new email");

    return { user: user.raw[0] };
  }

  @Mutation(() => Boolean)
  async verifyEmail(
    @Arg("token") token: string,
    @Ctx() { redis }: Context
  ): Promise<Boolean> {
    const key = VERIFY_EMAIL_PREFIX + token;
    const userId = await redis.get(key);
    if (!userId) {
      return false;
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);
    if (!user) {
      return false;
    }

    await User.update(
      { _id: userIdNum },
      {
        isVerified: true,
      }
    );

    return true;
  }

  // Update scope
  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async updateScope(
    @Arg("input") input: ScopeUpdateInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    const user = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ ...input })
      .where("_id = :_id", {
        _id: req.session.userId,
      })
      .returning("*")
      .execute();

    return { user: user.raw[0] };
  }

  @Mutation(() => UserResponse)
  async createNewPassword(
    @Arg("input") input: ForgotPasswordInput,
    @Ctx() { redis, req }: Context
  ): Promise<UserResponse> {
    let errors = validateForgotPasswordInput(input);
    if (errors) {
      return { errors };
    }

    if (input.newPassword !== input.confirmPassword) {
      return {
        errors: [
          {
            field: "confirmPassword",
            message: "Does not match new password!",
          },
        ],
      };
    }

    const key = FORGET_PASSWORD_PREFIX + input.token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOne(userIdNum);
    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    await User.update(
      { _id: userIdNum },
      {
        password: await argon2.hash(input.newPassword),
      }
    );

    req.session.userId = user._id;

    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(@Arg("email") email: string, @Ctx() { redis }: Context) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // email is not in a database
      return true;
    }

    const token = v4();
    const text = `<a href="${process.env.CORS_ORIGIN}/change-password/${token}">reset password</a>`;

    await redis.set(
      FORGET_PASSWORD_PREFIX + token,
      user._id,
      "ex",
      1000 * 60 * 60 * 24
    );

    await sendEmail(email, text, "Change password");

    return true;
  }

  // Update Pasword
  @Mutation(() => UserResponse)
  @UseMiddleware(isAuth)
  async updatePassword(
    @Arg("input") input: UpdatePasswordInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    let errors = validateUpdatePasswordInput(input);
    if (errors) {
      return { errors };
    }

    // Get user by username
    const user = await User.findOne({ where: { _id: req.session.userId } });

    // Verify users password
    if (user) {
      const valid = await argon2.verify(user.password, input.password);
      if (!valid) {
        return {
          errors: [
            {
              field: "password",
              message: "Password is incorrect",
            },
          ],
        };
      }

      const samePassword = await argon2.verify(
        user.password,
        input.newPassword
      );
      if (samePassword) {
        return {
          errors: [
            {
              field: "newPassword",
              message: "You can not use the same password",
            },
          ],
        };
      }
    }

    if (input.newPassword !== input.confirmPassword) {
      return {
        errors: [
          {
            field: "confirmPassword",
            message: "Does not match new password!",
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(input.newPassword);

    const updatedUser = await getConnection()
      .createQueryBuilder()
      .update(User)
      .set({ password: hashedPassword })
      .where("_id = :_id", {
        _id: req.session.userId,
      })
      .returning("*")
      .execute();

    return { user: updatedUser.raw[0] };
  }

  // Delete User
  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteUser(@Ctx() { req, res }: Context): Promise<Boolean> {
    const { userId } = req.session;

    // Get note ids of current user
    const notes = await getManager()
      .createQueryBuilder(Note, "note")
      .where(`note.authorId = ${userId}`)
      .getMany();

    const noteIds = notes.map((n: { _id: number }) => n._id);

    console.log(noteIds);

    if (noteIds.length) {
      // Delete all Views (from notes and user)
      await getManager()
        .createQueryBuilder(Views, "views")
        .delete()
        .where(`views."noteId" IN (:...noteIds)`, { noteIds })
        .execute();
      await Views.delete({ userId: userId });

      // Delete all Stickers (from notes and user)
      await getManager()
        .createQueryBuilder(Sticker, "sticker")
        .delete()
        .where(`sticker."noteId" IN (:...noteIds)`, { noteIds })
        .execute();
      await Sticker.delete({ userId: userId });

      // Delete all Saves (from notes and user)
      await getManager()
        .createQueryBuilder(Save, "save")
        .delete()
        .where(`save."noteId" IN (:...noteIds)`, { noteIds })
        .execute();
      await Save.delete({ userId: userId });

      // Delete all notes from this user
      await getManager()
        .createQueryBuilder(Note, "note")
        .delete()
        .where(`note._id IN (:...noteIds)`, { noteIds })
        .execute();

      // Delete all Comments (from notes)
      await getManager()
        .createQueryBuilder(Comment, "comment")
        .delete()
        .where(`comment."noteId" IN (:...noteIds)`, { noteIds })
        .execute();
    }

    // Change all comments to authorId: [deleted] | 0, and text: [deleted]
    await getConnection()
      .createQueryBuilder()
      .update(Comment)
      .set({ text: "[deleted]", authorId: 0 })
      .where("authorId = :authorId", {
        authorId: userId,
      })
      .execute();

    // Delete all follows
    await Follow.delete({ followerId: userId });
    await Follow.delete({ followingId: userId });

    // Delete all Block
    await Block.delete({ blockedId: userId });
    await Block.delete({ blockerId: userId });

    // Delete user
    await User.delete({ _id: userId });

    return new Promise((resolve) =>
      // Kill session and die
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }

  // Register User
  // Recieves RegisterInput
  // Returns UserResponse
  @Mutation(() => UserResponse)
  async registerUser(
    @Arg("input") input: RegisterInput,
    @Ctx() { req, redis }: Context
  ): Promise<UserResponse> {
    // Validate user input
    // Fix later
    const errors = validateRegisterInput(input);
    if (errors) {
      return { errors };
    }

    let user;

    // Hash the password
    const hashedPassword = await argon2.hash(input.password);

    // Create user
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(User)
        .values({
          email: input.email,
          username: input.username,
          password: hashedPassword,
          avatarURL: `https://avatars.dicebear.com/api/jdenticon/${input.username}.svg`,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (err) {
      if (err.detail.includes("username")) {
        return {
          errors: [
            {
              field: "username",
              message: "username has already been taken",
            },
          ],
        };
      }
      if (err.detail.includes("email")) {
        return {
          errors: [
            {
              field: "email",
              message: "email has already been taken",
            },
          ],
        };
      }
    }

    const token = v4();
    const text = `<a href="${process.env.CORS_ORIGIN}/verify-email/${token}">verify your email</a>`;

    await redis.set(
      VERIFY_EMAIL_PREFIX + token,
      user._id,
      "ex",
      1000 * 60 * 60 * 24
    );

    await sendEmail(input.email, text, "Verify your email");

    // Store user id session
    // This will set a cookie on the user
    // Keep user logged in
    req.session.userId = user._id;

    return { user };
  }

  // Login User
  // Recieves LoginInput
  // Returns UserResponse
  @Mutation(() => UserResponse)
  async loginUser(
    @Arg("input") input: LoginInput,
    @Ctx() { req }: Context
  ): Promise<UserResponse> {
    // Validate input
    const errors = validateLoginInput(input);
    if (errors) {
      return { errors };
    }

    // Get user by username
    const user = await User.findOne(
      input.emailOrUsername.includes("@")
        ? { where: { email: input.emailOrUsername } }
        : { where: { username: input.emailOrUsername } }
    );

    // Check if user exist
    if (!user) {
      return {
        errors: [
          {
            field: "emailOrUsername",
            message: "That user doesn't exist",
          },
        ],
      };
    }

    // Verify users password
    const valid = await argon2.verify(user.password, input.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Password is incorrect",
          },
        ],
      };
    }

    // Store user id session (Login user)
    req.session.userId = user._id;

    return { user };
  }

  // Logout User
  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: Context) {
    return new Promise((resolve) =>
      // Kill session and die
      req.session.destroy((err) => {
        res.clearCookie(COOKIE_NAME);
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
