import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class CreateMapLocations1710355833224 implements MigrationInterface {
    name = 'CreateMapLocationsTable1710355833224';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'MapLocations',
            columns: [
                {
                    name: 'id',
                    type: 'int',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'name',
                    type: 'varchar',
                    isNullable: true,
                },
                {
                    name: 'lat',
                    type: 'decimal',
                    precision: 10,
                    scale: 6,
                    isNullable: false,
                },
                {
                    name: 'lng',
                    type: 'decimal',
                    precision: 10,
                    scale: 6,
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

        await queryRunner.createIndex("MapLocations", new TableIndex({ name: "IDX_MAP_LOCATION_ID", columnNames: ["id"] }));
        await queryRunner.query('ALTER SEQUENCE "MapLocations_id_seq" RESTART 10000');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('MapLocations');
    }

}
