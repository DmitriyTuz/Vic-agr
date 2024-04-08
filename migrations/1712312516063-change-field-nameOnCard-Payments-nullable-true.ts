import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class ChangeFieldNameOnCardPaymentsNullableTrue1712312516063 implements MigrationInterface {
    name = 'ChangeFieldNameOnCardPaymentsNullableTrue1712312516063';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('Payments', 'nameOnCard', new TableColumn({
            name: 'nameOnCard',
            type: 'varchar',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.changeColumn('Payments', 'nameOnCard', new TableColumn({
            name: 'nameOnCard',
            type: 'varchar',
            isNullable: false,
        }));
    }

}
