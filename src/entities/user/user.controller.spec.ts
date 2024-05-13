// import { Test, TestingModule } from '@nestjs/testing';
// import { UsersController } from './users.controller';
//
// describe('UsersController', () => {
//   let controller: UsersController;
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [UsersController],
//     }).compile();
//
//     controller = module.get<UsersController>(UsersController) as UsersController;
//   });
//
//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
// ----------------------------------------------------


import * as request from 'supertest';
import {UserService} from "@src/entities/user/user.service";
import {UserController} from "@src/entities/user/user.controller";

// import {HttpStatus} from "@nestjs/common";
// import {CreateCategoryDto} from "../category/dto/create-category.dto";
// import {CategoryService} from "../category/category.service";
// import {CreateUserDto} from "./dto/create-user.dto";
// import {CreatePaymentDto} from "../payment/dto/create-payment.dto";
// import {PaymentService} from "../payment/payment.service";
// import {CustomHttpException} from "../exceptions/сustomHttp.exception";
import {QueryRunner} from "typeorm";
import {TestHelper} from "@src/helper/test/test-helper";
import {RequestWithUser} from "@src/interfaces/users/add-field-user-to-Request.interface";



describe('UsersController', () => {
    let userController: UserController;
    let userService: UserService;
    let testHelper: TestHelper;
    // let categoryService: CategoryService;
    // let paymentService: PaymentService;
    let queryRunner: QueryRunner;

    beforeEach(async () => {
        testHelper = new TestHelper();
        await testHelper.init();
        queryRunner = testHelper.queryRunner;

        userController = testHelper.app.get<UserController>(UserController) as UserController;
        userService = testHelper.app.get<UserService>(UserService) as UserService;
        // categoryService = testHelper.app.get<CategoryService>(CategoryService) as CategoryService;
        // paymentService = testHelper.app.get<PaymentService>(PaymentService) as PaymentService;

        await queryRunner.startTransaction();
    });

    afterEach(async () => {
        await queryRunner.rollbackTransaction();
        await testHelper.close();

        // await testHelper.clearDatabase(testHelper.app);

        // const dataSource = testHelper.app.get(DataSource);
        // await dataSource.createQueryBuilder().delete().from(Category).execute();
    });

    it('should be defined', () => {
        expect(userController).toBeDefined();
    });

    it('should call userService.getAll with correct arguments', async () => {
        const reqQuery = { search: 'U', type: 'Worker' };
        const req: RequestWithUser = { user: { id: 10003 } } as RequestWithUser;

        jest.spyOn(userService, 'getAll').mockResolvedValueOnce({ success: true, data: { users: [], filterCounts: {} } });

        const result = await userController.getAll(reqQuery, req);

        expect(userService.getAll).toHaveBeenCalledWith(reqQuery, req.user.id);
        expect(result.data.users).toEqual([]);
    });

    /**
     * Test the GET (get users)
     */

    // describe('GET - getAll (DB)', () => {
    //     it('should return all users', async () => {
    //
    //         const user = await userService.getUserById(10003);
    //
    //         const users = await userController.getAll({search: 'U', type: 'Worker'}, {user: user})
    //
    //         // jest.spyOn(service, 'getBalance').mockResolvedValue(balance);
    //
    //         // const result = await userController.getBalance(userId, startDate, endDate, description);
    //
    //         expect(result).toEqual({ balance });
    //     });
    // });



    // /**
    //  * Test the GET (get user balance)
    //  */
    //
    // describe('GET - getBalance (DB)', () => {
    //     it('should return the user balance', async () => {
    //         const createCategoryDto: CreateCategoryDto = {
    //             name: 'Test Category 2',
    //         };
    //         const category = await categoryService.create(createCategoryDto)
    //
    //         const createUserDto: CreateUserDto = {
    //             username: 'User1',
    //             email: 'user1@gmail'
    //         };
    //         const user = await userService.create(createUserDto)
    //
    //         const createPaymentDto1: CreatePaymentDto = {
    //             type: 'income',
    //             amount: 10,
    //             description: 'Salary',
    //             userId: user.id,
    //             categoryId: category.id,
    //             createdAt: new Date('2022-01-02')
    //         };
    //
    //         const createPaymentDto2: CreatePaymentDto = {
    //             type: 'income',
    //             amount: 30,
    //             description: 'Salary',
    //             userId: user.id,
    //             categoryId: category.id,
    //             createdAt: new Date('2022-01-05')
    //         };
    //
    //         await paymentService.create(createPaymentDto1);
    //         await paymentService.create(createPaymentDto2);
    //
    //         const userId = user.id;
    //         const startDate = new Date('2022-01-01');
    //         const endDate = new Date('2022-12-31');
    //         const description = 'Salary';
    //         const balance = 40;
    //
    //         // jest.spyOn(service, 'getBalance').mockResolvedValue(balance);
    //
    //         const result = await userController.getBalance(userId, startDate, endDate, description);
    //
    //         expect(result).toEqual({ balance });
    //     });
    // });









    // /**
    // * Test the GET (get user balance)
    // */
    //
    // describe('GET - getBalance (DB)', () => {
    //     it('should return the user balance', async () => {
    //         const createCategoryDto: CreateCategoryDto = {
    //             name: 'Test Category 2',
    //         };
    //         const category = await categoryService.create(createCategoryDto)
    //
    //         const createUserDto: CreateUserDto = {
    //             username: 'User1',
    //             email: 'user1@gmail'
    //         };
    //         const user = await userService.create(createUserDto)
    //
    //         const createPaymentDto1: CreatePaymentDto = {
    //             type: 'income',
    //             amount: 10,
    //             description: 'Salary',
    //             userId: user.id,
    //             categoryId: category.id,
    //             createdAt: new Date('2022-01-02')
    //         };
    //
    //         const createPaymentDto2: CreatePaymentDto = {
    //             type: 'income',
    //             amount: 30,
    //             description: 'Salary',
    //             userId: user.id,
    //             categoryId: category.id,
    //             createdAt: new Date('2022-01-05')
    //         };
    //
    //         await paymentService.create(createPaymentDto1);
    //         await paymentService.create(createPaymentDto2);
    //
    //         const userId = user.id;
    //         const startDate = new Date('2022-01-01');
    //         const endDate = new Date('2022-12-31');
    //         const description = 'Salary';
    //         const balance = 40;
    //
    //         // jest.spyOn(service, 'getBalance').mockResolvedValue(balance);
    //
    //         const result = await userController.getBalance(userId, startDate, endDate, description);
    //
    //         expect(result).toEqual({ balance });
    //     });
    // });
    //
    // describe('GET - users/{userId}/balance API (e2e)', () => {
    //     it('should return the user balance', async () => {
    //
    //         const createCategoryDto: CreateCategoryDto = {
    //             name: 'Test Category',
    //         };
    //         const category = await categoryService.create(createCategoryDto)
    //
    //         const createUserDto: CreateUserDto = {
    //             username: 'User1',
    //             email: 'user1@gmail'
    //         };
    //         const user = await userService.create(createUserDto)
    //
    //         const createPaymentDto1: CreatePaymentDto = {
    //             type: 'income',
    //             amount: 10,
    //             description: 'Salary',
    //             userId: user.id,
    //             categoryId: category.id,
    //             createdAt: new Date('2022-01-02')
    //         };
    //
    //         const createPaymentDto2: CreatePaymentDto = {
    //             type: 'income',
    //             amount: 30,
    //             description: 'Salary',
    //             userId: user.id,
    //             categoryId: category.id,
    //             createdAt: new Date('2022-01-05')
    //         };
    //
    //         await paymentService.create(createPaymentDto1);
    //         await paymentService.create(createPaymentDto2)
    //
    //         const userId = user.id;
    //         const startDate = new Date('2022-01-01');
    //         const endDate = new Date('2022-12-31');
    //         const description = 'Salary';
    //         const balance = 40;
    //
    //         return request(testHelper.app.getHttpServer())
    //             .get(`/users/${userId}/balance`)
    //             .query({ startDate, endDate, description })
    //             .expect(200)
    //             .expect({ balance: balance });
    //     });
    //
    //     it('should return status NOT_FOUND', async () => {
    //         const userId = 10000;
    //         const startDate = new Date('2022-01-01');
    //         const endDate = new Date('2022-12-31');
    //         const description = 'Salary';
    //
    //         const response = await request(testHelper.app.getHttpServer())
    //             .get(`/users/${userId}/balance`)
    //             .query({ startDate, endDate, description })
    //
    //         expect(response.status).toBe(HttpStatus.NOT_FOUND);
    //         expect(response.body.errors[0]).toEqual(`User with id ${userId} not found`);
    //
    //     });
    // });
    //
    // describe('GET - getBalance (Mocks)', () => {
    //     it('should return the user balance', async () => {
    //         const userId = 1;
    //         const startDate = new Date('2023-01-01');
    //         const endDate = new Date('2023-12-31');
    //         const description = 'Salary';
    //         const balance = 100;
    //
    //         userService.getBalance = jest.fn().mockResolvedValueOnce(balance);
    //
    //         const result = await userController.getBalance(userId, startDate, endDate, description);
    //
    //         expect(result).toStrictEqual({balance});
    //
    //     });
    //
    //     it('should throw CustomHttpException if user not found', async () => {
    //         const userId = 1;
    //         const startDate = new Date('2023-01-01');
    //         const endDate = new Date('2023-12-31');
    //         const description = 'Salary';
    //         const errorMessage = `User with id ${userId} not found`;
    //
    //         userService.getBalance = jest.fn().mockRejectedValueOnce(new CustomHttpException(errorMessage, HttpStatus.NOT_FOUND));
    //
    //         await expect(userController.getBalance(userId, startDate, endDate, description)).rejects.toThrowError(
    //             new CustomHttpException(errorMessage, HttpStatus.NOT_FOUND),
    //         );
    //     });
    // });
});

