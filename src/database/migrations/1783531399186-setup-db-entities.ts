import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupDbEntities1783531399186 implements MigrationInterface {
  name = 'SetupDbEntities1783531399186';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "operation_field" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "slug" character varying NOT NULL, "icon" character varying, "short_description" text, "order" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_eded71b9291f3832a448e42828c" UNIQUE ("slug"), CONSTRAINT "PK_9907a824daf7e4613f8f050b476" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "province" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(100) NOT NULL, "code" character varying(10) NOT NULL, "has_project" boolean NOT NULL DEFAULT false, "center_count" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_3288dfa18d390ed33b359fc0418" UNIQUE ("code"), CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project_image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "caption" character varying, "order" integer NOT NULL DEFAULT '0', "project_id" uuid, CONSTRAINT "PK_09b0ab9ec6330049e8a59289e32" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "project" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying NOT NULL, "overview" text, "thumbnail" character varying, "year" integer, "meta_title" character varying(60), "meta_description" character varying(160), "is_published" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "field_id" uuid, "province_id" uuid, CONSTRAINT "UQ_6fce32ddd71197807027be6ad38" UNIQUE ("slug"), CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "program" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying NOT NULL, "short_description" text, "content" text, "thumbnail" character varying, "meta_title" character varying(60), "meta_description" character varying(160), "is_published" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "field_id" uuid, CONSTRAINT "UQ_47cad5c026f06153b40724baffe" UNIQUE ("slug"), CONSTRAINT "PK_3bade5945afbafefdd26a3a29fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "solution" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying NOT NULL, "short_description" text, "content" text, "thumbnail" character varying, "meta_title" character varying(60), "meta_description" character varying(160), "is_published" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "field_id" uuid, CONSTRAINT "UQ_6fa2968495e0cfe1ff6d35b6adc" UNIQUE ("slug"), CONSTRAINT "PK_73fc40b114205776818a2f2f248" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "article" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying NOT NULL, "content" text, "thumbnail" character varying, "category" character varying, "tags" character varying, "meta_title" character varying(60), "meta_description" character varying(160), "is_published" boolean NOT NULL DEFAULT false, "published_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "project_id" uuid, "program_id" uuid, "solution_id" uuid, CONSTRAINT "UQ_0ab85f4be07b22d79906671d72f" UNIQUE ("slug"), CONSTRAINT "PK_40808690eb7b915046558c0f81b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "job" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "slug" character varying NOT NULL, "department" character varying, "location" character varying, "type" character varying NOT NULL, "salary_range" character varying, "deadline" date, "description" text, "requirements" text, "benefits" text, "is_urgent" boolean NOT NULL DEFAULT false, "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_bb1c7d9ea827ecf0c54d0794461" UNIQUE ("slug"), CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "lead" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "full_name" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "phone" character varying(20), "subject" character varying, "message" text, "attachment" character varying, "is_read" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ca96c1888f7dcfccab72b72fffa" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "tagline" character varying, "description" text, "mission" text, "vision" text, "core_values" text, "founded_year" integer, "stats" jsonb, "social_links" jsonb, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "partner" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "logo" character varying(500) NOT NULL, "website_url" character varying(500), "order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_8f34ff11ddd5459eacbfacd48ca" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "slide" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "cta_text" character varying(100), "cta_url" character varying(500), "image_url" character varying(500) NOT NULL, "order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_61701f20afc899f757f86da067b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_image" ADD CONSTRAINT "FK_478c63e70f1825d39b35980634d" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_b976643a0bdbadee18de7cbc5d3" FOREIGN KEY ("field_id") REFERENCES "operation_field"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" ADD CONSTRAINT "FK_ade6051c70376ae01d8b1582e0e" FOREIGN KEY ("province_id") REFERENCES "province"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "program" ADD CONSTRAINT "FK_2167033b25706183f7e7ecbd75f" FOREIGN KEY ("field_id") REFERENCES "operation_field"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "solution" ADD CONSTRAINT "FK_6095cfe5cb5ce02ef43fd9ad8be" FOREIGN KEY ("field_id") REFERENCES "operation_field"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_c876b77689729a5d7bc22baae61" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_376f8fed5758131809fa97ff590" FOREIGN KEY ("program_id") REFERENCES "program"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" ADD CONSTRAINT "FK_c2b33d237291c3225b6ce025f0b" FOREIGN KEY ("solution_id") REFERENCES "solution"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_c2b33d237291c3225b6ce025f0b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_376f8fed5758131809fa97ff590"`,
    );
    await queryRunner.query(
      `ALTER TABLE "article" DROP CONSTRAINT "FK_c876b77689729a5d7bc22baae61"`,
    );
    await queryRunner.query(
      `ALTER TABLE "solution" DROP CONSTRAINT "FK_6095cfe5cb5ce02ef43fd9ad8be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "program" DROP CONSTRAINT "FK_2167033b25706183f7e7ecbd75f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_ade6051c70376ae01d8b1582e0e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project" DROP CONSTRAINT "FK_b976643a0bdbadee18de7cbc5d3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "project_image" DROP CONSTRAINT "FK_478c63e70f1825d39b35980634d"`,
    );
    await queryRunner.query(`DROP TABLE "slide"`);
    await queryRunner.query(`DROP TABLE "partner"`);
    await queryRunner.query(`DROP TABLE "organization"`);
    await queryRunner.query(`DROP TABLE "lead"`);
    await queryRunner.query(`DROP TABLE "job"`);
    await queryRunner.query(`DROP TABLE "article"`);
    await queryRunner.query(`DROP TABLE "solution"`);
    await queryRunner.query(`DROP TABLE "program"`);
    await queryRunner.query(`DROP TABLE "project"`);
    await queryRunner.query(`DROP TABLE "project_image"`);
    await queryRunner.query(`DROP TABLE "province"`);
    await queryRunner.query(`DROP TABLE "operation_field"`);
  }
}
