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
export class Block extends BaseEntity {
  @Column()
  value: number;

  @Field()
  @PrimaryColumn()
  blockerId: number;

  @ManyToOne(() => User, (user) => user.blocked)
  blocker: User;

  @Field()
  @PrimaryColumn()
  blockedId: number;

  @ManyToOne(() => User, (user) => user.blocker, { onDelete: "CASCADE" })
  blocked: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
