import {MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex} from "typeorm";
import {TaskStatuses} from "@src/./lib/constants";

export class CreateTasks1710329640180 implements MigrationInterface {
    name = 'CreateTasks1710329640180';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'Tasks',
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
                    isNullable: true,
                },
                {
                    name: 'title',
                    type: 'varchar',
                },
                {
                    name: 'type',
                    type: 'varchar',
                },
                {
                    name: 'executionTime',
                    type: 'int',
                },
                {
                    name: 'comment',
                    type: 'varchar',
                },
                {
                    name: 'mediaInfo',
                    type: 'jsonb',
                    default: "'[]'",
                },
                {
                    name: 'documentsInfo',
                    type: 'jsonb',
                    default: "'[]'",
                },
                {
                    name: 'status',
                    type: 'varchar',
                    default: `'${TaskStatuses.ACTIVE}'`,
                },
                {
                    name: 'completedAt',
                    type: 'timestamp',
                    isNullable: true,
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

        await queryRunner.createIndex("Tasks", new TableIndex({ name: "IDX_TASK_ID", columnNames: ["id"] }));
        await queryRunner.query('ALTER SEQUENCE "Tasks_id_seq" RESTART 10000');

        await queryRunner.createForeignKey('Tasks', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Users',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Tasks');
    }

}
