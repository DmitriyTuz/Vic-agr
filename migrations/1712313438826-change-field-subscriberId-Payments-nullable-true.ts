import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class ChangeFieldSubscriberIdPaymentsNullableTrue1712313438826 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('Payments', 'subscriberId', new TableColumn({
            name: 'subscriberId',
            type: 'varchar',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('Payments', 'subscriberId', new TableColumn({
            name: 'subscriberId',
            type: 'varchar',
            isNullable: false,
        }));
    }

}
