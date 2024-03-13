import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddFieldHasOnboardUsers1710358895383 implements MigrationInterface {
    name = 'AddFieldHasOnboardUsers1710358895383';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('Users', new TableColumn({
            name: 'hasOnboard',
            type: 'boolean',
            default: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
