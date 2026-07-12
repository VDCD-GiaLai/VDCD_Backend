import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUploadTemp1783858550679 implements MigrationInterface {
  name = 'AddUploadTemp1783858550679';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "upload_temp" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "file_id" character varying NOT NULL, "url" character varying NOT NULL, "file_path" character varying NOT NULL, "confirmed" boolean NOT NULL DEFAULT false, "uploaded_by" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0b13f3d7e1c57666924a84ee1fc" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "upload_temp"`);
  }
}
