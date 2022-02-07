import { Field, InputType } from "type-graphql";

// Input for Register form
@InputType()
export class RegisterInput {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  password: string;
}

// Input for Login form
@InputType()
export class LoginInput {
  @Field()
  emailOrUsername: string;

  @Field()
  password: string;
}

// Input for Note form
@InputType()
export class NoteInput {
  @Field()
  title: string;

  @Field()
  text: string;

  @Field()
  isPrivate: boolean;

  @Field({ nullable: true })
  tags?: string;
}

@InputType()
export class CommentInput {
  @Field()
  text: string;

  @Field()
  noteId: number;

  @Field({ nullable: true })
  parentId?: number;
}

@InputType()
export class ProfileUpdateInput {
  // Basic

  @Field()
  bio: string;

  @Field()
  color: string;

  // Work

  @Field()
  work: string;

  @Field()
  education: string;
}

// Input for Note form
@InputType()
export class EmailUpdateInput {
  @Field()
  email: string;

  @Field()
  newEmail: string;

  @Field()
  confirmNewEmail: string;
}

@InputType()
export class ScopeUpdateInput {
  // Scope (Who can see your notes and comments)

  @Field()
  everyone: Boolean;

  @Field()
  onlyFollowers: Boolean;

  @Field()
  onlyFolowersYouFollow: Boolean;
}

@InputType()
export class UpdatePasswordInput {
  // Change Password

  @Field()
  password: string;

  @Field()
  newPassword: string;

  @Field()
  confirmPassword: string;
}

@InputType()
export class ForgotPasswordInput {
  // Change Password
  @Field()
  token: string;

  @Field()
  newPassword: string;

  @Field()
  confirmPassword: string;
}
