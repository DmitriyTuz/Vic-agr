import {MigrationInterface, QueryRunner, TableColumn, TableIndex} from "typeorm";

export class AddCompanyId1710361553880 implements MigrationInterface {
    name = 'AddCompanyId1710361553880';

    public async up(queryRunner: QueryRunner): Promise<void> {
        const attribute = {
            type: 'int',
            isNullable: true,
            onDelete: 'CASCADE',
            references: {
                tableName: 'Companies',
                referencedColumnName: 'id',
                name: 'companyId',
            },
        };

        await Promise.all([
            queryRunner.addColumn('Users', new TableColumn({ name: 'companyId', ...attribute })),
            queryRunner.addColumn('Tasks', new TableColumn({ name: 'companyId', ...attribute })),
            queryRunner.addColumn('Tags', new TableColumn({ name: 'companyId', ...attribute })),
            queryRunner.addColumn('MapLocations', new TableColumn({ name: 'companyId', ...attribute })),
        ]);

        await Promise.all([
            queryRunner.createIndex('Users', new TableIndex({ columnNames: ['companyId'] })),
            queryRunner.createIndex('Tasks', new TableIndex({ columnNames: ['companyId'] })),
            queryRunner.createIndex('Tags', new TableIndex({ columnNames: ['companyId'] })),
            queryRunner.createIndex('MapLocations', new TableIndex({ columnNames: ['companyId'] })),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await Promise.all([
        //     queryRunner.dropIndex('MapLocations', 'companyId'),
        //     queryRunner.dropIndex('Tags', 'companyId'),
        //     queryRunner.dropIndex('Tasks', 'companyId'),
        //     queryRunner.dropIndex('Users', 'companyId'),
        // ]);
        //
        // await Promise.all([
        //     queryRunner.dropColumn('MapLocations', 'companyId'),
        //     queryRunner.dropColumn('Tags', 'companyId'),
        //     queryRunner.dropColumn('Tasks', 'companyId'),
        //     queryRunner.dropColumn('Users', 'companyId'),
        // ]);
    }
}
