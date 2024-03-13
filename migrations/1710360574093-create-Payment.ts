import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class CreatePayment1710360574093 implements MigrationInterface {
    name = 'CreatePayment1710360574093';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'Payments',
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
                },
                {
                    name: 'cardType',
                    type: 'varchar',
                },
                {
                    name: 'customerId',
                    type: 'varchar',
                },
                {
                    name: 'expiration',
                    type: 'varchar',
                },
                {
                    name: 'nameOnCard',
                    type: 'varchar',
                },
                {
                    name: 'number',
                    type: 'varchar',
                },
                {
                    name: 'prefer',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'subscriberId',
                    type: 'varchar',
                },
                {
                    name: 'paidAt',
                    type: 'timestamp',
                },
                {
                    name: 'agree',
                    type: 'boolean',
                    default: false,
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

        await queryRunner.query('ALTER SEQUENCE "Payments_id_seq" RESTART 10000');

        await queryRunner.createIndex('Payments', new TableIndex({ columnNames: ['id'] }));
        await queryRunner.createIndex('Payments', new TableIndex({ columnNames: ['userId'] }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Payments');
    }

}
