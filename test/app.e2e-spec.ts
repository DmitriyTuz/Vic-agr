// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import * as request from 'supertest';
// import { AppModule } from './../src/app.module';
//
// describe('AppController (e2e)', () => {
//   let app: INestApplication;
//
//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     }).compile();
//
//     app = moduleFixture.createNestApplication();
//     await app.init();
//   });
//
//   it('/ (GET)', () => {
//     return request(app.getHttpServer()).get('/').expect(200).expect('Hello World!');
//   });
// });

import * as request from 'supertest';
import {UserService} from "@src/entities/user/user.service";
import {UserController} from "@src/entities/user/user.controller";
import {QueryRunner} from "typeorm";
import {TestHelper} from "@src/helper/test/test-helper";
import {AuthService} from "@src/auth/auth.service";
import {CheckPlanGuard} from "@src/guards/check-plan.guard";
import {HttpStatus} from "@nestjs/common";
import {CreateUserDto} from "@src/entities/user/dto/create-user.dto";
import {ReqBodyCreateUserDto} from "@src/entities/user/dto/reqBody.create-user.dto";
import {ReqBodyUpdateUserDto} from "@src/entities/user/dto/reqBody.update-user.dto";
import {LoginDto} from "@src/auth/dto/login.dto";
import {SignUpDto} from "@src/auth/dto/sign-up.dto";
import {ForgotPasswordDto} from "@src/auth/dto/forgot-password.dto";
import {StripeService} from "@src/stripe/stripe.service";
import {Stripe} from "stripe";
import {ReqBodyCreateSubscribeDto} from "@src/entities/payment/dto/reqBody-create-subscribe.dto";
import {User} from "@src/entities/user/user.entity";
import {ReqBodyCreatePaymentDto} from "@src/entities/payment/dto/reqBody-create-payment.dto";
import {PaymentService} from "@src/entities/payment/payment.service";
import {Payment} from "@src/entities/payment/payment.entity";
import {PaymentController} from "@src/entities/payment/payment.controller";
import {Company} from "@src/entities/company/company.entity";
import * as bcrypt from 'bcryptjs';
import {ReqBodyCreateTaskDto} from "@src/entities/task/dto/reqBody.create-task.dto";
import {TaskService} from "@src/entities/task/task.service";
import {TaskDataInterface} from "@src/interfaces/tasks/task-data.interface";
import {ReqBodyUpdateTaskDto} from "@src/entities/task/dto/reqBody.update-task.dto";
import {ReqBodyCompleteTaskDto} from "@src/entities/complete-task/dto/reqBody.complete-task.dto";
import {ReqBodyGetTasksDto} from "@src/entities/task/dto/reqBody.get-tasks.dto";
import {ReqBodyReportTaskDto} from "@src/entities/report-task/dto/reqBody.report-task.dto";

interface MockStripeCustomer extends Partial<Stripe.Customer> {
  lastResponse: {
    headers: { [key: string]: string };
    requestId: string;
    statusCode: number;
    apiVersion?: string;
    idempotencyKey?: string;
    stripeAccount?: string;
  };
}


