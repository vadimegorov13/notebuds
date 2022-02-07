import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Note } from "./Note";
import { User } from "./User";

@ObjectType()
@Entity()
export class Comment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  _id!: number;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({ type: "boolean", default: false })
  isEdited!: Boolean;

  @Field()
  @Column()
  authorId: number;

  @Field(() => User, {nullable: true})
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: "CASCADE",
  })
  author: User | null;

  @Field()
  @Column()
  noteId: number;

  @ManyToOne(() => Note, (note) => note.comments, {
    onDelete: "CASCADE",
  })
  note: Note;

  @Field({ nullable: true })
  @Column({ type: "int", nullable: true })
  parentId!: number;

  @Field(() => [Number], { nullable: true })
  @Column({ type: "int", nullable: true, array: true })
  childrenIds!: number[];

  @Field(() => Comment, { nullable: true })
  @ManyToOne(() => Comment, (comment) => comment.children, {
    onDelete: "CASCADE",
  })
  parent: Comment;

  @Field(() => [Comment], { nullable: true })
  @OneToMany(() => Comment, (comment) => comment.parent, {
    cascade: true,
  })
  children: Comment[];

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
