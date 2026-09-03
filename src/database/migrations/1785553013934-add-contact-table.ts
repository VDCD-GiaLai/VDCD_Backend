import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContactTable1785553013934 implements MigrationInterface {
  name = 'AddContactTable1785553013934';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone" character varying(20), "subject" character varying, "message" text, "attachment" character varying, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE IF NOT EXISTS "page_banner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "page_key" character varying(50) NOT NULL, "title" character varying(255) NOT NULL, "subtitle" text, "tag" character varying(100), "image_url" character varying(500) NOT NULL, "image_file_id" character varying, "cta_buttons" jsonb, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ffbeb96e47682dd086b086cd6ec" UNIQUE ("page_key"), CONSTRAINT "PK_3213ba13cd1b908e2d581218eec" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "page_banner"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "contact"`);
  }
}
