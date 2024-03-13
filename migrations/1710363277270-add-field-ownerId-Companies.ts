import {MigrationInterface, QueryRunner, TableColumn, TableIndex} from "typeorm";

export class AddFieldOwnerIdCompanies1710363277270 implements MigrationInterface {
    name = 'AddFieldOwnerIdCompanies1710363277270';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('Companies', new TableColumn({
            name: 'ownerId',
            type: 'integer',
        }));

        await queryRunner.createIndex('Companies', new TableIndex({
            name: 'IDX_Companies_ownerId',
            columnNames: ['ownerId'],
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropIndex('Companies', 'IDX_Companies_ownerId');
        await queryRunner.dropColumn('Companies', 'ownerId');
    }

}
