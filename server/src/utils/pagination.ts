import { Field, ObjectType } from "type-graphql";
import { Note } from "../entities/Note";
import { User } from "../entities/User";
import { Comment } from "../entities/Comment";

@ObjectType()
export class NotePagination {
  @Field(() => [Note])
  notes: Note[];

  @Field()
  hasMore: boolean;
}

@ObjectType()
export class UserPagination {
  @Field(() => [User])
  users: User[];

  @Field()
  hasMore: boolean;
}

@ObjectType()
export class CommentPagination {
  @Field(() => [Comment])
  comments: Comment[];

  @Field()
  hasMore: boolean;
}
