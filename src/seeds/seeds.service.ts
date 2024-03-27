import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '@src/entities/company/company.entity';
import { TaskStatuses, TaskTypes, UserTypes } from '@lib/constants';
import { User } from '@src/entities/user/user.entity';
import { UserService } from '@src/entities/user/user.service';
import { Tag } from '@src/entities/tag/tag.entity';
import { Task } from '@src/entities/task/task.entity';
import { TaskService } from '@src/entities/task/task.service';

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
  ) {}

  enableSeeding(): void {
    this.shouldSeed = true;
  }

  async seedData() {
    // const companiesData: any[] = [
    //   {
    //     logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg',
    //     name: 'Company One',
    //   },
    //   {
    //     logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg',
    //     name: 'Company Two',
    //   },
    //   {
    //     logo: 'https://loremflickr.com/cache/resized/5479_11470311495_04c2ef3ca6_c_640_480_nofilter.jpg',
    //     name: 'Company Three',
    //   },
    // ];
    //
    // for (const companyData of companiesData) {
    //   const company = await this.companyRepository.create(companyData);
    //   await this.companyRepository.save(company);
    // }
    //
    // const companyOne = await this.companyRepository.findOne({ where: { name: 'Company One' } });
    // const companyTwo = await this.companyRepository.findOne({ where: { name: 'Company Two' } });
    // const companyThree = await this.companyRepository.findOne({ where: { name: 'Company Three' } });
    //
    // const usersData: any[] = [
    //   {
    //     name: 'Super Admin',
    //     password: '12345678',
    //     phone: '+100000000000',
    //     type: UserTypes.SUPER_ADMIN,
    //   },
    //   {
    //     name: 'Michael',
    //     password: '12345678',
    //     phone: '+380982920503',
    //     type: UserTypes.ADMIN,
    //     companyId: companyOne.id,
    //   },
    //   {
    //     name: 'Alex',
    //     password: '12345678',
    //     phone: '+380636446032',
    //     type: UserTypes.ADMIN,
    //     companyId: companyTwo.id,
    //   },
    //   {
    //     name: 'Svetlana',
    //     password: '12345678',
    //     phone: '+100000000001',
    //     type: UserTypes.ADMIN,
    //     companyId: companyThree.id,
    //   },
    // ];
    //
    // for (const userData of usersData) {
    //   const user = await this.userService.createUser(userData);
    //   await this.userRepository.save(user);
    // }

    const Michael = await this.userRepository.findOne({ select: ['id', 'companyId'], where: { name: 'Michael' } });
    // const Alex = await this.userRepository.findOne({ select: ['id', 'companyId'], where: { name: 'Alex' } });
    // const Svetlana = await this.userRepository.findOne({ select: ['id', 'companyId'], where: { name: 'Svetlana' } });
    //
    // const tagsData = [
    //   { name: 'admin', companyId: Michael.companyId },
    //   { name: 'worker', companyId: Michael.companyId },
    //   { name: 'manager', companyId: Michael.companyId },
    //   { name: 'michael', companyId: Michael.companyId },
    //
    //   { name: 'admin', companyId: Alex.companyId },
    //   { name: 'worker', companyId: Alex.companyId },
    //   { name: 'manager', companyId: Alex.companyId },
    //   { name: 'alex', companyId: Alex.companyId },
    //
    //   { name: 'admin', companyId: Svetlana.companyId },
    //   { name: 'worker', companyId: Svetlana.companyId },
    //   { name: 'manager', companyId: Svetlana.companyId },
    //   { name: 'svetlana', companyId: Svetlana.companyId },
    // ];
    //
    // for (const tagData of tagsData) {
    //   const tag = await this.tagRepository.create(tagData);
    //   await this.tagRepository.save(tag);
    // }

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

    await this.taskService.checkUsersInTask(task, workersIds);

    process.exit(0);
  }
}
