import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateUserTasks1710338527136 implements MigrationInterface {
    name = 'CreateUserTasks1710338527136';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'UserTasks',
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

        await queryRunner.createForeignKey('UserTasks', new TableForeignKey({
            columnNames: ['userId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Users',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('UserTasks', new TableForeignKey({
            columnNames: ['taskId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Tasks',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('UserTasks');
    }

}
