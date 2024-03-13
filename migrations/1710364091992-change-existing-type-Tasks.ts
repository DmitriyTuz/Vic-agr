import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeExistingTypeTasks1710364091992 implements MigrationInterface {
    name = 'ChangeExistingTypeTasks1710364091992';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`UPDATE "Tasks" SET type = 'Medium'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}
