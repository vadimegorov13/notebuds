import Context from "../types";
import { MiddlewareFn } from "type-graphql";

// Check if user is logged in before executing resolver
const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  if (!context.req.session.userId) {
    throw new Error("Not Authenticated");
  }

  return next();
};

export default isAuth;
