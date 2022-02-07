import { Note } from "../entities/Note";
import { User } from "../entities/User";
import { Comment } from "../entities/Comment";
import { Field, ObjectType } from "type-graphql";

// Error object
@ObjectType()
class FieldError {
  @Field()
  field: string; // Name of field in a form

  @Field()
  message: string; // Error message
}

// User Response object
@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]; // Array of errors

  @Field(() => User, { nullable: true })
  user?: User; // User object
}

// Note Response object
@ObjectType()
export class NoteResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]; // Array of errors

  @Field(() => Note, { nullable: true })
  note?: Note; // Note object
}

// Comment Response object
@ObjectType()
export class CommentResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[]; // Array of errors

  @Field(() => Comment, { nullable: true })
  comment?: Comment; // Comment object
}
