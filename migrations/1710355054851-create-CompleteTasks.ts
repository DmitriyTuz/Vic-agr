import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";

export class CreateCompleteTasks1710355054851 implements MigrationInterface {
    name = 'CreateCompleteTasks1710355054851';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'CompleteTasks',
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
                    name: 'timeLog',
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

        await queryRunner.createForeignKey('CompleteTasks', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Users',
            onDelete: 'CASCADE',
            name: 'FK_UserId_CompleteTasks',
        }));

        await queryRunner.createForeignKey('CompleteTasks', new TableForeignKey({
            columnNames: ['taskId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Tasks',
            onDelete: 'CASCADE',
            name: 'FK_TaskId_CompleteTasks',
        }));

        await queryRunner.createIndex("CompleteTasks", new TableIndex({ name: "IDX_COMPLETE_TASK_ID", columnNames: ["id"] }));
        await queryRunner.query('ALTER SEQUENCE "CompleteTasks_id_seq" RESTART 10000');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('CompleteTasks');
    }
}
