import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSlideDetailBlog1788254709454 implements MigrationInterface {
  name = 'AddSlideDetailBlog1788254709454';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "slide_detail_blog" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "slide_id" uuid NOT NULL, "title" character varying(255) NOT NULL, "subtitle" text, "slug" character varying(255) NOT NULL, "excerpt" text, "hero_image_url" character varying(500), "hero_image_file_id" character varying, "seo_title" character varying(255), "meta_description" character varying(500), "content" jsonb NOT NULL DEFAULT '{"version":1,"blocks":[]}', "is_published" boolean NOT NULL DEFAULT false, "published_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_34c9f15ec251efe1600accbe298" UNIQUE ("slug"), CONSTRAINT "REL_322db21c134a5431eec9ef3db1" UNIQUE ("slide_id"), CONSTRAINT "PK_009a38fb11f322427b911602934" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_slide_detail_blog_slide_id" ON "slide_detail_blog"  ("slide_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_slide_detail_blog_is_published" ON "slide_detail_blog"  ("is_published") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_slide_detail_blog_published_at" ON "slide_detail_blog"  ("published_at") `,
    );
    await queryRunner.query(
      `ALTER TABLE "slide_detail_blog" ADD CONSTRAINT "FK_322db21c134a5431eec9ef3db17" FOREIGN KEY ("slide_id") REFERENCES "slide"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "slide_detail_blog" DROP CONSTRAINT "FK_322db21c134a5431eec9ef3db17"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_slide_detail_blog_published_at"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_slide_detail_blog_is_published"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_slide_detail_blog_slide_id"`,
    );
    await queryRunner.query(`DROP TABLE "slide_detail_blog"`);
  }
}
