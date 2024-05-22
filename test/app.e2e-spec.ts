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


describe('Tests API (e2e)', () => {
  let userService: UserService;
  let authService: AuthService;
  let testHelper: TestHelper;
  let queryRunner: QueryRunner;

  let checkPlanGuard: CheckPlanGuard;

  beforeAll(async () => {
    testHelper = new TestHelper();
    await testHelper.init();
    queryRunner = testHelper.queryRunner;

    userService = testHelper.app.get<UserService>(UserService);
    authService = testHelper.app.get<AuthService>(AuthService) as AuthService;
    checkPlanGuard = testHelper.app.get<CheckPlanGuard>(CheckPlanGuard);

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

      const loginDto: LoginDto = {
        phone: '+100000000001',
        password: '12345678'
      }

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
      const loginDto: LoginDto = {
        phone: '+100000000001',
        password: '12345678'
      }

      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .get('/api/users/account')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(response.body.data.user.name).toEqual('Svetlana');
      expect(response.body.data.company.id).toBe(10002);
    });

    it('/api/users/create-user (POST)', async () => {
      const loginDto: LoginDto = {
        phone: '+100000000001',
        password: '12345678'
      }

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
      const loginDto: LoginDto = {
        phone: '+100000000001',
        password: '12345678'
      }

      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .get('/api/users/worker-tags')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(Array.isArray(response.body.data.workers)).toBe(true);
    });

    it('/api/users/onboard (PATCH)', async () => {
      const loginDto: LoginDto = {
        phone: '+100000000001',
        password: '12345678'
      }

      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .patch('/api/users/onboard')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.userId).toBe(10003);
    });

    it('/api/users/update-user/:id (PATCH)', async () => {
      const loginDto: LoginDto = {
        phone: '+100000000001',
        password: '12345678'
      }

      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const updateUserDto: ReqBodyUpdateUserDto = {
        name: 'Test User 2',
        password: '11111',
        phone: '+100000000123',
        type: 'MANAGER',
        tags: []
      };

      const response = await request(testHelper.app.getHttpServer())
          .patch(`/api/users/update-user/${10008}`)
          .set('Authorization', `Bearer ${token}`)
          .send(updateUserDto)
          .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.id).toBe(10008);
    });

    it('/api/users/delete-user/:id (DELETE)', async () => {
      const loginDto: LoginDto = {
        phone: '+100000000001',
        password: '12345678'
      }

      const loginResponse = await authService.login(loginDto)
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .delete(`/api/users/delete-user/${10008}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.userId).toBe(10008);
    });
  });

  describe('Auth API (e2e)', () => {
    it('/api/auth/login (POST)', async () => {
      const loginDto: LoginDto = {
        phone: '+100000000001',
        password: '12345678'
      }

      const response = await request(testHelper.app.getHttpServer())
          .post(`/api/auth/login`)
          .send(loginDto)
          .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.token).toBeDefined();
    });

    it('/api/auth/logout (GET)', async () => {
      const loginDto: LoginDto = {
        phone: '+100000000001',
        password: '12345678'
      }

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

      // console.log('! response.body =', response.body);

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

      console.log('! response.body =', response.body);

      expect(response.body.notice).toBe('200-the-password-has-been-reset');
    });
  });
});
