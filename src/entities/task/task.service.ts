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
import {GetFilterCountTasksResponseInterface} from "@src/interfaces/get-filterCountTasks-response.interface";
import {TaskDataInterface} from "@src/interfaces/task-data.interface";
import {HelperService} from "@src/helper/helper.service";

interface CustomFindManyOptions<Task> extends FindManyOptions<Task> {
  relations?: string[];
}


@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private helperService: HelperService,
  ) {}

  async getAll(reqBody: GetTasksOptionsInterface, currentUserId: number): Promise<{ success: boolean; data: { tasks: TaskDataInterface[], filterCounts: GetFilterCountTasksResponseInterface; } }> {
    try {
      const user: User = await this.userService.getOneUser({ id: currentUserId });
      let userId: number;

      if (user.type === UserTypes.WORKER) {
        userId = user.id;
      }

      const { companyId } = user;

      const { status, date, type, location, tags } = reqBody;
      const tasks: Task[] = await this.getAllTasks({ status, date, type, location, tags, companyId, userId }, true);

      let returnedTasks: TaskDataInterface[] = [];

      for (const t of tasks) {
        returnedTasks.push(this.getTaskData(t));
      }

      returnedTasks = returnedTasks.sort((a, b) => {
        const dateDiffA = moment(date).diff(moment(a.dueDate), 'days');
        const dateDiffB = moment(date).diff(moment(b.dueDate), 'days');

        return dateDiffA === 0 ? -1 : dateDiffB === 0 ? 1 : 0;
      });

      const filterCounts: GetFilterCountTasksResponseInterface = await this.getFilterCountTasks(companyId, userId, status);

      return {
        success: true,
        data: { tasks: returnedTasks, filterCounts },
      };
    } catch (e) {
      this.logger.error(`Error during get all tasks: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async getAllTasks(options: GetTasksOptionsInterface, isDatesInMs: boolean = false): Promise<Task[]> {
    // const selectFields: string[] = await this.helperService.getEntityFields(this.taskRepository, [], true, false);
    // const selectObject: Record<string, true> = {};
    // // const selectObject: { [key: string]: true } = {};
    //
    // selectFields.forEach((field) => {
    //   selectObject[field] = true;
    // });

    const query: CustomFindManyOptions<Task> = {
      // select: selectObject,
      select: {
        workers: {
          id: true,
          name: true,
          phone: true,
          type: true,
          lastActive: true,
          hasOnboard: false,
          createdAt: true,
          updatedAt: true,
          companyId: true
        }
      },
      where: {},
      relations: ['reportInfo', 'completeInfo', 'creator', 'tags', 'mapLocation', 'workers'],
      order: { dueDate: 'ASC' },
    };

    // const query: FindManyOptions<Task> = {
    //   select: selectObject,
    //   where: {},
    //   relations: ['reportInfo', 'completeInfo', 'creator', 'tags', 'mapLocation', 'workers'],
    //   order: { dueDate: 'ASC' },
    // };

    if (options.companyId) {
      query.where = { ...query.where, companyId: options.companyId };
    }

    if (options.status) {
      query.where = { ...query.where, status: options.status };
    } else if (options.userId) {
      query.where = { ...query.where, status: Not(TaskStatuses.WAITING) };
    }

    if (options.type && options.type !== 'All') {
      query.where = { ...query.where, type: options.type };
    }

    if (options.tags?.length) {
      const tagIds = options.tags.map(tag => tag.id);
      query.where = { ...query.where, tags: { id: In(tagIds) } };
    }

    if (options.location) {
      const { lat, lng } = options.location;
      const mapLocationQuery = {
        'mapLocations.lat': lat,
        'mapLocations.lng': lng,
      };
      query.where = { ...query.where, ...mapLocationQuery };
    }

    let tasks: Task[] = await this.taskRepository.find(query);
    // return await this.taskRepository.find(query);

    if (isDatesInMs) {
      const datesList: string[] = ['completedAt', 'createdAt', 'updatedAt', 'registrationDate', 'lastActive'];

      for (const dateField of datesList) {
        if (tasks[0]?.[dateField] instanceof Date) {
          for (const task of tasks) {
            task[dateField] = task[dateField].getTime();
          }
        }
      }

      for (const relation of query.relations) {
        if (tasks[0]?.[relation]) {
          for (const task of tasks) {
            const relatedEntity = task[relation];
            if (relatedEntity instanceof Array) {
              for (const entity of relatedEntity) {
                for (const dateField of datesList) {
                  if (entity[dateField] instanceof Date) {
                    entity[dateField] = entity[dateField].getTime();
                  }
                }
              }
            } else {
              for (const dateField of datesList) {
                if (relatedEntity[dateField] instanceof Date) {
                  relatedEntity[dateField] = relatedEntity[dateField].getTime();
                }
              }
            }
          }
        }
      }
    }

    // if (isDatesInMs) {
    //   const datesList: string[] = ['completedAt', 'createdAt', 'updatedAt', 'registrationDate', 'lastActive'];
    //
    //   for (const relation of query.relations) {
    //     if (tasks[0]?.[relation]) {
    //       console.log('!!! tasks[0]?.[relation] = ', tasks[0]?.[relation])
    //       for (const task of tasks) {
    //         const relatedEntity = task[relation];
    //         if (relatedEntity) {
    //           for (const dateField of datesList) {
    //             if (relatedEntity[dateField] instanceof Date) {
    //               relatedEntity[dateField] = relatedEntity[dateField].getTime();
    //             }
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

    return tasks;
  }

  // getTaskData(task) {
  //   const data = _.pick(task, [
  //     'id',
  //     'title',
  //     'mapLocation',
  //     'type',
  //     'executionTime',
  //     'comment',
  //     'mediaInfo',
  //     'documentsInfo',
  //     'status',
  //     'workers',
  //     'tags',
  //     'completeInfo',
  //     'reportInfo',
  //     'creator',
  //     'createdAt',
  //     'updatedAt',
  //     'completedAt',
  //     'dueDate',
  //   ]);
  //   data.createdAt = data.createdAt ? parseInt(data.createdAt) : null;
  //   data.updatedAt = data.updatedAt ? parseInt(data.updatedAt) : null;
  //   data.completedAt = data.completedAt ? parseInt(data.completedAt) : null;
  //
  //   if (task?.completeInfo?.length) {
  //     data.completeInfo = [];
  //     for (const c of task.completeInfo) {
  //       c.dataValues.createdAt = c.dataValues.createdAt ? parseInt(c.dataValues.createdAt) : null;
  //       c.dataValues.updatedAt = c.dataValues.updatedAt ? parseInt(c.dataValues.updatedAt) : null;
  //
  //       data.completeInfo.push(c.dataValues);
  //     }
  //   }
  //
  //   if (task?.reportInfo?.length) {
  //     data.reportInfo = [];
  //     for (const c of task.reportInfo) {
  //       c.dataValues.createdAt = c.dataValues.createdAt ? parseInt(c.dataValues.createdAt) : null;
  //       c.dataValues.updatedAt = c.dataValues.updatedAt ? parseInt(c.dataValues.updatedAt) : null;
  //
  //       data.reportInfo.push(c.dataValues);
  //     }
  //   }
  //
  //   if (data?.mapLocation?.length) {
  //     const returningLocations = [];
  //     for (let m of data.mapLocation) {
  //       returningLocations.push({
  //         lat: +m.lat,
  //         lng: +m.lng,
  //       });
  //     }
  //
  //     data.mapLocation = returningLocations;
  //   }
  //
  //   return data;
  // }

  getTaskData(task: Task): TaskDataInterface {
    const data: Partial<TaskDataInterface> = _.pick(task, [
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

    console.log('!!! data.createdAt = ', data.createdAt);
    // console.log('!!! parseInt(data.createdAt.toString() = ', parseInt(data.createdAt.toString(), 10));

    // const datesList: string[] = ['completedAt', 'createdAt', 'updatedAt', 'registrationDate', 'lastActive'];
    //
    // for (const dateField of datesList) {
    //   if (data[dateField] !== null && data[dateField] !== undefined) {
    //     data[dateField] = new Date(data[dateField]).getTime();
    //   }
    // }

    // data.createdAt = data.createdAt ? new Date(data.createdAt).getTime() : null;
    // data.updatedAt = data.updatedAt ? data.updatedAt : null;
    // data.completedAt = data.completedAt ? data.completedAt : null;
    // data.dueDate = data.dueDate ? data.dueDate : null;

    // data.createdAt = data.createdAt ? parseInt(data.createdAt.toString(), 10) : null;
    // data.updatedAt = data.updatedAt ? parseInt(data.updatedAt.toString(), 10) : null;
    // data.completedAt = data.completedAt ? parseInt(data.completedAt.toString(), 10) : null;
    // data.dueDate = data.dueDate ? parseInt(data.dueDate.toString(), 10) : null;

    if (task?.completeInfo?.length) {
      data.completeInfo = task.completeInfo.map((c: any) => ({
        ...c.dataValues,
        createdAt: c.dataValues.createdAt ? parseInt(c.dataValues.createdAt) : null,
        updatedAt: c.dataValues.updatedAt ? parseInt(c.dataValues.updatedAt) : null,
      }));
    }

    if (task?.reportInfo?.length) {
      data.reportInfo = task.reportInfo.map((c: any) => ({
        ...c.dataValues,
        createdAt: c.dataValues.createdAt ? parseInt(c.dataValues.createdAt) : null,
        updatedAt: c.dataValues.updatedAt ? parseInt(c.dataValues.updatedAt) : null,
      }));
    }

    if (data?.mapLocation?.length) {
      data.mapLocation = data.mapLocation.map((m: any) => ({
        lat: +m.lat,
        lng: +m.lng,
      }));
    }

    return data as TaskDataInterface;
  }

  async getFilterCountTasks(companyId: number, userId: number, status: string): Promise<GetFilterCountTasksResponseInterface> {
    const tasks: Task[] = await this.getAllTasks({ companyId, userId, status });

    const groupTasks: _.Dictionary<Task[]> = _.groupBy(tasks, 'type');

    const filterCounts: GetFilterCountTasksResponseInterface = {
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
