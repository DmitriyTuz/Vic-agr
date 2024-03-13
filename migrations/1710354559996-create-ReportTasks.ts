import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";

export class CreateReportTasks1710354559996 implements MigrationInterface {
    name = 'CreateReportTasksTable1710354559996';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'ReportTasks',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'userId',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'taskId',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'comment',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'mediaInfo',
                    type: 'jsonb',
                    default: "'[]'",
                },
                {
                    name: 'createdAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
                {
                    name: 'updatedAt',
                    type: 'timestamp',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
        }), true);

        await queryRunner.createForeignKey('ReportTasks', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Users',
            onDelete: 'CASCADE',
            name: 'FK_UserId_ReportTasks',
        }));

        await queryRunner.createForeignKey('ReportTasks', new TableForeignKey({
            columnNames: ['taskId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Tasks',
            onDelete: 'CASCADE',
            name: 'FK_TaskId_ReportTasks',
        }));

        await queryRunner.createIndex("ReportTasks", new TableIndex({ name: "IDX_REPORT_TASK_ID", columnNames: ["id"] }));
        await queryRunner.query('ALTER SEQUENCE "ReportTasks_id_seq" RESTART 10000');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('ReportTasks');
    }

}
