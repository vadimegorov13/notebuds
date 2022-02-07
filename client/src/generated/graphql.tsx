import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Comment = {
  __typename?: 'Comment';
  _id: Scalars['Float'];
  author?: Maybe<User>;
  authorId: Scalars['Float'];
  children?: Maybe<Array<Comment>>;
  childrenIds?: Maybe<Array<Scalars['Float']>>;
  createdAt: Scalars['String'];
  isEdited: Scalars['Boolean'];
  noteId: Scalars['Float'];
  parent?: Maybe<Comment>;
  parentId?: Maybe<Scalars['Float']>;
  text: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type CommentInput = {
  noteId: Scalars['Float'];
  parentId?: Maybe<Scalars['Float']>;
  text: Scalars['String'];
};

export type CommentPagination = {
  __typename?: 'CommentPagination';
  comments: Array<Comment>;
  hasMore: Scalars['Boolean'];
};

export type CommentResponse = {
  __typename?: 'CommentResponse';
  comment?: Maybe<Comment>;
  errors?: Maybe<Array<FieldError>>;
};

export type EmailUpdateInput = {
  confirmNewEmail: Scalars['String'];
  email: Scalars['String'];
  newEmail: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type ForgotPasswordInput = {
  confirmPassword: Scalars['String'];
  newPassword: Scalars['String'];
  token: Scalars['String'];
};

export type LoginInput = {
  emailOrUsername: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  block: Scalars['Boolean'];
  createComment: CommentResponse;
  createNewPassword: UserResponse;
  createNote: NoteResponse;
  deleteComment: Scalars['Boolean'];
  deleteNote: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  follow: Scalars['Boolean'];
  forgotPassword: Scalars['Boolean'];
  loginUser: UserResponse;
  logout: Scalars['Boolean'];
  registerUser: UserResponse;
  save: Scalars['Boolean'];
  sticker: Scalars['Boolean'];
  updateComment: CommentResponse;
  updateEmail: UserResponse;
  updateNote: NoteResponse;
  updatePassword: UserResponse;
  updateProfile: UserResponse;
  updateScope: UserResponse;
  verifyEmail: Scalars['Boolean'];
};


export type MutationBlockArgs = {
  blockedId: Scalars['Int'];
  value: Scalars['Int'];
};


export type MutationCreateCommentArgs = {
  input: CommentInput;
};


export type MutationCreateNewPasswordArgs = {
  input: ForgotPasswordInput;
};


export type MutationCreateNoteArgs = {
  input: NoteInput;
};


export type MutationDeleteCommentArgs = {
  _id: Scalars['Int'];
};


export type MutationDeleteNoteArgs = {
  _id: Scalars['Int'];
};


export type MutationFollowArgs = {
  followingId: Scalars['Int'];
  value: Scalars['Int'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationLoginUserArgs = {
  input: LoginInput;
};


export type MutationRegisterUserArgs = {
  input: RegisterInput;
};


export type MutationSaveArgs = {
  noteId: Scalars['Int'];
  value: Scalars['Int'];
};


export type MutationStickerArgs = {
  noteId: Scalars['Int'];
  value: Scalars['Int'];
};


export type MutationUpdateCommentArgs = {
  _id: Scalars['Int'];
  text: Scalars['String'];
};


export type MutationUpdateEmailArgs = {
  input: EmailUpdateInput;
};


export type MutationUpdateNoteArgs = {
  _id: Scalars['Int'];
  input: NoteInput;
};


export type MutationUpdatePasswordArgs = {
  input: UpdatePasswordInput;
};


export type MutationUpdateProfileArgs = {
  input: ProfileUpdateInput;
};


export type MutationUpdateScopeArgs = {
  input: ScopeUpdateInput;
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
};

export type Note = {
  __typename?: 'Note';
  _id: Scalars['Float'];
  author?: Maybe<User>;
  authorId: Scalars['Float'];
  commentPoints: Scalars['Float'];
  createdAt: Scalars['String'];
  isPrivate: Scalars['Boolean'];
  savePointStatus?: Maybe<Scalars['Int']>;
  savePoints: Scalars['Float'];
  stickerPointStatus?: Maybe<Scalars['Int']>;
  stickerPoints: Scalars['Float'];
  tags: Scalars['String'];
  text: Scalars['String'];
  textSnippet: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
  viewsPoints: Scalars['Float'];
};

export type NoteInput = {
  isPrivate: Scalars['Boolean'];
  tags?: Maybe<Scalars['String']>;
  text: Scalars['String'];
  title: Scalars['String'];
};

export type NotePagination = {
  __typename?: 'NotePagination';
  hasMore: Scalars['Boolean'];
  notes: Array<Note>;
};

export type NoteResponse = {
  __typename?: 'NoteResponse';
  errors?: Maybe<Array<FieldError>>;
  note?: Maybe<Note>;
};

export type ProfileUpdateInput = {
  bio: Scalars['String'];
  color: Scalars['String'];
  education: Scalars['String'];
  work: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  blockedUsers: UserPagination;
  childComments: CommentPagination;
  comment?: Maybe<Comment>;
  findUser?: Maybe<User>;
  followedUsers: UserPagination;
  followingUsers: UserPagination;
  getAllUsers: UserPagination;
  me?: Maybe<User>;
  myNotes: NotePagination;
  myUpdatedNotes: NotePagination;
  note?: Maybe<Note>;
  noteComments: CommentPagination;
  notes: NotePagination;
  savedNotes: NotePagination;
  searchMyNotes: NotePagination;
  searchNotes: NotePagination;
  searchUsers: UserPagination;
  usersNotes: NotePagination;
};


export type QueryBlockedUsersArgs = {
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
};


export type QueryChildCommentsArgs = {
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
  parentId: Scalars['Int'];
};


export type QueryCommentArgs = {
  _id: Scalars['Int'];
};


export type QueryFindUserArgs = {
  username: Scalars['String'];
};


export type QueryFollowedUsersArgs = {
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
  userId: Scalars['Int'];
};


export type QueryFollowingUsersArgs = {
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
  userId: Scalars['Int'];
};


export type QueryGetAllUsersArgs = {
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
};


export type QueryMyNotesArgs = {
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
};


export type QueryMyUpdatedNotesArgs = {
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
};


export type QueryNoteArgs = {
  _id: Scalars['Int'];
};


export type QueryNoteCommentsArgs = {
  limit: Scalars['Int'];
  noteId: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
};


export type QueryNotesArgs = {
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
  userId?: Maybe<Scalars['Int']>;
};


export type QuerySavedNotesArgs = {
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
};


export type QuerySearchMyNotesArgs = {
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type QuerySearchNotesArgs = {
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type QuerySearchUsersArgs = {
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
  search?: Maybe<Scalars['String']>;
};


export type QueryUsersNotesArgs = {
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
  userId: Scalars['Int'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type ScopeUpdateInput = {
  everyone: Scalars['Boolean'];
  onlyFollowers: Scalars['Boolean'];
  onlyFolowersYouFollow: Scalars['Boolean'];
};

export type UpdatePasswordInput = {
  confirmPassword: Scalars['String'];
  newPassword: Scalars['String'];
  password: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['Float'];
  avatarURL: Scalars['String'];
  bio: Scalars['String'];
  blockPointStatus?: Maybe<Scalars['Int']>;
  color: Scalars['String'];
  createdAt: Scalars['String'];
  education: Scalars['String'];
  email: Scalars['String'];
  everyone: Scalars['Boolean'];
  followPointStatus?: Maybe<Scalars['Int']>;
  followPoints: Scalars['Float'];
  followingPoints: Scalars['Float'];
  isVerified: Scalars['Boolean'];
  onlyFollowers: Scalars['Boolean'];
  onlyFolowersYouFollow: Scalars['Boolean'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
  work: Scalars['String'];
};

export type UserPagination = {
  __typename?: 'UserPagination';
  hasMore: Scalars['Boolean'];
  users: Array<User>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type CommentParametersFragment = { __typename?: 'Comment', _id: number, noteId: number, text: string, isEdited: boolean, createdAt: string, updatedAt: string, parentId?: Maybe<number>, childrenIds?: Maybe<Array<number>>, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }>, parent?: Maybe<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>, children?: Maybe<Array<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>> };

export type CommentResponseParametersFragment = { __typename?: 'CommentResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, comment?: Maybe<{ __typename?: 'Comment', _id: number, noteId: number, text: string, isEdited: boolean, createdAt: string, updatedAt: string, parentId?: Maybe<number>, childrenIds?: Maybe<Array<number>>, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }>, parent?: Maybe<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>, children?: Maybe<Array<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>> }> };

export type ErrorParametersFragment = { __typename?: 'FieldError', field: string, message: string };

export type NoteParametersFragment = { __typename?: 'Note', _id: number, title: string, text: string, textSnippet: string, isPrivate: boolean, tags: string, commentPoints: number, viewsPoints: number, stickerPointStatus?: Maybe<number>, stickerPoints: number, savePoints: number, savePointStatus?: Maybe<number>, authorId: number, createdAt: string, updatedAt: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> };

export type NoteResponseParametersFragment = { __typename?: 'NoteResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, note?: Maybe<{ __typename?: 'Note', _id: number, title: string, text: string, textSnippet: string, isPrivate: boolean, tags: string, commentPoints: number, viewsPoints: number, stickerPointStatus?: Maybe<number>, stickerPoints: number, savePoints: number, savePointStatus?: Maybe<number>, authorId: number, createdAt: string, updatedAt: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }> };

export type UserParametersFragment = { __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string };

export type UserResponseParametersFragment = { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> };

export type BlockUserMutationVariables = Exact<{
  blockedId: Scalars['Int'];
  value: Scalars['Int'];
}>;


export type BlockUserMutation = { __typename?: 'Mutation', block: boolean };

export type CreateCommentMutationVariables = Exact<{
  input: CommentInput;
}>;


export type CreateCommentMutation = { __typename?: 'Mutation', createComment: { __typename?: 'CommentResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, comment?: Maybe<{ __typename?: 'Comment', _id: number, noteId: number, text: string, isEdited: boolean, createdAt: string, updatedAt: string, parentId?: Maybe<number>, childrenIds?: Maybe<Array<number>>, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }>, parent?: Maybe<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>, children?: Maybe<Array<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>> }> } };

export type CreateNewPasswordMutationVariables = Exact<{
  input: ForgotPasswordInput;
}>;


export type CreateNewPasswordMutation = { __typename?: 'Mutation', createNewPassword: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> } };

export type CreateNoteMutationVariables = Exact<{
  input: NoteInput;
}>;


export type CreateNoteMutation = { __typename?: 'Mutation', createNote: { __typename?: 'NoteResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, note?: Maybe<{ __typename?: 'Note', _id: number, title: string, text: string, textSnippet: string, isPrivate: boolean, tags: string, commentPoints: number, viewsPoints: number, stickerPointStatus?: Maybe<number>, stickerPoints: number, savePoints: number, savePointStatus?: Maybe<number>, authorId: number, createdAt: string, updatedAt: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }> } };

export type DeleteCommentMutationVariables = Exact<{
  _id: Scalars['Int'];
}>;


export type DeleteCommentMutation = { __typename?: 'Mutation', deleteComment: boolean };

export type DeleteNoteMutationVariables = Exact<{
  _id: Scalars['Int'];
}>;


export type DeleteNoteMutation = { __typename?: 'Mutation', deleteNote: boolean };

export type DeleteUserMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type FollowUserMutationVariables = Exact<{
  followingId: Scalars['Int'];
  value: Scalars['Int'];
}>;


export type FollowUserMutation = { __typename?: 'Mutation', follow: boolean };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', loginUser: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> } };

export type SaveNoteMutationVariables = Exact<{
  noteId: Scalars['Int'];
  value: Scalars['Int'];
}>;


export type SaveNoteMutation = { __typename?: 'Mutation', save: boolean };

export type StickerNoteMutationVariables = Exact<{
  noteId: Scalars['Int'];
  value: Scalars['Int'];
}>;


export type StickerNoteMutation = { __typename?: 'Mutation', sticker: boolean };

export type UpdateCommentMutationVariables = Exact<{
  _id: Scalars['Int'];
  text: Scalars['String'];
}>;


export type UpdateCommentMutation = { __typename?: 'Mutation', updateComment: { __typename?: 'CommentResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, comment?: Maybe<{ __typename?: 'Comment', _id: number, noteId: number, text: string, isEdited: boolean, createdAt: string, updatedAt: string, parentId?: Maybe<number>, childrenIds?: Maybe<Array<number>>, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }>, parent?: Maybe<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>, children?: Maybe<Array<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>> }> } };

export type UpdateEmailMutationVariables = Exact<{
  input: EmailUpdateInput;
}>;


export type UpdateEmailMutation = { __typename?: 'Mutation', updateEmail: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> } };

export type UpdateNoteMutationVariables = Exact<{
  _id: Scalars['Int'];
  input: NoteInput;
}>;


export type UpdateNoteMutation = { __typename?: 'Mutation', updateNote: { __typename?: 'NoteResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, note?: Maybe<{ __typename?: 'Note', _id: number, title: string, text: string, textSnippet: string, isPrivate: boolean, tags: string, commentPoints: number, viewsPoints: number, stickerPointStatus?: Maybe<number>, stickerPoints: number, savePoints: number, savePointStatus?: Maybe<number>, authorId: number, createdAt: string, updatedAt: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }> } };

export type UpdatePasswordMutationVariables = Exact<{
  input: UpdatePasswordInput;
}>;


export type UpdatePasswordMutation = { __typename?: 'Mutation', updatePassword: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> } };

export type UpdateProfileMutationVariables = Exact<{
  input: ProfileUpdateInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> } };

export type UpdateScopeMutationVariables = Exact<{
  input: ScopeUpdateInput;
}>;


export type UpdateScopeMutation = { __typename?: 'Mutation', updateScope: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> } };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: boolean };

export type BlockedUsersQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type BlockedUsersQuery = { __typename?: 'Query', blockedUsers: { __typename?: 'UserPagination', hasMore: boolean, users: Array<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> } };

export type FindUserQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type FindUserQuery = { __typename?: 'Query', findUser?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> };

export type FollowedUsersQueryVariables = Exact<{
  userId: Scalars['Int'];
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type FollowedUsersQuery = { __typename?: 'Query', followedUsers: { __typename?: 'UserPagination', hasMore: boolean, users: Array<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> } };

export type FollowingUsersQueryVariables = Exact<{
  userId: Scalars['Int'];
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type FollowingUsersQuery = { __typename?: 'Query', followingUsers: { __typename?: 'UserPagination', hasMore: boolean, users: Array<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> } };

export type GetAllUsersQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: { __typename?: 'UserPagination', hasMore: boolean, users: Array<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> } };

export type GetCommentQueryVariables = Exact<{
  _id: Scalars['Int'];
}>;


export type GetCommentQuery = { __typename?: 'Query', comment?: Maybe<{ __typename?: 'Comment', _id: number, noteId: number, text: string, isEdited: boolean, createdAt: string, updatedAt: string, parentId?: Maybe<number>, childrenIds?: Maybe<Array<number>>, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }>, parent?: Maybe<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>, children?: Maybe<Array<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>> }> };

export type GetCommentRepliesQueryVariables = Exact<{
  parentId: Scalars['Int'];
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type GetCommentRepliesQuery = { __typename?: 'Query', childComments: { __typename?: 'CommentPagination', hasMore: boolean, comments: Array<{ __typename?: 'Comment', _id: number, noteId: number, text: string, isEdited: boolean, createdAt: string, updatedAt: string, parentId?: Maybe<number>, childrenIds?: Maybe<Array<number>>, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }>, parent?: Maybe<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>, children?: Maybe<Array<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>> }> } };

export type GetNoteQueryVariables = Exact<{
  _id: Scalars['Int'];
}>;


export type GetNoteQuery = { __typename?: 'Query', note?: Maybe<{ __typename?: 'Note', _id: number, title: string, text: string, textSnippet: string, isPrivate: boolean, tags: string, commentPoints: number, viewsPoints: number, stickerPointStatus?: Maybe<number>, stickerPoints: number, savePoints: number, savePointStatus?: Maybe<number>, authorId: number, createdAt: string, updatedAt: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }> };

export type GetNoteCommentsQueryVariables = Exact<{
  noteId: Scalars['Int'];
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type GetNoteCommentsQuery = { __typename?: 'Query', noteComments: { __typename?: 'CommentPagination', hasMore: boolean, comments: Array<{ __typename?: 'Comment', _id: number, noteId: number, text: string, isEdited: boolean, createdAt: string, updatedAt: string, parentId?: Maybe<number>, childrenIds?: Maybe<Array<number>>, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }>, parent?: Maybe<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>, children?: Maybe<Array<{ __typename?: 'Comment', _id: number, text: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }>> }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: Maybe<{ __typename?: 'User', everyone: boolean, onlyFollowers: boolean, onlyFolowersYouFollow: boolean, _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> };

export type MyNotesQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type MyNotesQuery = { __typename?: 'Query', myNotes: { __typename?: 'NotePagination', hasMore: boolean, notes: Array<{ __typename?: 'Note', _id: number, title: string, text: string, textSnippet: string, isPrivate: boolean, tags: string, commentPoints: number, viewsPoints: number, stickerPointStatus?: Maybe<number>, stickerPoints: number, savePoints: number, savePointStatus?: Maybe<number>, authorId: number, createdAt: string, updatedAt: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }> } };

export type MyUpdatedNotesQueryVariables = Exact<{
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type MyUpdatedNotesQuery = { __typename?: 'Query', myUpdatedNotes: { __typename?: 'NotePagination', hasMore: boolean, notes: Array<{ __typename?: 'Note', _id: number, title: string, text: string, textSnippet: string, isPrivate: boolean, tags: string, commentPoints: number, viewsPoints: number, stickerPointStatus?: Maybe<number>, stickerPoints: number, savePoints: number, savePointStatus?: Maybe<number>, authorId: number, createdAt: string, updatedAt: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }> } };

export type NotesQueryVariables = Exact<{
  userId?: Maybe<Scalars['Int']>;
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type NotesQuery = { __typename?: 'Query', notes: { __typename?: 'NotePagination', hasMore: boolean, notes: Array<{ __typename?: 'Note', _id: number, title: string, text: string, textSnippet: string, isPrivate: boolean, tags: string, commentPoints: number, viewsPoints: number, stickerPointStatus?: Maybe<number>, stickerPoints: number, savePoints: number, savePointStatus?: Maybe<number>, authorId: number, createdAt: string, updatedAt: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }> } };

export type SavedNotesQueryVariables = Exact<{
  limit: Scalars['Int'];
}>;


export type SavedNotesQuery = { __typename?: 'Query', savedNotes: { __typename?: 'NotePagination', hasMore: boolean, notes: Array<{ __typename?: 'Note', _id: number, title: string, text: string, textSnippet: string, isPrivate: boolean, tags: string, commentPoints: number, viewsPoints: number, stickerPointStatus?: Maybe<number>, stickerPoints: number, savePoints: number, savePointStatus?: Maybe<number>, authorId: number, createdAt: string, updatedAt: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }> } };

export type SearchMyNotesQueryVariables = Exact<{
  search?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type SearchMyNotesQuery = { __typename?: 'Query', searchMyNotes: { __typename?: 'NotePagination', hasMore: boolean, notes: Array<{ __typename?: 'Note', _id: number, title: string, text: string, textSnippet: string, isPrivate: boolean, tags: string, commentPoints: number, viewsPoints: number, stickerPointStatus?: Maybe<number>, stickerPoints: number, savePoints: number, savePointStatus?: Maybe<number>, authorId: number, createdAt: string, updatedAt: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }> } };

export type SearchNotesQueryVariables = Exact<{
  search?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type SearchNotesQuery = { __typename?: 'Query', searchNotes: { __typename?: 'NotePagination', hasMore: boolean, notes: Array<{ __typename?: 'Note', _id: number, title: string, text: string, textSnippet: string, isPrivate: boolean, tags: string, commentPoints: number, viewsPoints: number, stickerPointStatus?: Maybe<number>, stickerPoints: number, savePoints: number, savePointStatus?: Maybe<number>, authorId: number, createdAt: string, updatedAt: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }> } };

export type SearchUsersQueryVariables = Exact<{
  search?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: { __typename?: 'UserPagination', hasMore: boolean, users: Array<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> } };

export type UsersNotesQueryVariables = Exact<{
  userId: Scalars['Int'];
  limit: Scalars['Int'];
  offset?: Maybe<Scalars['Int']>;
}>;


export type UsersNotesQuery = { __typename?: 'Query', usersNotes: { __typename?: 'NotePagination', hasMore: boolean, notes: Array<{ __typename?: 'Note', _id: number, title: string, text: string, textSnippet: string, isPrivate: boolean, tags: string, commentPoints: number, viewsPoints: number, stickerPointStatus?: Maybe<number>, stickerPoints: number, savePoints: number, savePointStatus?: Maybe<number>, authorId: number, createdAt: string, updatedAt: string, author?: Maybe<{ __typename?: 'User', _id: number, username: string, email: string, avatarURL: string, followPoints: number, followingPoints: number, followPointStatus?: Maybe<number>, blockPointStatus?: Maybe<number>, bio: string, color: string, work: string, education: string, createdAt: string, updatedAt: string }> }> } };

export const ErrorParametersFragmentDoc = gql`
    fragment ErrorParameters on FieldError {
  field
  message
}
    `;
export const UserParametersFragmentDoc = gql`
    fragment UserParameters on User {
  _id
  username
  email
  avatarURL
  followPoints
  followingPoints
  followPointStatus
  blockPointStatus
  bio
  color
  work
  education
  createdAt
  updatedAt
}
    `;
export const CommentParametersFragmentDoc = gql`
    fragment CommentParameters on Comment {
  _id
  noteId
  text
  isEdited
  createdAt
  updatedAt
  author {
    ...UserParameters
  }
  parentId
  parent {
    _id
    text
    author {
      ...UserParameters
    }
  }
  childrenIds
  children {
    _id
    text
    author {
      ...UserParameters
    }
  }
}
    ${UserParametersFragmentDoc}`;
export const CommentResponseParametersFragmentDoc = gql`
    fragment CommentResponseParameters on CommentResponse {
  errors {
    ...ErrorParameters
  }
  comment {
    ...CommentParameters
  }
}
    ${ErrorParametersFragmentDoc}
${CommentParametersFragmentDoc}`;
export const NoteParametersFragmentDoc = gql`
    fragment NoteParameters on Note {
  _id
  title
  text
  textSnippet
  isPrivate
  tags
  commentPoints
  viewsPoints
  stickerPointStatus
  stickerPoints
  savePoints
  savePointStatus
  authorId
  author {
    ...UserParameters
  }
  createdAt
  updatedAt
}
    ${UserParametersFragmentDoc}`;
export const NoteResponseParametersFragmentDoc = gql`
    fragment NoteResponseParameters on NoteResponse {
  errors {
    ...ErrorParameters
  }
  note {
    ...NoteParameters
  }
}
    ${ErrorParametersFragmentDoc}
${NoteParametersFragmentDoc}`;
export const UserResponseParametersFragmentDoc = gql`
    fragment UserResponseParameters on UserResponse {
  errors {
    ...ErrorParameters
  }
  user {
    ...UserParameters
  }
}
    ${ErrorParametersFragmentDoc}
${UserParametersFragmentDoc}`;
export const BlockUserDocument = gql`
    mutation BlockUser($blockedId: Int!, $value: Int!) {
  block(blockedId: $blockedId, value: $value)
}
    `;

export function useBlockUserMutation() {
  return Urql.useMutation<BlockUserMutation, BlockUserMutationVariables>(BlockUserDocument);
};
export const CreateCommentDocument = gql`
    mutation CreateComment($input: CommentInput!) {
  createComment(input: $input) {
    ...CommentResponseParameters
  }
}
    ${CommentResponseParametersFragmentDoc}`;

export function useCreateCommentMutation() {
  return Urql.useMutation<CreateCommentMutation, CreateCommentMutationVariables>(CreateCommentDocument);
};
export const CreateNewPasswordDocument = gql`
    mutation CreateNewPassword($input: ForgotPasswordInput!) {
  createNewPassword(input: $input) {
    ...UserResponseParameters
  }
}
    ${UserResponseParametersFragmentDoc}`;

export function useCreateNewPasswordMutation() {
  return Urql.useMutation<CreateNewPasswordMutation, CreateNewPasswordMutationVariables>(CreateNewPasswordDocument);
};
export const CreateNoteDocument = gql`
    mutation CreateNote($input: NoteInput!) {
  createNote(input: $input) {
    ...NoteResponseParameters
  }
}
    ${NoteResponseParametersFragmentDoc}`;

export function useCreateNoteMutation() {
  return Urql.useMutation<CreateNoteMutation, CreateNoteMutationVariables>(CreateNoteDocument);
};
export const DeleteCommentDocument = gql`
    mutation DeleteComment($_id: Int!) {
  deleteComment(_id: $_id)
}
    `;

export function useDeleteCommentMutation() {
  return Urql.useMutation<DeleteCommentMutation, DeleteCommentMutationVariables>(DeleteCommentDocument);
};
export const DeleteNoteDocument = gql`
    mutation DeleteNote($_id: Int!) {
  deleteNote(_id: $_id)
}
    `;

export function useDeleteNoteMutation() {
  return Urql.useMutation<DeleteNoteMutation, DeleteNoteMutationVariables>(DeleteNoteDocument);
};
export const DeleteUserDocument = gql`
    mutation DeleteUser {
  deleteUser
}
    `;

export function useDeleteUserMutation() {
  return Urql.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument);
};
export const FollowUserDocument = gql`
    mutation FollowUser($followingId: Int!, $value: Int!) {
  follow(followingId: $followingId, value: $value)
}
    `;

export function useFollowUserMutation() {
  return Urql.useMutation<FollowUserMutation, FollowUserMutationVariables>(FollowUserDocument);
};
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;

export function useForgotPasswordMutation() {
  return Urql.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  loginUser(input: $input) {
    ...UserResponseParameters
  }
}
    ${UserResponseParametersFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  registerUser(input: $input) {
    ...UserResponseParameters
  }
}
    ${UserResponseParametersFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
export const SaveNoteDocument = gql`
    mutation SaveNote($noteId: Int!, $value: Int!) {
  save(noteId: $noteId, value: $value)
}
    `;

export function useSaveNoteMutation() {
  return Urql.useMutation<SaveNoteMutation, SaveNoteMutationVariables>(SaveNoteDocument);
};
export const StickerNoteDocument = gql`
    mutation StickerNote($noteId: Int!, $value: Int!) {
  sticker(noteId: $noteId, value: $value)
}
    `;

export function useStickerNoteMutation() {
  return Urql.useMutation<StickerNoteMutation, StickerNoteMutationVariables>(StickerNoteDocument);
};
export const UpdateCommentDocument = gql`
    mutation UpdateComment($_id: Int!, $text: String!) {
  updateComment(_id: $_id, text: $text) {
    ...CommentResponseParameters
  }
}
    ${CommentResponseParametersFragmentDoc}`;

export function useUpdateCommentMutation() {
  return Urql.useMutation<UpdateCommentMutation, UpdateCommentMutationVariables>(UpdateCommentDocument);
};
export const UpdateEmailDocument = gql`
    mutation updateEmail($input: EmailUpdateInput!) {
  updateEmail(input: $input) {
    ...UserResponseParameters
  }
}
    ${UserResponseParametersFragmentDoc}`;

export function useUpdateEmailMutation() {
  return Urql.useMutation<UpdateEmailMutation, UpdateEmailMutationVariables>(UpdateEmailDocument);
};
export const UpdateNoteDocument = gql`
    mutation UpdateNote($_id: Int!, $input: NoteInput!) {
  updateNote(_id: $_id, input: $input) {
    ...NoteResponseParameters
  }
}
    ${NoteResponseParametersFragmentDoc}`;

export function useUpdateNoteMutation() {
  return Urql.useMutation<UpdateNoteMutation, UpdateNoteMutationVariables>(UpdateNoteDocument);
};
export const UpdatePasswordDocument = gql`
    mutation updatePassword($input: UpdatePasswordInput!) {
  updatePassword(input: $input) {
    ...UserResponseParameters
  }
}
    ${UserResponseParametersFragmentDoc}`;

export function useUpdatePasswordMutation() {
  return Urql.useMutation<UpdatePasswordMutation, UpdatePasswordMutationVariables>(UpdatePasswordDocument);
};
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($input: ProfileUpdateInput!) {
  updateProfile(input: $input) {
    ...UserResponseParameters
  }
}
    ${UserResponseParametersFragmentDoc}`;

export function useUpdateProfileMutation() {
  return Urql.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument);
};
export const UpdateScopeDocument = gql`
    mutation UpdateScope($input: ScopeUpdateInput!) {
  updateScope(input: $input) {
    ...UserResponseParameters
  }
}
    ${UserResponseParametersFragmentDoc}`;

export function useUpdateScopeMutation() {
  return Urql.useMutation<UpdateScopeMutation, UpdateScopeMutationVariables>(UpdateScopeDocument);
};
export const VerifyEmailDocument = gql`
    mutation verifyEmail($token: String!) {
  verifyEmail(token: $token)
}
    `;

export function useVerifyEmailMutation() {
  return Urql.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument);
};
export const BlockedUsersDocument = gql`
    query BlockedUsers($limit: Int!, $offset: Int) {
  blockedUsers(limit: $limit, offset: $offset) {
    users {
      ...UserParameters
    }
    hasMore
  }
}
    ${UserParametersFragmentDoc}`;

export function useBlockedUsersQuery(options: Omit<Urql.UseQueryArgs<BlockedUsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<BlockedUsersQuery>({ query: BlockedUsersDocument, ...options });
};
export const FindUserDocument = gql`
    query FindUser($username: String!) {
  findUser(username: $username) {
    ...UserParameters
  }
}
    ${UserParametersFragmentDoc}`;

export function useFindUserQuery(options: Omit<Urql.UseQueryArgs<FindUserQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<FindUserQuery>({ query: FindUserDocument, ...options });
};
export const FollowedUsersDocument = gql`
    query FollowedUsers($userId: Int!, $limit: Int!, $offset: Int) {
  followedUsers(userId: $userId, limit: $limit, offset: $offset) {
    users {
      ...UserParameters
    }
    hasMore
  }
}
    ${UserParametersFragmentDoc}`;

export function useFollowedUsersQuery(options: Omit<Urql.UseQueryArgs<FollowedUsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<FollowedUsersQuery>({ query: FollowedUsersDocument, ...options });
};
export const FollowingUsersDocument = gql`
    query FollowingUsers($userId: Int!, $limit: Int!, $offset: Int) {
  followingUsers(userId: $userId, limit: $limit, offset: $offset) {
    users {
      ...UserParameters
    }
    hasMore
  }
}
    ${UserParametersFragmentDoc}`;

export function useFollowingUsersQuery(options: Omit<Urql.UseQueryArgs<FollowingUsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<FollowingUsersQuery>({ query: FollowingUsersDocument, ...options });
};
export const GetAllUsersDocument = gql`
    query GetAllUsers($limit: Int!, $offset: Int) {
  getAllUsers(limit: $limit, offset: $offset) {
    users {
      ...UserParameters
    }
    hasMore
  }
}
    ${UserParametersFragmentDoc}`;

export function useGetAllUsersQuery(options: Omit<Urql.UseQueryArgs<GetAllUsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetAllUsersQuery>({ query: GetAllUsersDocument, ...options });
};
export const GetCommentDocument = gql`
    query GetComment($_id: Int!) {
  comment(_id: $_id) {
    ...CommentParameters
  }
}
    ${CommentParametersFragmentDoc}`;

export function useGetCommentQuery(options: Omit<Urql.UseQueryArgs<GetCommentQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetCommentQuery>({ query: GetCommentDocument, ...options });
};
export const GetCommentRepliesDocument = gql`
    query GetCommentReplies($parentId: Int!, $limit: Int!, $offset: Int) {
  childComments(parentId: $parentId, limit: $limit, offset: $offset) {
    comments {
      ...CommentParameters
    }
    hasMore
  }
}
    ${CommentParametersFragmentDoc}`;

export function useGetCommentRepliesQuery(options: Omit<Urql.UseQueryArgs<GetCommentRepliesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetCommentRepliesQuery>({ query: GetCommentRepliesDocument, ...options });
};
export const GetNoteDocument = gql`
    query GetNote($_id: Int!) {
  note(_id: $_id) {
    ...NoteParameters
  }
}
    ${NoteParametersFragmentDoc}`;

export function useGetNoteQuery(options: Omit<Urql.UseQueryArgs<GetNoteQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetNoteQuery>({ query: GetNoteDocument, ...options });
};
export const GetNoteCommentsDocument = gql`
    query GetNoteComments($noteId: Int!, $limit: Int!, $offset: Int) {
  noteComments(noteId: $noteId, limit: $limit, offset: $offset) {
    comments {
      ...CommentParameters
    }
    hasMore
  }
}
    ${CommentParametersFragmentDoc}`;

export function useGetNoteCommentsQuery(options: Omit<Urql.UseQueryArgs<GetNoteCommentsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<GetNoteCommentsQuery>({ query: GetNoteCommentsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...UserParameters
    everyone
    onlyFollowers
    onlyFolowersYouFollow
  }
}
    ${UserParametersFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const MyNotesDocument = gql`
    query myNotes($limit: Int!, $offset: Int) {
  myNotes(limit: $limit, offset: $offset) {
    notes {
      ...NoteParameters
    }
    hasMore
  }
}
    ${NoteParametersFragmentDoc}`;

export function useMyNotesQuery(options: Omit<Urql.UseQueryArgs<MyNotesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyNotesQuery>({ query: MyNotesDocument, ...options });
};
export const MyUpdatedNotesDocument = gql`
    query myUpdatedNotes($limit: Int!, $offset: Int) {
  myUpdatedNotes(limit: $limit, offset: $offset) {
    notes {
      ...NoteParameters
    }
    hasMore
  }
}
    ${NoteParametersFragmentDoc}`;

export function useMyUpdatedNotesQuery(options: Omit<Urql.UseQueryArgs<MyUpdatedNotesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MyUpdatedNotesQuery>({ query: MyUpdatedNotesDocument, ...options });
};
export const NotesDocument = gql`
    query Notes($userId: Int, $limit: Int!, $offset: Int) {
  notes(userId: $userId, limit: $limit, offset: $offset) {
    notes {
      ...NoteParameters
    }
    hasMore
  }
}
    ${NoteParametersFragmentDoc}`;

export function useNotesQuery(options: Omit<Urql.UseQueryArgs<NotesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<NotesQuery>({ query: NotesDocument, ...options });
};
export const SavedNotesDocument = gql`
    query SavedNotes($limit: Int!) {
  savedNotes(limit: $limit) {
    notes {
      ...NoteParameters
    }
    hasMore
  }
}
    ${NoteParametersFragmentDoc}`;

export function useSavedNotesQuery(options: Omit<Urql.UseQueryArgs<SavedNotesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SavedNotesQuery>({ query: SavedNotesDocument, ...options });
};
export const SearchMyNotesDocument = gql`
    query SearchMyNotes($search: String, $limit: Int!, $offset: Int) {
  searchMyNotes(search: $search, limit: $limit, offset: $offset) {
    notes {
      ...NoteParameters
    }
    hasMore
  }
}
    ${NoteParametersFragmentDoc}`;

export function useSearchMyNotesQuery(options: Omit<Urql.UseQueryArgs<SearchMyNotesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchMyNotesQuery>({ query: SearchMyNotesDocument, ...options });
};
export const SearchNotesDocument = gql`
    query SearchNotes($search: String, $limit: Int!, $offset: Int) {
  searchNotes(search: $search, limit: $limit, offset: $offset) {
    notes {
      ...NoteParameters
    }
    hasMore
  }
}
    ${NoteParametersFragmentDoc}`;

export function useSearchNotesQuery(options: Omit<Urql.UseQueryArgs<SearchNotesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchNotesQuery>({ query: SearchNotesDocument, ...options });
};
export const SearchUsersDocument = gql`
    query SearchUsers($search: String, $limit: Int!, $offset: Int) {
  searchUsers(search: $search, limit: $limit, offset: $offset) {
    users {
      ...UserParameters
    }
    hasMore
  }
}
    ${UserParametersFragmentDoc}`;

export function useSearchUsersQuery(options: Omit<Urql.UseQueryArgs<SearchUsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<SearchUsersQuery>({ query: SearchUsersDocument, ...options });
};
export const UsersNotesDocument = gql`
    query UsersNotes($userId: Int!, $limit: Int!, $offset: Int) {
  usersNotes(userId: $userId, limit: $limit, offset: $offset) {
    notes {
      ...NoteParameters
    }
    hasMore
  }
}
    ${NoteParametersFragmentDoc}`;

export function useUsersNotesQuery(options: Omit<Urql.UseQueryArgs<UsersNotesQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UsersNotesQuery>({ query: UsersNotesDocument, ...options });
};