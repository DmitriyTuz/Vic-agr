import {MigrationInterface, QueryRunner, TableIndex} from "typeorm";

export class AddIndexes1710359838382 implements MigrationInterface {
    name = 'AddIndexes1710359838382';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createIndex('Tasks', new TableIndex({ columnNames: ['userId'] }));
        await queryRunner.createIndex('ReportTasks', new TableIndex({ columnNames: ['userId'] }));
        await queryRunner.createIndex('ReportTasks', new TableIndex({ columnNames: ['taskId'] }));
        await queryRunner.createIndex('CompleteTasks', new TableIndex({ columnNames: ['userId'] }));
        await queryRunner.createIndex('CompleteTasks', new TableIndex({ columnNames: ['taskId'] }));
        await queryRunner.createIndex('UserTags', new TableIndex({ columnNames: ['userId'] }));
        await queryRunner.createIndex('UserTags', new TableIndex({ columnNames: ['tagId'] }));
        await queryRunner.createIndex('TaskTags', new TableIndex({ columnNames: ['tagId'] }));
        await queryRunner.createIndex('TaskTags', new TableIndex({ columnNames: ['taskId'] }));
        await queryRunner.createIndex('UserTasks', new TableIndex({ columnNames: ['userId'] }));
        await queryRunner.createIndex('UserTasks', new TableIndex({ columnNames: ['taskId'] }));
        await queryRunner.createIndex('TaskLocations', new TableIndex({ columnNames: ['taskId'] }));
        await queryRunner.createIndex('TaskLocations', new TableIndex({ columnNames: ['locationId'] }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Восстановление предыдущего состояния (опционально)
        // Необходимо внести соответствующие изменения в зависимости от текущей структуры базы данных
    }

}
