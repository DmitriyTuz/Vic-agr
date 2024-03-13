import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateTaskTags1710337947903 implements MigrationInterface {
    name = 'CreateTaskTagsTable1710337947903';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'TaskTags',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'taskId',
                    type: 'int',
                    isNullable: false,
                },
                {
                    name: 'tagId',
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

        await queryRunner.createForeignKey('TaskTags', new TableForeignKey({
            columnNames: ['taskId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Tasks',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('TaskTags', new TableForeignKey({
            columnNames: ['tagId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Tags',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('TaskTags');
    }

}
