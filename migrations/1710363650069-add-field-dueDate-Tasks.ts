import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddFieldDueDateTasks1710363650069 implements MigrationInterface {
    name = 'AddFieldDueDateTasks1710363650069';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('Tasks', new TableColumn({
            name: 'dueDate',
            type: 'date',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('Tasks', 'dueDate');
    }

}
