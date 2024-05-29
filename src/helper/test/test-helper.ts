import { Test } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {INestApplication} from "@nestjs/common";
import {Connection, DataSource, EntityManager, QueryRunner} from "typeorm";
import {PaymentController} from "@src/entities/payment/payment.controller";
import {AuthService} from "@src/auth/auth.service";
import {StripeService} from "@src/stripe/stripe.service";
import {PaymentService} from "@src/entities/payment/payment.service";

export class TestHelper {

    public app: INestApplication;
    public queryRunner: QueryRunner;
    // public connection: Connection;

    async init() {
        const module = await Test.createTestingModule({
            // controllers: [PaymentController],
            // providers: [
            //     {
            //         provide: PaymentService,
            //         useValue: {
            //             removeSubscribe: jest.fn(),
            //             findById: jest.fn(),
            //         },
            //     },
            //     {
            //         provide: AuthService,
            //         useValue: {
            //             login: jest.fn(),
            //             validateUser: jest.fn(),
            //             generateToken: jest.fn(),
            //         },
            //     },
            //     {
            //         provide: StripeService,
            //         useValue: {
            //             cancelSubscribe: jest.fn(),
            //         },
            //     },
            // ],
            imports: [AppModule]
        }).compile();

        this.app = await module.createNestApplication();
        this.app.setGlobalPrefix('api');
        await this.app.init();

        const dbConnection = await module.get(DataSource);
        const manager:any = await module.get(EntityManager);

        this.queryRunner = manager.queryRunner = await dbConnection.createQueryRunner('master');
    }

    async close() {
        await this.app.close();
        // await this.connection.close();
    }

    async clearDatabase(app: INestApplication): Promise<void> {
        const entityManager = app.get<EntityManager>(EntityManager);
        const tableNames = entityManager.connection.entityMetadatas
            .map((entity) => entity.tableName)
            .join(', ');

        await entityManager.query(
            `truncate ${tableNames} restart identity cascade;`,
        );
    }
}
//-------------------------------------------------------------
// import { Test } from '@nestjs/testing';
// import { AppModule } from '../app.module';
// import {INestApplication} from "@nestjs/common";
// import {DataSource, EntityManager} from "typeorm";
// import {connectionSource} from "../config/ormconfig-test";
//
// export class TestHelper {
//
//     public app: INestApplication;
//     public entityManager: EntityManager;
//     public connection: DataSource;
//
//     async init() {
//         const module = await Test.createTestingModule({
//             imports: [AppModule]
//         }).compile();
//
//         this.app = await module.createNestApplication();
//         await this.app.init();
//
//         this.connection = module.get<DataSource>(DataSource) as DataSource;
//         this.entityManager = this.connection.createEntityManager();
//         // this.entityManager = this.connection.createEntityManager();
//         // this.entityManager = this.connection.createEntityManager();
//
//         // const queryRunner = this.connection.createQueryRunner();
//         // await queryRunner.startTransaction();
//         await this.startTransaction();
//     }
//
//     async startTransaction() {
//         await this.entityManager.queryRunner.startTransaction();
//     }
//
//     async rollbackTransaction() {
//         await this.entityManager.queryRunner.rollbackTransaction();
//     }
//
//         // this.entityManager = module.get<EntityManager>(EntityManager) as EntityManager;
//         // this.connection = module.get<Connection>(Connection) as Connection;
//         // // await this.connection.transaction();
//         // this.entityManager = this.connection.createEntityManager();
//         // await this.entityManager.transaction();
//
//     // async startTransaction(): Promise<QueryRunner> {
//     //     const queryRunner = this.connection.createQueryRunner();
//     //     await queryRunner.startTransaction();
//     //     return queryRunner;
//     // }
//
//     async close() {
//         // await this.connection.rollbackTransaction();
//         // if (this.entityManager.queryRunner.isTransactionActive) {
//         //     await this.entityManager.transaction(async transactionalEntityManager => {
//         //         await transactionalEntityManager.queryRunner.rollbackTransaction();
//         //     });
//         // }
//         // await this.entityManager.queryRunner.rollbackTransaction();
//         await this.rollbackTransaction();
//         await this.app.close();
//     }
//
//     async clearDatabase(app: INestApplication): Promise<void> {
//         const entityManager = app.get<EntityManager>(EntityManager);
//         const tableNames = entityManager.connection.entityMetadatas
//             .map((entity) => entity.tableName)
//             .join(', ');
//
//         await entityManager.query(
//             `truncate ${tableNames} restart identity cascade;`,
//         );
//     }
// }

// import { Test } from '@nestjs/testing';
// import { AppModule } from '../app.module';
// import { INestApplication } from '@nestjs/common';
// import { EntityManager, Connection } from 'typeorm';
//
// export class TestHelper {
//     public app: INestApplication;
//     public entityManager: EntityManager;
//
//     async init() {
//         const module = await Test.createTestingModule({
//             imports: [AppModule]
//         }).compile();
//
//         this.app = module.createNestApplication();
//         await this.app.init();
//
//         this.entityManager = module.get<Connection>(Connection).createEntityManager();
//
//         await this.startTransaction();
//     }
//
//     async startTransaction() {
//         await this.entityManager.queryRunner.startTransaction();
//     }
//
//     async rollbackTransaction() {
//         await this.entityManager.queryRunner.rollbackTransaction();
//     }
//
//     async close() {
//         await this.rollbackTransaction();
//         await this.app.close();
//     }
//
//     async clearDatabase(app: INestApplication): Promise<void> {
//         const entityManager = app.get<EntityManager>(EntityManager);
//         const tableNames = entityManager.connection.entityMetadatas
//             .map((entity) => entity.tableName)
//             .join(', ');
//
//         await entityManager.query(
//             `truncate ${tableNames} restart identity cascade;`,
//         );
//     }
// }

