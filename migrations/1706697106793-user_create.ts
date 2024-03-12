import {MigrationInterface, QueryRunner, Table, TableIndex} from "typeorm";

export class UserCreate1706697106793 implements MigrationInterface {
    name = 'UserCreate1706697106793'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: "Users",
      columns: [
        {
          name: "id",
          type: "int",
          isPrimary: true,
          isGenerated: true,
          generationStrategy: "increment",
        },
        {
          name: "name",
          type: "varchar",
        },
        {
          name: "password",
          type: "varchar",
        },
        {
          name: "phone",
          type: "varchar",
          isUnique: true,
        },
        {
          name: "type",
          type: "varchar",
        },
        {
          name: "lastActive",
          type: "timestamp",
          default: "CURRENT_TIMESTAMP",
        },
        {
          name: "createdAt",
          type: "timestamp",
          default: "CURRENT_TIMESTAMP",
        },
        {
          name: "updatedAt",
          type: "timestamp",
          default: "CURRENT_TIMESTAMP",
        },
      ],
    }), true);

    await queryRunner.createIndex("Users", new TableIndex({ name: "IDX_USER_ID", columnNames: ["id"] }));
    await queryRunner.query('ALTER SEQUENCE "Users_id_seq" RESTART 10000');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("Users");
  }

}
