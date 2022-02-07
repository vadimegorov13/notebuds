import { Field, Int, ObjectType } from "type-graphql";
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
import { User } from "./User";
import { Comment } from "./Comment";
import { Save } from "./Save";
import { Views } from "./Views";
import { Sticker } from "./Sticker";

@ObjectType()
@Entity()
export class Note extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  _id!: number;

  @Field()
  @Column()
  title!: string;

  @Field()
  @Column()
  text!: string;

  @Field()
  @Column({ type: "boolean", default: false })
  isPrivate!: Boolean;

  @Field()
  @Column()
  tags: string;

  @Field()
  @Column()
  authorId: number;

  @Field(() => User, { nullable: true })
  @ManyToOne(() => User , (user) => user.notes, {
    onDelete: "CASCADE",
  })
  author: User | null;

  @Field()
  @Column({ type: "int", default: 0 })
  stickerPoints!: number;

  @Field(() => Int, { nullable: true })
  stickerPointStatus: number | null; // 1 or -1 or null

  @OneToMany(() => Sticker, (sticker) => sticker.note)
  stickers: Sticker[];

  @Field()
  @Column({ type: "int", default: 0 })
  viewsPoints: number;

  @OneToMany(() => Views, (views) => views.note)
  views: Views[];

  @OneToMany(() => Comment, (comment) => comment.note, { cascade: true })
  comments: Comment[];

  @Field()
  @Column({ type: "int", default: 0 })
  commentPoints!: number;

  @OneToMany(() => Save, (save) => save.note)
  saves: Save[];

  @Field()
  @Column({ type: "int", default: 0 })
  savePoints!: number;

  @Field(() => Int, { nullable: true })
  savePointStatus: number | null; // 1 or -1 or null

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
