import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class CreatePlan1710361064765 implements MigrationInterface {
    name = 'CreatePlan1710361064765';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'Plans',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'stripeId',
                    type: 'varchar',
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'amount',
                    type: 'int',
                },
                {
                    name: 'currency',
                    type: 'varchar',
                },
                {
                    name: 'interval',
                    type: 'varchar',
                },
                {
                    name: 'active',
                    type: 'varchar',
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

        await queryRunner.query('ALTER SEQUENCE "Plans_id_seq" RESTART 10000');
        await queryRunner.createIndex('Plans', new TableIndex({ columnNames: ['id'] }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Plans');
    }
}
