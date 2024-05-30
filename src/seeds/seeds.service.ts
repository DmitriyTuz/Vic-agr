import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {DeepPartial, Repository} from 'typeorm';
import { Company } from '@src/entities/company/company.entity';
import {PlanTypes, TaskStatuses, TaskTypes, UserTypes} from '@src/lib/constants';
import { User } from '@src/entities/user/user.entity';
import { UserService } from '@src/entities/user/user.service';
import { Tag } from '@src/entities/tag/tag.entity';
import { Task } from '@src/entities/task/task.entity';
import { TaskService } from '@src/entities/task/task.service';
import {StripeService} from "@src/stripe/stripe.service";
import {Plan} from "@src/entities/plan/plan.entity";

@Injectable()
export class SeedsService {
  private shouldSeed: boolean = false;

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
    private readonly taskService: TaskService,
    private readonly stripeService: StripeService,
    @InjectRepository(Plan)
    private readonly planRepository: Repository<Plan>,
  ) {}

  enableSeeding(): void {
    this.shouldSeed = true;
  }

  async seedData() {
    const companiesData: any[] = [
      {
        logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg',
        name: 'Company One',
      },
      {
        logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg',
        name: 'Company Two',
      },
      {
        logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg',
        name: 'Company Three',
      },
    ];

    for (const companyData of companiesData) {
      const company = await this.companyRepository.create(companyData);
      await this.companyRepository.save(company);
    }

    const companyOne = await this.companyRepository.findOne({ where: { name: 'Company One' } });
    const companyTwo = await this.companyRepository.findOne({ where: { name: 'Company Two' } });
    const companyThree = await this.companyRepository.findOne({ where: { name: 'Company Three' } });

    const usersAdminData: any[] = [
      {
        name: 'Super Admin',
        password: '12345678',
        phone: '+100000000000',
        type: UserTypes.SUPER_ADMIN,
      },
      {
        name: 'Michael',
        password: '12345678',
        phone: '+100000000002',
        type: UserTypes.ADMIN,
        companyId: companyOne.id,
      },
      {
        name: 'Alex',
        password: '12345678',
        phone: '+100000000003',
        type: UserTypes.ADMIN,
        companyId: companyTwo.id,
      },
      {
        name: 'Svetlana',
        password: '12345678',
        phone: '+100000000001',
        type: UserTypes.ADMIN,
        companyId: companyThree.id,
      },
    ];

    for (const userData of usersAdminData) {
      const user = await this.userService.createUser(userData);
      // await this.userRepository.save(user);
    }

    const Michael = await this.userRepository.findOne({ select: ['id', 'companyId'], where: { name: 'Michael' } });
    const Alex = await this.userRepository.findOne({ select: ['id', 'companyId'], where: { name: 'Alex' } });
    const Svetlana = await this.userRepository.findOne({ select: ['id', 'companyId'], where: { name: 'Svetlana' } });

    const tagsData = [
      { name: 'admin', companyId: Michael.companyId },
      { name: 'worker', companyId: Michael.companyId },
      { name: 'manager', companyId: Michael.companyId },
      { name: 'michael', companyId: Michael.companyId },

      { name: 'admin', companyId: Alex.companyId },
      { name: 'worker', companyId: Alex.companyId },
      { name: 'manager', companyId: Alex.companyId },
      { name: 'alex', companyId: Alex.companyId },

      { name: 'admin', companyId: Svetlana.companyId },
      { name: 'worker', companyId: Svetlana.companyId },
      { name: 'manager', companyId: Svetlana.companyId },
      { name: 'svetlana', companyId: Svetlana.companyId },
    ];

    for (const tagData of tagsData) {
      const tag = await this.tagRepository.create(tagData);
      await this.tagRepository.save(tag);
    }

    const tasksData = [
      {
        userId: Michael.id,
        title: 'Test Task 1',
        type: TaskTypes.LOW,
        executionTime: 8,
        comment:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
        mediaInfo: [],
        documentsInfo: [],
        status: TaskStatuses.ACTIVE,
        companyId: Michael.companyId,
      },
      {
        userId: Michael.id,
        title: 'Test Task 2',
        type: TaskTypes.HIGH,
        executionTime: 10,
        comment:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
        mediaInfo: [],
        documentsInfo: [],
        status: TaskStatuses.ACTIVE,
        companyId: Michael.companyId,
      },
      {
        userId: Michael.id,
        title: 'Test Task 3',
        type: TaskTypes.MEDIUM,
        executionTime: 13,
        comment:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
        mediaInfo: [],
        documentsInfo: [],
        completedAt: new Date(),
        status: TaskStatuses.COMPLETED,
        companyId: Michael.companyId,
      },
      {
        userId: Michael.id,
        title: 'Test Task 4',
        type: TaskTypes.LOW,
        executionTime: 13,
        comment:
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
        mediaInfo: [],
        documentsInfo: [],
        status: TaskStatuses.WAITING,
        companyId: Michael.companyId,
      },
      {
        userId: Svetlana.id,
        title: 'Test Task 5',
        type: TaskTypes.LOW,
        executionTime: 13,
        comment:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris',
        mediaInfo: [],
        documentsInfo: [],
        status: TaskStatuses.WAITING,
        companyId: Svetlana.companyId,
      },
    ];

    for (const taskData of tasksData) {
      const task = await this.taskRepository.create(taskData);
      await this.taskRepository.save(task);
    }

    const task = await this.taskRepository.findOne({
      where: { status: TaskStatuses.WAITING, companyId: Michael.companyId },
    });
    const workers = await this.userRepository.find({
      where: { type: UserTypes.WORKER, companyId: Michael.companyId },
      select: ['id'],
    });
    const workersIds = workers.map((w) => w.id);

    const tags = ['admin', 'manager'];
    const mapLocations = [
      { lat: 20, lng: 10 },
      { lat: 27, lng: 11 },
      { lat: 27, lng: 10 },
    ];

    await this.userService.checkUsersForTask(task, workersIds);

    const usersData: any[] = [
      {
        name: 'User 1',
        password: '12345678',
        phone: '+100000000100',
        type: UserTypes.MANAGER,
        companyId: Michael.companyId
      },
      {
        name: 'User 2',
        password: '12345678',
        phone: '+100000000200',
        type: UserTypes.WORKER,
        companyId: Michael.companyId
      },
      {
        name: 'User 3',
        password: '12345678',
        phone: '+100000000300',
        type: UserTypes.MANAGER,
        companyId: Michael.companyId
      },
      {
        name: 'User 4',
        password: '12345678',
        phone: '+100000000400',
        type: UserTypes.WORKER,
        companyId: Michael.companyId
      }
    ];

    for (const userData of usersData) {
      const user = await this.userService.createUser(userData);
      await this.userRepository.save(user.user);
    }

// Create Plans
    const product_name = 'Vic-agr';
    const productResult = await this.stripeService.createProduct(product_name);

    const monthPlanDataForStripe =  {
      product: productResult.id,
      plan_name: PlanTypes.MONTHLY,
      amount: 9990,
      currency: 'EUR',
      interval: 'month',
      active: true,
    }

    const yearPlanDataForStripe =  {
      product: productResult.id,
      plan_name: PlanTypes.YEARLY,
      amount: 99990,
      currency: 'EUR',
      interval: 'year',
      active: true,
    }

    const monthPlan = await this.stripeService.createPlan(monthPlanDataForStripe);
    const yearPlan = await this.stripeService.createPlan(yearPlanDataForStripe);

    const monthPlanData =  {
      amount: 9990,
      currency: 'EUR',
      interval: 'month',
      active: 'true',
      stripeId: monthPlan.id,
      name: PlanTypes.MONTHLY
    }

    const yearPlanData =  {
      amount: 99990,
      currency: 'EUR',
      interval: 'year',
      active: 'true',
      stripeId: yearPlan.id,
      name: PlanTypes.YEARLY
    }

    // delete monthPlanData.product;
    // delete monthPlanData.plan_name;
    // monthPlanData.stripeId = monthPlan.id;
    // monthPlanData.name = PlanTypes.MONTHLY;


    // delete yearPlanData.product;
    // delete yearPlanData.plan_name;
    // yearPlanData.stripeId = yearPlan.id;
    // yearPlanData.name = PlanTypes.YEARLY;

    await this.planRepository.save(monthPlanData);
    await this.planRepository.save(yearPlanData);

    process.exit(0);
  }
}
