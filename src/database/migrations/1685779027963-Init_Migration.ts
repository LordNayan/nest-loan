import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1685779027963 implements MigrationInterface {
  name = 'InitMigration1685779027963';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userName" character varying(100) NOT NULL, "password" character varying(250) NOT NULL, "isAdmin" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_da5934070b5f2726ebfd3122c80" UNIQUE ("userName"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "repayment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "dueDate" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."repayment_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "loanId" uuid, CONSTRAINT "PK_73c2754ffb392d8ca8023f20ec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "loan" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "amount" numeric(10,2) NOT NULL, "term" smallint NOT NULL, "status" "public"."loan_status_enum" NOT NULL DEFAULT 'PENDING', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" uuid, CONSTRAINT "PK_4ceda725a323d254a5fd48bf95f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "repayment" ADD CONSTRAINT "FK_bee20ba3e4185da4cbbb827fc58" FOREIGN KEY ("loanId") REFERENCES "loan"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "loan" ADD CONSTRAINT "FK_ef7a63b4c4f0edd90e389edb103" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `INSERT INTO "user" ("userName", "password", "isAdmin", "createdAt") VALUES ('admin','123456',true, DEFAULT)`,
    );
    await queryRunner.query(
      `INSERT INTO "user" ("userName", "password", "isAdmin", "createdAt") VALUES ('nayan','123456',false, DEFAULT)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "loan" DROP CONSTRAINT "FK_ef7a63b4c4f0edd90e389edb103"`,
    );
    await queryRunner.query(
      `ALTER TABLE "repayment" DROP CONSTRAINT "FK_bee20ba3e4185da4cbbb827fc58"`,
    );
    await queryRunner.query(`DROP TABLE "loan"`);
    await queryRunner.query(`DROP TABLE "repayment"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
