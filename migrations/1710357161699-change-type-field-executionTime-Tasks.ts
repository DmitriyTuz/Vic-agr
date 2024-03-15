import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class ChangeTypeFieldExecutionTimeTasks1710357161699 implements MigrationInterface {
    name = 'ChangeTypeFieldExecutionTimeTasks1710357161699';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('Tasks', 'executionTime', new TableColumn({
            name: 'executionTime',
            type: 'DECIMAL',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
