import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class CreateCompany1710360763327 implements MigrationInterface {
    name = 'CreateCompany1710360763327';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'Companies',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'isSubscribe',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'isTrial',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'hasTrial',
                    type: 'boolean',
                    default: false,
                },
                {
                    name: 'logo',
                    type: 'json',
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'trialAt',
                    type: 'timestamp',
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

        await queryRunner.query('ALTER SEQUENCE "Companies_id_seq" RESTART 10000');
        await queryRunner.createIndex('Companies', new TableIndex({ columnNames: ['id'] }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Companies');
    }
}
