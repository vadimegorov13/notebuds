import Context from "../types";
import { MiddlewareFn } from "type-graphql";
import { getManager } from "typeorm";
import { User } from "../entities/User";

// Check if user is logged in before executing resolver
const isVerified: MiddlewareFn<Context> = async ({ context }, next) => {
  const query = getManager()
    .createQueryBuilder(User, "user")
    .where(`user._id = :_id`, { _id: context.req.session.userId });

  const user = await query.getOne();

  if (user?.isVerified === false) {
    throw new Error("Email Not Verified");
  }

  return next();
};

export default isVerified;
