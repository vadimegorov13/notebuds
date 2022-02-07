import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Note } from "./Note";
import { User } from "./User";

@ObjectType()
@Entity()
export class Save extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @Field()
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.saves)
  user: User;

  @Field()
  @PrimaryColumn()
  noteId: number;

  @ManyToOne(() => Note, (note) => note.saves, {
      onDelete: "CASCADE"
  })
  note: Note;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
