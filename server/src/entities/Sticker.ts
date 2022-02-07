import { Field } from "type-graphql";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Note } from "./Note";
import { User } from "./User";

@Entity()
export class Sticker extends BaseEntity {
  @Column({ type: "int" })
  value: number;

  @Field()
  @PrimaryColumn()
  userId: number;

  @ManyToOne(() => User, (user) => user.stickers)
  user: User;

  @Field()
  @PrimaryColumn()
  noteId: number;

  @ManyToOne(() => Note, (note) => note.stickers, {
    onDelete: "CASCADE",
  })
  note: Note;
}
