import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { GetTasksOptionsInterface } from '@src/interfaces/get-tasks-options.interface';
import { Task } from '@src/entities/task/task.entity';
import { TaskStatuses, TaskTypes, UserTypes } from '@lib/constants';
import { FindManyOptions, In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import _ from 'underscore';
import * as moment from 'moment';
import { UserService } from '@src/entities/user/user.service';
import { User } from '@src/entities/user/user.entity';
import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
  ) {}

  async getAll(reqBody: GetTasksOptionsInterface, currentUserId: number) {
    try {
      const user = await this.userService.getOneUser({ id: currentUserId });
      let userId = 0;

      if (user.type === UserTypes.WORKER) {
        userId = user.id;
      }

      const { companyId } = user;

      const { status, date, type, location, tags } = reqBody;
      const tasks = await this.getAllTasks({ status, date, type, location, tags, companyId, userId });

      let returnedTasks = [];

      for (const t of tasks) {
        returnedTasks.push(this.getTaskData(t));
      }

      returnedTasks = returnedTasks.sort((a, b) => {
        const dateDiffA = moment(date).diff(moment(a.dueDate), 'days');
        const dateDiffB = moment(date).diff(moment(b.dueDate), 'days');

        return dateDiffA === 0 ? -1 : dateDiffB === 0 ? 1 : 0;
      });

      const filterCounts = await this.getFilterCount(companyId, userId, status);

      return {
        success: true,
        data: { tasks: returnedTasks, filterCounts },
      };
    } catch (e) {
      this.logger.error(`Error during get all tasks: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async getAllTasks(reqBody): Promise<Task[]> {
    const query: FindManyOptions<Task> = {
      where: {},
      relations: ['reportInfo', 'completeInfo', 'creator', 'tags', 'mapLocation'],
      order: { dueDate: 'ASC' },
    };

    if (reqBody.companyId) {
      query.where = { ...query.where, companyId: reqBody.companyId };
    }

    if (reqBody.status) {
      query.where = { ...query.where, status: reqBody.status };
    } else if (reqBody.userId) {
      query.where = { ...query.where, status: Not(TaskStatuses.WAITING) };
    }

    if (reqBody.type && reqBody.type !== 'All') {
      query.where = { ...query.where, type: reqBody.type };
    }

    if (reqBody.tags?.length) {
      const tagIds = reqBody.tags.map((tag) => tag.id);
      query.where = { ...query.where, tags: { id: tagIds } };
    }

    if (reqBody.location) {
      const { lat, lng } = reqBody.location;
      const mapLocationQuery = {
        'mapLocations.lat': lat,
        'mapLocations.lng': lng,
      };
      query.where = { ...query.where, ...mapLocationQuery };
    }

    return await this.taskRepository.find(query);
  }

  getTaskData(task) {
    const data = _.pick(task, [
      'id',
      'title',
      'mapLocation',
      'type',
      'executionTime',
      'comment',
      'mediaInfo',
      'documentsInfo',
      'status',
      'workers',
      'tags',
      'completeInfo',
      'reportInfo',
      'creator',
      'createdAt',
      'updatedAt',
      'completedAt',
      'dueDate',
    ]);
    data.createdAt = data.createdAt ? parseInt(data.createdAt) : null;
    data.updatedAt = data.updatedAt ? parseInt(data.updatedAt) : null;
    data.completedAt = data.completedAt ? parseInt(data.completedAt) : null;

    if (task?.completeInfo?.length) {
      data.completeInfo = [];
      for (const c of task.completeInfo) {
        c.dataValues.createdAt = c.dataValues.createdAt ? parseInt(c.dataValues.createdAt) : null;
        c.dataValues.updatedAt = c.dataValues.updatedAt ? parseInt(c.dataValues.updatedAt) : null;

        data.completeInfo.push(c.dataValues);
      }
      console.log(4);
    }

    if (task?.reportInfo?.length) {
      data.reportInfo = [];
      for (const c of task.reportInfo) {
        c.dataValues.createdAt = c.dataValues.createdAt ? parseInt(c.dataValues.createdAt) : null;
        c.dataValues.updatedAt = c.dataValues.updatedAt ? parseInt(c.dataValues.updatedAt) : null;

        data.reportInfo.push(c.dataValues);
      }
      console.log(5);
    }

    if (data?.mapLocation?.length) {
      const returningLocations = [];
      for (let m of data.mapLocation) {
        returningLocations.push({
          lat: +m.lat,
          lng: +m.lng,
        });
      }

      data.mapLocation = returningLocations;
      console.log(6);
    }

    return data;
  }

  async getFilterCount(companyId, userId, status) {
    const tasks = await this.getAllTasks({ companyId, userId, status });

    const groupTasks = _.groupBy(tasks, 'type');

    const filterCounts = {
      low: groupTasks[TaskTypes.LOW]?.length || 0,
      medium: groupTasks[TaskTypes.MEDIUM]?.length || 0,
      high: groupTasks[TaskTypes.HIGH]?.length || 0,
      all: 0,
    };

    filterCounts.all = filterCounts.low + filterCounts.medium + filterCounts.high;
    return filterCounts;
  }

  async checkUsersInTask(task: Task, usersIds: number[]) {
    const newUsers = usersIds?.length
      ? await this.userRepository.find({
          where: {
            companyId: task.companyId,
            id: In(usersIds),
          },
        })
      : [];

    if (newUsers.length !== usersIds.length) {
      throw { status: 422, message: `422-assigned-user-not-found`, stack: new Error().stack };
    }

    let taskUsersIds = task?.workers?.map((u) => u.id) || [];

    for (const u of newUsers) {
      if (!taskUsersIds.includes(u.id)) {
        task.workers.push(u);
      }
      if (taskUsersIds.includes(u.id)) {
        const index = taskUsersIds.indexOf(u.id);
        taskUsersIds.splice(index, 1);
      }
    }

    if (taskUsersIds.length) {
      for (const userId of taskUsersIds) {
        const userIndex = task.workers.findIndex((u) => u.id === userId);
        if (userIndex !== -1) {
          task.workers.splice(userIndex, 1);
        }
      }
    }

    await this.taskRepository.save(task);
  }
}
