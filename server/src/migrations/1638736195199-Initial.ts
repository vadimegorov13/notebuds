import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1638736195199 implements MigrationInterface {
    name = 'Initial1638736195199'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment" ("_id" SERIAL NOT NULL, "text" character varying NOT NULL, "isEdited" boolean NOT NULL DEFAULT false, "authorId" integer NOT NULL, "noteId" integer NOT NULL, "parentId" integer, "childrenIds" integer array, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "author_id" integer, "note_id" integer, "parent_id" integer, CONSTRAINT "PK_f069f9101854625792dca32f117" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "save" ("value" integer NOT NULL, "userId" integer NOT NULL, "noteId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "note_id" integer, CONSTRAINT "PK_ef7c13400aefabc15d1205fe3fb" PRIMARY KEY ("userId", "noteId"))`);
        await queryRunner.query(`CREATE TABLE "views" ("userId" integer NOT NULL, "noteId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "note_id" integer, CONSTRAINT "PK_ae72b0719ea7f8b6571c8926e73" PRIMARY KEY ("userId", "noteId"))`);
        await queryRunner.query(`CREATE TABLE "sticker" ("value" integer NOT NULL, "userId" integer NOT NULL, "noteId" integer NOT NULL, "user_id" integer, "note_id" integer, CONSTRAINT "PK_704fbe85ca7f6299189ad2a2d99" PRIMARY KEY ("userId", "noteId"))`);
        await queryRunner.query(`CREATE TABLE "note" ("_id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" character varying NOT NULL, "isPrivate" boolean NOT NULL DEFAULT false, "tags" character varying NOT NULL, "authorId" integer NOT NULL, "stickerPoints" integer NOT NULL DEFAULT '0', "viewsPoints" integer NOT NULL DEFAULT '0', "commentPoints" integer NOT NULL DEFAULT '0', "savePoints" integer NOT NULL DEFAULT '0', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "author_id" integer, CONSTRAINT "PK_d07e262d28829f128110315c468" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "user_notification" ("_id" SERIAL NOT NULL, "message" character varying NOT NULL, "userId" integer NOT NULL, "isRead" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_16dc11833fb850d49bb90e1e19b" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "follow" ("value" integer NOT NULL, "followerId" integer NOT NULL, "followingId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "follower_id" integer, "following_id" integer, CONSTRAINT "PK_2952595a5bec0052c5da0751cca" PRIMARY KEY ("followerId", "followingId"))`);
        await queryRunner.query(`CREATE TABLE "user" ("_id" SERIAL NOT NULL, "email" character varying NOT NULL, "isVerified" boolean NOT NULL DEFAULT false, "username" character varying NOT NULL, "password" character varying NOT NULL, "avatarURL" character varying NOT NULL, "followingPoints" integer NOT NULL DEFAULT '0', "followPoints" integer NOT NULL DEFAULT '0', "bio" character varying NOT NULL DEFAULT '', "color" character varying NOT NULL DEFAULT '6d9886', "work" character varying NOT NULL DEFAULT '', "education" character varying NOT NULL DEFAULT '', "everyone" boolean NOT NULL DEFAULT true, "onlyFollowers" boolean NOT NULL DEFAULT false, "onlyFolowersYouFollow" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_457bfa3e35350a716846b03102d" PRIMARY KEY ("_id"))`);
        await queryRunner.query(`CREATE TABLE "block" ("value" integer NOT NULL, "blockerId" integer NOT NULL, "blockedId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "blocker_id" integer, "blocked_id" integer, CONSTRAINT "PK_f147961a77e760d035e5cb1f33a" PRIMARY KEY ("blockerId", "blockedId"))`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_3ce66469b26697baa097f8da923" FOREIGN KEY ("author_id") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_36743024b2599b83514a63bb707" FOREIGN KEY ("note_id") REFERENCES "note"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_8bd8d0985c0d077c8129fb4a209" FOREIGN KEY ("parent_id") REFERENCES "comment"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "save" ADD CONSTRAINT "FK_75ce40c6f504e2057cab79b2852" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "save" ADD CONSTRAINT "FK_e5a468c1282f06d07ef449336eb" FOREIGN KEY ("note_id") REFERENCES "note"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "views" ADD CONSTRAINT "FK_5a616073aea982ac9a6c5eb40d1" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "views" ADD CONSTRAINT "FK_54636d58bcde7d438fd0e79655a" FOREIGN KEY ("note_id") REFERENCES "note"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sticker" ADD CONSTRAINT "FK_6131af8cd1cb6c77355f84fac2b" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "sticker" ADD CONSTRAINT "FK_aaaf3ff20bfd26ff8440f8c51d2" FOREIGN KEY ("note_id") REFERENCES "note"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "note" ADD CONSTRAINT "FK_665a6b343c55b13e2aba74ef613" FOREIGN KEY ("author_id") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_notification" ADD CONSTRAINT "FK_ed67d2f825f4103de44ec3b6ba7" FOREIGN KEY ("user_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_e65ef3268d3d5589f94b09c2373" FOREIGN KEY ("follower_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "follow" ADD CONSTRAINT "FK_7e66760f06ef2ca5eb43109d1cc" FOREIGN KEY ("following_id") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "FK_e96dbaa5b3dc8bd0ef0f940e344" FOREIGN KEY ("blocker_id") REFERENCES "user"("_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "block" ADD CONSTRAINT "FK_4353c9a65f9fe5e90b89fde6d70" FOREIGN KEY ("blocked_id") REFERENCES "user"("_id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "FK_4353c9a65f9fe5e90b89fde6d70"`);
        await queryRunner.query(`ALTER TABLE "block" DROP CONSTRAINT "FK_e96dbaa5b3dc8bd0ef0f940e344"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_7e66760f06ef2ca5eb43109d1cc"`);
        await queryRunner.query(`ALTER TABLE "follow" DROP CONSTRAINT "FK_e65ef3268d3d5589f94b09c2373"`);
        await queryRunner.query(`ALTER TABLE "user_notification" DROP CONSTRAINT "FK_ed67d2f825f4103de44ec3b6ba7"`);
        await queryRunner.query(`ALTER TABLE "note" DROP CONSTRAINT "FK_665a6b343c55b13e2aba74ef613"`);
        await queryRunner.query(`ALTER TABLE "sticker" DROP CONSTRAINT "FK_aaaf3ff20bfd26ff8440f8c51d2"`);
        await queryRunner.query(`ALTER TABLE "sticker" DROP CONSTRAINT "FK_6131af8cd1cb6c77355f84fac2b"`);
        await queryRunner.query(`ALTER TABLE "views" DROP CONSTRAINT "FK_54636d58bcde7d438fd0e79655a"`);
        await queryRunner.query(`ALTER TABLE "views" DROP CONSTRAINT "FK_5a616073aea982ac9a6c5eb40d1"`);
        await queryRunner.query(`ALTER TABLE "save" DROP CONSTRAINT "FK_e5a468c1282f06d07ef449336eb"`);
        await queryRunner.query(`ALTER TABLE "save" DROP CONSTRAINT "FK_75ce40c6f504e2057cab79b2852"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_8bd8d0985c0d077c8129fb4a209"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_36743024b2599b83514a63bb707"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_3ce66469b26697baa097f8da923"`);
        await queryRunner.query(`DROP TABLE "block"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "follow"`);
        await queryRunner.query(`DROP TABLE "user_notification"`);
        await queryRunner.query(`DROP TABLE "note"`);
        await queryRunner.query(`DROP TABLE "sticker"`);
        await queryRunner.query(`DROP TABLE "views"`);
        await queryRunner.query(`DROP TABLE "save"`);
        await queryRunner.query(`DROP TABLE "comment"`);
    }

}
