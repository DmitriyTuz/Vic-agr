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


describe('UsersController (e2e)', () => {
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

  /**
   * Test the GET (get users)
   */

  it('/api/users/get-users (GET)', async () => {

    jest.spyOn(checkPlanGuard, 'canActivate').mockReturnValue(Promise.resolve(true));

    let loginResponse = await authService.login({phone: '+100000000001', password: '12345678'})
    let token = loginResponse.token;
    const response = await request(testHelper.app.getHttpServer())
        .get('/api/users/get-users?search=S&&type=Admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

    expect(Array.isArray(response.body.data.users)).toBe(true);
    expect(response.body.data.users.length).toBeGreaterThan(0);
    expect(response.body.data.users[0].name).toEqual('Svetlana');
    expect(response.body.data.filterCounts.admins).toEqual(1);
  });

  /**
   * Test the GET (get users)
   */

});
