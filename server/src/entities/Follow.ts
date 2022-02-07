import { Field } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity()
export class Follow extends BaseEntity {
  @Column()
  value: number;

  @Field()
  @PrimaryColumn()
  followerId: number;

  @ManyToOne(() => User, (user) => user.following)
  follower: User;

  @Field()
  @PrimaryColumn()
  followingId: number;

  @ManyToOne(() => User, (user) => user.followers, { onDelete: "CASCADE" })
  following: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
