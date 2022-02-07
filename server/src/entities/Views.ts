import { Field } from "type-graphql";
import { BaseEntity, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import {Note} from "./Note";
import {User} from "./User";

@Entity()
export class Views extends BaseEntity {
  @Field()
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.views)
  user: User;

  @Field()
  @PrimaryColumn()
  noteId: number;

  @ManyToOne(() => Note, (note) => note.views, {
    onDelete: "CASCADE",
  })
  note: Note;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
