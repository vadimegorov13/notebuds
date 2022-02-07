import { Field, Int, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Note } from "./Note";
import { Comment } from "./Comment";
import { Save } from "./Save";
import { UserNotification } from "./UserNotification";
import { Follow } from "./Follow";
import { Block } from "./Block";
import { Views } from "./Views";
import { Sticker } from "./Sticker";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  _id!: number;

  @Field()
  @Column({ unique: true })
  email!: string;

  @Field()
  @Column({ type: "boolean", default: false })
  isVerified!: Boolean;

  @Field()
  @Column({ unique: true })
  username!: string;

  @Column()
  password!: string;

  @Field()
  @Column()
  avatarURL!: string;

  @Field()
  @Column({ type: "int", default: 0 })
  followingPoints!: number;

  @Field()
  @Column({ type: "int", default: 0 })
  followPoints!: number;

  @Field(() => Int, { nullable: true })
  followPointStatus: number | null; // 1 or -1 or null

  @Field(() => Int, { nullable: true })
  blockPointStatus: number | null; // 1 or -1 or null

  // ========= Settings =========

  // Basic

  @Field()
  @Column({ default: "" })
  bio!: string;

  @Field()
  @Column({ default: "6d9886" })
  color!: string;

  // Work

  @Field()
  @Column({ default: "" })
  work!: string;

  @Field()
  @Column({ default: "" })
  education!: string;

  // Scope (Who can see your notes and comments)

  @Field()
  @Column({ type: "boolean", default: true })
  everyone!: Boolean;

  @Field()
  @Column({ type: "boolean", default: false })
  onlyFollowers!: Boolean;

  @Field()
  @Column({ type: "boolean", default: false })
  onlyFolowersYouFollow!: Boolean;

  // ========= Relations and date =========

  @OneToMany(() => Note, (note) => note.author, { cascade: true })
  notes: Note[];

  @OneToMany(() => Views, (views) => views.user)
  views: Views[];

  @OneToMany(() => Save, (save) => save.note)
  saves: Save[];

  @OneToMany(() => Sticker, (sticker) => sticker.user)
  stickers: Sticker[];

  @OneToMany(() => UserNotification, (notification) => notification.user)
  notifications: UserNotification[];

  @OneToMany(() => Comment, (comment) => comment.author, { cascade: true })
  comments: Comment[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => Block, (block) => block.blocked)
  blocker: Block[];

  @OneToMany(() => Block, (block) => block.blocker)
  blocked: Block[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
