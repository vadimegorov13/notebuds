import { pipe, tap } from "wonka";
import Router from "next/router";
import { Exchange } from "urql";

// If user is not authenticated open login page
export const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        if (error) {
          if (error?.message.includes("Not Authenticated")) {
            Router.replace("/login");
          }
        }
      })
    );
  };
