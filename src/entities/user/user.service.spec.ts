// // import {PaymentService} from "../payment/payment.service";
// // import {CreateCategoryDto} from "../category/dto/create-category.dto";
// // import {CreatePaymentDto} from "../payment/dto/create-payment.dto";
// import {EntityManager, QueryRunner, Repository} from "typeorm";
// import {TestHelper} from "@src/helper/test/test-helper";
// import {UserService} from "@src/entities/user/user.service";
// // import {Category} from "../category/category.entity";
// // import {User} from "./users.entity";
// // import {getRepositoryToken} from "@nestjs/typeorm";
// // import {Payment} from "../payment/payment.entity";
// // import {CreateUserDto} from "./dto/create-user.dto";
// // import {CategoryService} from "../category/category.service";
//
// describe('UsersService', () => {
//
//     let testHelper: TestHelper;
//     let userService: UserService;
//     // let categoryService: CategoryService;
//     // let paymentService: PaymentService;
//     // let userRepository: Repository<User>;
//     // let entityManager: EntityManager;
//     let queryRunner: QueryRunner;
//
//     beforeEach(async () => {
//         testHelper = new TestHelper();
//         await testHelper.init();
//         queryRunner = testHelper.queryRunner;
//
//         userService = testHelper.app.get<UserService>(UserService) as UserService;
//         // categoryService = testHelper.app.get<CategoryService>(CategoryService) as CategoryService;
//         // paymentService = testHelper.app.get<PaymentService>(PaymentService) as PaymentService;
//         // userRepository = testHelper.app.get<Repository<User>>(getRepositoryToken(User)) as Repository<User>;
//         // entityManager = testHelper.app.get<EntityManager>(EntityManager) as EntityManager;
//
//         await queryRunner.startTransaction();
//     });
//
//     afterEach(async () => {
//         await queryRunner.rollbackTransaction();
//         await testHelper.close();
//         // await testHelper.clearDatabase(testHelper.app);
//     });
//
//     // /**
//     //  * Test the GET (get user balance)
//     //  */
//     //
//     // describe('GET - getBalance', () => {
//     //     it('should return the user balance', async () => {
//     //
//     //         const createCategoryDto: CreateCategoryDto = {
//     //             name: 'Test Category',
//     //         };
//     //         const category = await categoryService.create(createCategoryDto)
//     //
//     //         const createUserDto: CreateUserDto = {
//     //             username: 'User1',
//     //             email: 'user1@gmail'
//     //         };
//     //         const user = await userService.create(createUserDto)
//     //
//     //         const createPaymentDto1: CreatePaymentDto = {
//     //             type: 'income',
//     //             amount: 10,
//     //             description: 'Salary',
//     //             userId: user.id,
//     //             categoryId: category.id,
//     //             createdAt: new Date('2022-01-02')
//     //         };
//     //
//     //         const createPaymentDto2: CreatePaymentDto = {
//     //             type: 'income',
//     //             amount: 30,
//     //             description: 'Salary',
//     //             userId: user.id,
//     //             categoryId: category.id,
//     //             createdAt: new Date('2022-01-05')
//     //         };
//     //
//     //         await paymentService.create(createPaymentDto1);
//     //         await paymentService.create(createPaymentDto2);
//     //
//     //         const userId = user.id;
//     //         const startDate = new Date('2022-01-01');
//     //         const endDate = new Date('2022-12-31');
//     //         const description = 'Salary';
//     //         const balance = 40;
//     //
//     //         const result = await userService.getBalance(userId, startDate, endDate, description);
//     //
//     //         expect(result).toEqual(balance);
//     //     });
//     // });
//     //
//     // describe('getBalance (Mocks)', () => {
//     //
//     //     it('should return the user balance', async () => {
//     //         const userId: number = 1;
//     //         const categoryId: number = 1;
//     //         const startDate: Date = new Date('2023-01-01');
//     //         const endDate: Date = new Date('2023-12-31');
//     //         const description: string = 'Salary';
//     //
//     //         const payment1: CreatePaymentDto = { type: 'income', amount: 50, description: description, createdAt: new Date('2023-06-15'), userId: userId, categoryId: categoryId};
//     //         const payment2: CreatePaymentDto = { type: 'expense', amount: 30, description: description, createdAt: new Date('2023-06-20'), userId: userId, categoryId: categoryId};
//     //         const payment3: CreatePaymentDto = { type: 'income', amount: 80, description: description, createdAt: new Date('2023-06-25'), userId: userId, categoryId: categoryId};
//     //
//     //         const payments = [payment1, payment2, payment3];
//     //
//     //         function sumAmounts(payments: CreatePaymentDto[]): number {
//     //             return payments.reduce((total, payment) => total + payment.amount, 0);
//     //         }
//     //
//     //         const sum = sumAmounts(payments)
//     //
//     //         userRepository.findOne = jest.fn().mockResolvedValueOnce({ id: userId });
//     //
//     //         // userRepository.findOne = jest.fn().mockResolvedValueOnce(userId);
//     //         // userService.findOne = jest.fn().mockResolvedValueOnce({ id: userId });
//     //
//     //         entityManager.createQueryBuilder = jest.fn().mockReturnValueOnce({
//     //             select: jest.fn().mockReturnThis(),
//     //             where: jest.fn().mockReturnThis(),
//     //             andWhere: jest.fn().mockReturnThis(),
//     //             getRawOne: jest.fn().mockResolvedValueOnce({ balance: sum })
//     //         });
//     //
//     //         const result = await userService.getBalance(userId, startDate, endDate, description);
//     //
//     //         expect(result).toBe(sum);
//     //     });
//     //
//     //     // it('should throw HttpException if user not found', async () => {
//     //     //     const userId = 1;
//     //     //     const startDate = new Date('2023-01-01');
//     //     //     const endDate = new Date('2023-12-31');
//     //     //     const description = 'Salary';
//     //     //     const errorMessage = `User with id ${userId} not found`;
//     //     //
//     //     //     jest.spyOn(repository, 'createQueryBuilder').mockReturnValueOnce({
//     //     //         select: jest.fn().mockReturnThis(),
//     //     //         where: jest.fn().mockReturnThis(),
//     //     //         andWhere: jest.fn().mockReturnThis(),
//     //     //         getRawOne: jest.fn().mockResolvedValueOnce(null),
//     //     //     });
//     //     //
//     //     //     await expect(userService.getBalance(userId, startDate, endDate, description)).rejects.toThrowError(errorMessage);
//     //     // });
//     // });
//
// });


