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


describe('Tests API (e2e)', () => {
  let authService: AuthService;
  let testHelper: TestHelper;
  let queryRunner: QueryRunner;

  let checkPlanGuard: CheckPlanGuard;

  beforeEach(async () => {
    testHelper = new TestHelper();
    await testHelper.init();
    queryRunner = testHelper.queryRunner;

    authService = testHelper.app.get<AuthService>(AuthService) as AuthService;

    checkPlanGuard = testHelper.app.get<CheckPlanGuard>(CheckPlanGuard);

    await queryRunner.startTransaction();
  });

  afterEach(async () => {
    await queryRunner.rollbackTransaction();
    await testHelper.close();

  });

  describe('UsersController (e2e)', () => {

    it('/api/users/get-users (GET)', async () => {
      jest.spyOn(checkPlanGuard, 'canActivate').mockReturnValue(Promise.resolve(true));

      const loginResponse = await authService.login({phone: '+100000000001', password: '12345678'})
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
      const loginResponse = await authService.login({phone: '+100000000001', password: '12345678'})
      const token = loginResponse.token;
      const response = await request(testHelper.app.getHttpServer())
          .get('/api/users/account')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(response.body.data.user.name).toEqual('Svetlana');
      expect(response.body.data.company.id).toBe(10002);
    });

    it('/api/users/create-user (POST)', async () => {
      const loginResponse = await authService.login({phone: '+100000000001', password: '12345678'})
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
      const loginResponse = await authService.login({phone: '+100000000001', password: '12345678'})
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .get('/api/users/worker-tags')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(Array.isArray(response.body.data.workers)).toBe(true);
    });

    it('/api/users/onboard (PATCH)', async () => {
      const loginResponse = await authService.login({phone: '+100000000001', password: '12345678'})
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .patch('/api/users/onboard')
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      expect(response.body.success).toBe(true);
      expect(response.body.userId).toBe(10003);
    });

    it('/api/users/update-user/:id (PATCH)', async () => {
      const loginResponse = await authService.login({phone: '+100000000001', password: '12345678'})
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
      const loginResponse = await authService.login({phone: '+100000000001', password: '12345678'})
      const token = loginResponse.token;

      const response = await request(testHelper.app.getHttpServer())
          .delete(`/api/users/delete-user/${10008}`)
          .set('Authorization', `Bearer ${token}`)
          .expect(HttpStatus.OK);

      console.log('! response.body =', response.body);

      expect(response.body.success).toBe(true);
      expect(response.body.userId).toBe(10008);
    });

  });

});
