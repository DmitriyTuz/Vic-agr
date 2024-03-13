import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class CreateTags1710272772066 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'Tags',
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

        await queryRunner.createIndex("Tags", new TableIndex({ name: "IDX_TAG_ID", columnNames: ["id"] }));
        await queryRunner.query('ALTER SEQUENCE "Tags_id_seq" RESTART 10000');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('Tags');
    }

}