describe('Tests API (e2e)', () => {
  let userService: UserService;
  let authService: AuthService;
  let paymentService: PaymentService;
  let taskService: TaskService;
  let testHelper: TestHelper;
  let stripeService: StripeService;
  let queryRunner: QueryRunner;

  let checkPlanGuard: CheckPlanGuard;

  beforeAll(async () => {
    testHelper = new TestHelper();
    await testHelper.init();
    queryRunner = testHelper.queryRunner;

    userService = testHelper.app.get<UserService>(UserService);
    authService = testHelper.app.get<AuthService>(AuthService) as AuthService;
    paymentService = testHelper.app.get<PaymentService>(PaymentService);
    taskService = testHelper.app.get<TaskService>(TaskService);
    checkPlanGuard = testHelper.app.get<CheckPlanGuard>(CheckPlanGuard);
    stripeService = testHelper.app.get<StripeService>(StripeService);

  });

  beforeEach(async () => {
    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
  });

  afterAll(async () => {
    await testHelper.close();
  });


  describe('Users API (e2e)', () => {
    it('/api/users/get-users (GET)', async () => {
      jest.spyOn(checkPlanGuard, 'canActivate').mockReturnValue(Promise.resolve(true));

      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .get('/api/users/get-users?search=S&&type=Admin')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(Array.isArray(response.body.data.users)).toBe(true);
      expect(response.body.data.users.length).toBeGreaterThan(0);
      expect(response.body.data.users[0].name).toEqual('Svetlana');
      expect(response.body.data.filterCounts.admins).toEqual(1);
    });

    it('/api/users/account (GET)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .get('/api/users/account')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(response.body.data.user.name).toEqual('Svetlana');
      expect(response.body.data.company.id).toBeDefined();;
    });

    it('/api/users/create-user (POST)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const createUserDto: ReqBodyCreateUserDto = {
        name: 'Test User 1',
        password: '11111',
        phone: '+100000000123',
        type: 'WORKER',
        companyId: 10003,
        tags: []
      };

      const response = await request(testHelper.app.getHttpServer())
          .post('/api/users/create-user')
          .set('Authorization', `Bearer ${token}`)
          .send(createUserDto)
          .expect(HttpStatus.CREATED);

      expect(response.body.data.user.name).toBe('Test User 1');
    });

    it('/api/users/worker-tags (GET)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .get('/api/users/worker-tags')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(Array.isArray(response.body.data.workers)).toBe(true);
    });

    it('/api/users/onboard (PATCH)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .patch('/api/users/onboard')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.userId).toBeDefined();
    });

    it('/api/users/update-user/:id (PATCH)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const createUserDto: ReqBodyCreateUserDto = {
        name: 'Test User 1',
        password: '11111',
        phone: '+100000000123',
        type: 'WORKER',
        companyId: 10001,
        tags: []
      };

      const userCreateData: { user: User, message: string } = await userService.createUser(createUserDto);

      const updateUserDto: ReqBodyUpdateUserDto = {
        name: 'Test User 2',
        password: '11111',
        phone: '+100000000123',
        type: 'MANAGER',
        tags: []
      };

      const response = await request(testHelper.app.getHttpServer())
          .patch(`/api/users/update-user/${userCreateData.user.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateUserDto)
          .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe(userCreateData.user.id);
    });

    it('/api/users/delete-user/:id (DELETE)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const createUserDto: ReqBodyCreateUserDto = {
        name: 'Test User 1',
        password: '11111',
        phone: '+100000000123',
        type: 'WORKER',
        companyId: 10001,
        tags: []
      };

      const userCreateData: { user: User, message: string } = await userService.createUser(createUserDto);

      const response = await request(testHelper.app.getHttpServer())
          .delete(`/api/users/delete-user/${userCreateData.user.id}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.userId).toBe(userCreateData.user.id);
    });
  });

  describe('Auth API (e2e)', () => {
    it('/api/auth/login (POST)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };

      const response = await request(testHelper.app.getHttpServer())
          .post(`/api/auth/login`)
          .send(loginDto)
          .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('/api/auth/logout (GET)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .get(`/api/auth/logout`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
    });

    it('/api/auth/signUp (POST)', async () => {
      const signUpDto: SignUpDto = {
        phone: '+111111111111',
        password: '12345678',
        name: 'Test User',
        companyName: 'Test Company',
        logo: [{logo: "Test logo"}]
      }

      const response = await request(testHelper.app.getHttpServer())
          .post(`/api/auth/sign-up`)
          .send(signUpDto)
          .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('/api/auth/forgot-password (PUT)', async () => {
      const forgotPasswordDto: ForgotPasswordDto = {
        phone: '+100000000001'
      }

      const response = await request(testHelper.app.getHttpServer())
          .put(`/api/auth/forgot-password`)
          .send(forgotPasswordDto)
          .expect(HttpStatus.OK);

      expect(response.body.notice).toBe('200-the-password-has-been-reset');
    });
  });

  describe('Tags API (e2e)', () => {
    it('/api/tags/get-tags (GET)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .get('/api/tags/get-tags?search=&&names=worker')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data.tags)).toBe(true);
    });
  });

  describe('Payments API (e2e)', () => {
    it('/api/payment/create-payment (POST)', async () => {
      // const mockCancelSubscribeResponse = { id: 'sub_test', status: 'canceled' };
      const mockCustomerCreateResponse: Stripe.Response<Stripe.Customer> = {
        id: 'cus_Q9rqPf17ddoZRW',
        object: 'customer',
        address: null,
        balance: 0,
        created: 1716457153,
        currency: null,
        default_source: 'card_1PJY7AC581Db3P9CJ5DVJMEk',
        delinquent: false,
        description: null,
        discount: null,
        email: null,
        invoice_prefix: '21AEC3CF',
        invoice_settings: {
          custom_fields: null,
          default_payment_method: null,
          footer: null,
          rendering_options: null
        },
        livemode: false,
        metadata: {},
        name: 'Svetlana',
        phone: '+100000000001',
        preferred_locales: [],
        shipping: null,
        tax_exempt: 'none',
        test_clock: null,

        lastResponse: {
          headers: {},
          requestId: 'req_test',
          statusCode: 200,
          apiVersion: '2020-08-27',
          idempotencyKey: 'idem_test',
          stripeAccount: 'acct_test',
        },
      };

      // jest.spyOn(stripeService, 'cancelSubscribe').mockResolvedValue(mockCancelSubscribeResponse);
      jest.spyOn(stripeService, 'customerCreate').mockResolvedValue(mockCustomerCreateResponse);

      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const user = await authService.login(loginDto);
      const token = user.token;

      const paymentCreateDto: ReqBodyCreatePaymentDto = {
        agree: true,
        cardType: 'Visa',
        exp_month: 7,
        exp_year: 2024,
        number: '4242424242424242',
        token: 'tok_1PCQVBC581Db3P9C1cJqkE0r',
      };

      const response = await request(testHelper.app.getHttpServer())
          .post('/api/payment/create-payment')
          .set('Authorization', `Bearer ${token}`)
          .send(paymentCreateDto)
          .expect(HttpStatus.CREATED);

      expect(response.body.success).toBe(true);
      expect(response.body.data.payment).toBeDefined();
      expect(response.body.data.payment.cardType).toBe(paymentCreateDto.cardType);
      expect(response.body.data.payment.expiration).toBe('07/24');
    });

    it('/api/payment/:id/create-subscribe (POST)', async () => {
      const mockPayment: Payment = {
        id: 10005,
        cardType: 'Visa',
        customerId: 'cus_QBSCWN9lEE8gNy',
        expiration: '06/24',
        nameOnCard: null,
        number: '4242',
        prefer: false,
        subscriberId: null,
        paidAt: null,
        agree: false,
        userId: 10012,
        user: {} as User
      };

      const mockCreateSubscribeResponse: Stripe.Response<Stripe.Subscription> = {
        id: 'sub_1PJv8ZC581Db3P9CoqVcN2Lq',
        object: 'subscription',
        application: null,
        application_fee_percent: null,
        automatic_tax: { enabled: false, liability: null },
        billing_cycle_anchor: 1716545651,
        billing_cycle_anchor_config: null,
        billing_thresholds: null,
        cancel_at: null,
        cancel_at_period_end: false,
        canceled_at: null,
        cancellation_details: { comment: null, feedback: null, reason: null },
        collection_method: 'charge_automatically',
        created: 1716545651,
        currency: 'eur',
        current_period_end: 1719224051,
        current_period_start: 1716545651,
        customer: 'cus_Q9uYj9fRuVsUQm',
        days_until_due: null,
        default_payment_method: null,
        default_source: null,
        default_tax_rates: [],
        description: null,
        discount: null,
        discounts: [],
        ended_at: null,
        items: {
          object: 'list',
          data: [
            {
              id: 'si_QAFtZYqXRLkmxS',
              object: 'subscription_item',
              billing_thresholds: null,
              created: 1716546564,
              discounts: [],
              metadata: {},
              plan: {
                id: 'plan_Q52EGsX1mT2Mkn',
                object: 'plan',
                active: true,
                aggregate_usage: null,
                amount: 9990,
                amount_decimal: '9990',
                billing_scheme: 'per_unit',
                created: 1715342560,
                currency: 'eur',
                interval: 'month',
                interval_count: 1,
                livemode: false,
                metadata: {},
                meter: null,
                nickname: null,
                product: 'prod_Q52ENNl4Dx6Z6C',
                tiers_mode: null,
                transform_usage: null,
                trial_period_days: null,
                usage_type: 'licensed'
              },
              price: {
                id: 'plan_Q52EGsX1mT2Mkn',
                object: 'price',
                active: true,
                billing_scheme: 'per_unit',
                created: 1715342560,
                currency: 'eur',
                custom_unit_amount: null,
                livemode: false,
                lookup_key: null,
                metadata: {},
                nickname: null,
                product: 'prod_Q52ENNl4Dx6Z6C',
                recurring: {
                  aggregate_usage: null,
                  interval: 'month',
                  interval_count: 1,
                  meter: null,
                  trial_period_days: null,
                  usage_type: 'licensed'
                },
                tax_behavior: 'unspecified',
                tiers_mode: null,
                transform_quantity: null,
                type: 'recurring',
                unit_amount: 9990,
                unit_amount_decimal: '9990'
              },
              quantity: 1,
              subscription: 'sub_1PJvNHC581Db3P9CJ7jV9PLJ',
              tax_rates: []
            }
          ],
          has_more: false,
          url: '/v1/subscription_items?subscription=sub_1PJv8ZC581Db3P9CoqVcN2Lq'
        },
        latest_invoice: 'in_1PJv8ZC581Db3P9Cs7wkt9VR',
        livemode: false,
        metadata: {},
        next_pending_invoice_item_invoice: null,
        on_behalf_of: null,
        pause_collection: null,
        payment_settings: {
          payment_method_options: null,
          payment_method_types: null,
          save_default_payment_method: 'off'
        },
        pending_invoice_item_interval: null,
        pending_setup_intent: null,
        pending_update: null,
        schedule: null,
        start_date: 1716545651,
        status: 'active',
        test_clock: null,
        transfer_data: null,
        trial_end: null,
        trial_settings: { end_behavior: { missing_payment_method: 'create_invoice' } },
        trial_start: null,
        lastResponse: {
          headers: {},
          requestId: 'req_test',
          statusCode: 200,
          apiVersion: '2020-08-27',
          idempotencyKey: 'idem_test',
          stripeAccount: 'acct_test',
        },
      }

      jest.spyOn(paymentService, 'findById').mockResolvedValue(mockPayment);
      jest.spyOn(stripeService, 'createSubscribers').mockResolvedValue(mockCreateSubscribeResponse);

      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const user = await authService.login(loginDto);
      const token = user.token;

      const reqBodyCreateSubscribeDto: ReqBodyCreateSubscribeDto = {
        agree: true,
        planType: "Monthly"
      };

      const response = await request(testHelper.app.getHttpServer())
          .post(`/api/payment/${mockPayment.id}/create-subscribe`)
          .set('Authorization', `Bearer ${token}`)
          .send(reqBodyCreateSubscribeDto)
          .expect(HttpStatus.CREATED);

      // console.log('! response.body =', response.body);

      expect(response.body.success).toBe(true);
      expect(response.body.notice).toBe('Subscribed');
    });

    it('/api/payment/:id/remove-subscribe (DELETE)', async () => {

      const mockPayment: Payment = {
        id: 10005,
        cardType: 'Visa',
        customerId: 'cus_QBSCWN9lEE8gNy',
        expiration: '06/24',
        nameOnCard: null,
        number: '4242',
        prefer: false,
        subscriberId: 'sub_1PLN4oC581Db3P9CiG26MuCo',
        paidAt: new Date('2024-05-28T10:16:20.241Z'),
        agree: false,
        userId: 10012,
        user: {} as User
      };

      const mockCancelSubscribeResponse: Stripe.Response<Stripe.Subscription> =  {
        id: 'sub_1PLNWwC581Db3P9CmnEG0fTu',
        object: 'subscription',
        application: null,
        application_fee_percent: null,
        automatic_tax: { enabled: false, liability: null },
        billing_cycle_anchor: 1716893122,
        billing_cycle_anchor_config: null,
        billing_thresholds: null,
        cancel_at: null,
        cancel_at_period_end: false,
        canceled_at: 1716893128,
        cancellation_details: { comment: null, feedback: null, reason: 'cancellation_requested' },
        collection_method: 'charge_automatically',
        created: 1716893122,
        currency: 'eur',
        current_period_end: 1719571522,
        current_period_start: 1716893122,
        customer: 'cus_QBSCWN9lEE8gNy',
        days_until_due: null,
        default_payment_method: null,
        default_source: null,
        default_tax_rates: [],
        description: null,
        discount: null,
        discounts: [],
        ended_at: 1716893128,
        items: {
          object: 'list',
          data: [
            {
              id: 'si_QBl3LbGcU9STRe',
              object: 'subscription_item',
              billing_thresholds: null,
              created: 1716893122,
              discounts: [],
              metadata: {},
              plan: {
                id: 'plan_QBPDnRbujORk6C',
                object: 'plan',
                active: true,
                aggregate_usage: null,
                amount: 9990,
                amount_decimal: '9990',
                billing_scheme: 'per_unit',
                created: 1716811928,
                currency: 'eur',
                interval: 'month',
                interval_count: 1,
                livemode: false,
                metadata: {},
                meter: null,
                nickname: null,
                product: 'prod_QBPDe9hFz16yO7',
                tiers_mode: null,
                transform_usage: null,
                trial_period_days: null,
                usage_type: 'licensed'
              },
              price: {
                id: 'plan_QBPDnRbujORk6C',
                object: 'price',
                active: true,
                billing_scheme: 'per_unit',
                created: 1716811928,
                currency: 'eur',
                custom_unit_amount: null,
                livemode: false,
                lookup_key: null,
                metadata: {},
                nickname: null,
                product: 'prod_QBPDe9hFz16yO7',
                recurring: {
                  aggregate_usage: null,
                  interval: 'month',
                  interval_count: 1,
                  meter: null,
                  trial_period_days: null,
                  usage_type: 'licensed'
                },
                tax_behavior: 'unspecified',
                tiers_mode: null,
                transform_quantity: null,
                type: 'recurring',
                unit_amount: 9990,
                unit_amount_decimal: '9990'
              },
              quantity: 1,
              subscription: 'sub_1PLNWwC581Db3P9CmnEG0fTu',
              tax_rates: []
            }
          ],
          has_more: false,
          url: '/v1/subscription_items?subscription=sub_1PLNWwC581Db3P9CmnEG0fTu'
        },
        latest_invoice: 'in_1PLNWwC581Db3P9CbOURxRWB',
        livemode: false,
        metadata: {},
        next_pending_invoice_item_invoice: null,
        on_behalf_of: null,
        pause_collection: null,
        payment_settings: {
          payment_method_options: null,
          payment_method_types: null,
          save_default_payment_method: 'off'
        },
        pending_invoice_item_interval: null,
        pending_setup_intent: null,
        pending_update: null,
        schedule: null,
        start_date: 1716893122,
        status: 'canceled',
        test_clock: null,
        transfer_data: null,
        trial_end: null,
        trial_settings: { end_behavior: { missing_payment_method: 'create_invoice' } },
        trial_start: null,
        lastResponse: {
          headers: {},
          requestId: 'req_test',
          statusCode: 200,
          apiVersion: '2020-08-27',
          idempotencyKey: 'idem_test',
          stripeAccount: 'acct_test',
        },
      }

      const user1 = await userService.findByPhone('+100000000001');

      const mockUser: User = {
        id: user1.id,
        name: user1.name,
        phone: user1.phone,
        type: user1.type,
        companyId: user1.companyId,
        password: await bcrypt.hash('12345678', 10),
      } as User;

      // const mockUser: User = {
      //   id: 10012,
      //   // name: 'Svetlana',
      //   // phone: '+100000000001',
      //   // type: 'ADMIN',
      //   companyId: 10005,
      //   password: await bcrypt.hash('12345678', 10),
      // } as User;

      const mockCompany: Company = {
        id: 10005,
        isTrial: false,
      } as Company;

      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const user = await authService.login(loginDto);
      const token = user.token;

      jest.spyOn(paymentService, 'findById').mockResolvedValue(mockPayment);
      jest.spyOn(paymentService['userRepository'], 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(paymentService['companyRepository'], 'findOne').mockResolvedValue(mockCompany);
      jest.spyOn(stripeService, 'cancelSubscribe').mockResolvedValue(mockCancelSubscribeResponse);

      const response = await request(testHelper.app.getHttpServer())
          .delete(`/api/payment/${mockPayment.id}/remove-subscribe`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      // console.log('! response.body =', response.body);

      expect(response.body.success).toBe(true);
      expect(response.body.notice).toBe('Unsubscribed');
    });
  });

  describe('Tasks API (e2e)', () => {
    it('/api/tasks/get-tasks (POST)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .post('/api/tasks/get-tasks')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.CREATED);

      expect(Array.isArray(response.body.data.tasks)).toBe(true);
      expect(response.body.data.filterCounts.low).toBeDefined();
      expect(response.body.data.filterCounts.high).toBeDefined();
    });

    it('/api/tasks/create-task (POST)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const createTaskDto: ReqBodyCreateTaskDto = {
        title: 'Test Task 1',
        type: 'Low',
        executionTime: 1,
        comment: 'Test Comment 1',
        dueDate: new Date(),
        tags: [],
        workers: [],
        mapLocation: []
      };

      const response = await request(testHelper.app.getHttpServer())
          .post('/api/tasks/create-task')
          .set('Authorization', `Bearer ${token}`)
          .send(createTaskDto)
          .expect(HttpStatus.CREATED);

      // console.log('! response.body =', response.body);

      expect(response.body.data.task.title).toBe('Test Task 1');
    });

    it('/api/tasks/:id/update-task (PATCH)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const createTaskDto: ReqBodyCreateTaskDto = {
        title: 'Test Task 1',
        type: 'Low',
        executionTime: 1,
        comment: 'Test Comment 1',
        dueDate: new Date(),
        tags: [],
        workers: [],
        mapLocation: []
      };

      const admin = await userService.findByPhone('+100000000001');

      const taskCreateData: {success: boolean, notice: string, data: {task: TaskDataInterface}} = await taskService.create(createTaskDto, admin.id);

      const updateTaskDto: ReqBodyUpdateTaskDto = {
        title: 'Test Task 2',
        type: 'Medium',
        executionTime: 10,
        dueDate: new Date('2124-04-17'),
        workers: [],
        tags: [],
      };

      const response = await request(testHelper.app.getHttpServer())
          .patch(`/api/tasks/${taskCreateData.data.task.id}/update-task`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateTaskDto)
          .expect(HttpStatus.OK);

      // console.log('! response.body =', response.body);

      expect(response.body.data.task.title).toBe('Test Task 2');
    });

    it('/api/tasks/:id/complete-task (PUT)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const completeTaskDto: ReqBodyCompleteTaskDto = {
        timeLog: '1',
        comment: 'Test Comment'
      };

      const admin = await userService.findByPhone('+100000000001');

      const getTaskDto = {};

      const getTasksData = await taskService.getAll(getTaskDto, admin.id);

      const response = await request(testHelper.app.getHttpServer())
          .put(`/api/tasks/${getTasksData.data.tasks[0].id}/complete-task`)
          .set('Authorization', `Bearer ${token}`)
          .send(completeTaskDto)
          .expect(HttpStatus.OK);

      // console.log('! response.body =', response.body);

      expect(response.body.success).toBe(true);
    });

    it('/api/tasks/:id/report-task (PUT)', async () => {
      const loginDto: LoginDto = { phone: '+100000000001', password: '12345678' };
      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const reportTaskDto: ReqBodyReportTaskDto = {
        comment: 'Test Comment'
      };

      const admin = await userService.findByPhone('+100000000001');

      const getTaskDto = {};

      const getTasksData = await taskService.getAll(getTaskDto, admin.id);

      const response = await request(testHelper.app.getHttpServer())
          .put(`/api/tasks/${getTasksData.data.tasks[0].id}/report-task`)
          .set('Authorization', `Bearer ${token}`)
          .send(reportTaskDto)
          .expect(HttpStatus.OK);

      // console.log('! response.body =', response.body);

      expect(response.body.success).toBe(true);
    });
  });
});
