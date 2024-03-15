import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class CreateTaskLocations1710356644000 implements MigrationInterface {
    name = 'CreateTaskLocations1710356644000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'TaskLocations',
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
                    name: 'locationId',
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


        await queryRunner.createForeignKey('TaskLocations', new TableForeignKey({
            columnNames: ['taskId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'Tasks',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey('TaskLocations', new TableForeignKey({
            columnNames: ['locationId'],
            referencedColumnNames: ['id'],
            referencedTableName: 'MapLocations',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('TaskLocations');
    }

}
