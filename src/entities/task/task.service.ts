import {HttpException, HttpStatus, Injectable, Logger} from '@nestjs/common';

// import { GetTasksInterface } from '@src/interfaces/tasks/get-tasks.interface';
import { Task } from '@src/entities/task/task.entity';
import { TaskStatuses, TaskTypes, UserTypes } from '@src/lib/constants';
import { FindManyOptions, In, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import _ from 'underscore';
import * as moment from 'moment';
import { UserService } from '@src/entities/user/user.service';
import { User } from '@src/entities/user/user.entity';
import { CustomHttpException } from '@src/exceptions/сustomHttp.exception';
import {GetFilterCountTasksResponseInterface} from "@src/interfaces/tasks/get-filterCountTasks-response.interface";
import {TaskDataInterface} from "@src/interfaces/tasks/task-data.interface";
import {HelperService} from "@src/helper/helper.service";
import {TagService} from "@src/entities/tag/tag.service";
import {CreateTaskDto} from "@src/entities/task/dto/create-task.dto";
import {ReqBodyCreateTaskDto} from "@src/entities/task/dto/reqBody.create-task.dto";
import {UpdateTaskDto} from "@src/entities/task/dto/update-task.dto";
import {ReqBodyUpdateTaskDto} from "@src/entities/task/dto/reqBody.update-task.dto";
import {CompleteTask} from "@src/entities/complete-task/complete-task.entity";
import {CompleteTask_createDto} from "@src/entities/complete-task/dto/complete-task_create.dto";
import {ReqBodyCompleteTaskDto} from "@src/entities/complete-task/dto/reqBody.complete-task.dto";
import {ReportTask} from "@src/entities/report-task/report-task.entity";
import {ReportTask_createDto} from "@src/entities/report-task/dto/report-task_create.dto";
import {ReqBodyReportTaskDto} from "@src/entities/report-task/dto/reqBody.report-task.dto";
import {GetTasksDto} from "@src/entities/task/dto/get-tasks.dto";
import {CreateTaskInterface} from "@src/interfaces/tasks/create-task.interface";

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
    private tagService: TagService,
    @InjectRepository(CompleteTask)
    private completeTaskRepository: Repository<CompleteTask>,
    @InjectRepository(ReportTask)
    private reportTaskRepository: Repository<ReportTask>,
  ) {}

  async getAll(reqQuery: GetTasksDto, currentUserId: number): Promise<{ success: boolean; data: { tasks: TaskDataInterface[], filterCounts: GetFilterCountTasksResponseInterface; } }> {
    try {
      const user: User = await this.userService.getOneUser({ id: currentUserId });
      let userId: number;

      if (user.type === UserTypes.WORKER) {
        userId = user.id;
      }

      const { companyId } = user;

      const { status, date, type, location, tags } = reqQuery;
      const tasks: Task[] = await this.getAllTasks({ status, date, type, location, tags, companyId, userId }, false);

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
        // data: { tasks: tasks },
        data: { tasks: returnedTasks, filterCounts },
      };
    } catch (e) {
      this.logger.error(`Error during get all tasks: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  async getAllTasks(options: GetTasksDto, isDatesInMs: boolean = false): Promise<Task[]> {
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
        },
        // completeInfo: {
        //   id: true,
        //
        // }
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
      // console.log('!!! task.completeInfo = ', task.completeInfo);
      // console.log(1);
      data.completeInfo = task.completeInfo.map((c: any) => ({
        ...c,
        createdAt: c.createdAt ? c.createdAt: null,
        updatedAt: c.updatedAt ? c.updatedAt: null,
      }));
    }

    if (task?.reportInfo?.length) {

      console.log('!!! task.reportInfoInfo = ', task.reportInfo);
      console.log(1);
      data.reportInfo = task.reportInfo.map((c: any) => ({
        ...c,
        createdAt: c.createdAt ? c.createdAt: null,
        updatedAt: c.updatedAt ? c.updatedAt: null,
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

  async create(body: CreateTaskDto, adminId: number): Promise<{ success: boolean, notice: string, data: {task: TaskDataInterface} }> {
    try {
      const user: User = await this.userService.getOneUser({id: adminId});
      const {companyId} = user;

      const {tags, workers, mapLocation} = body
      body.companyId = companyId;

      const task: Task = await this.createTask(adminId, body);

      await this.tagService.checkTagsForTask(task, tags);
      await this.userService.checkUsersForTask(task, workers);

      // await this.locationService.checkLocations(task, mapLocation);

      const findQuery: Record<string, any> = {id: task.id};
      if (companyId) {
        findQuery.companyId = companyId;
      }
      const returnedTask: Task = await this.getOneTask(findQuery);

      return {
        success: true,
        notice: '200-task-has-been-created-successfully',
        data: {task: this.getTaskData(returnedTask)}
      }

    } catch (e) {
      this.logger.error(`Error during create task: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  private async createTask(userId: number, taskData: CreateTaskDto): Promise<Task> {

    const {title, type, executionTime, comment, mediaInfo, documentsInfo, companyId, dueDate} = taskData

    const newTask: CreateTaskInterface = {
      title,
      type,
      executionTime,
      comment,
      mediaInfo,
      documentsInfo,
      companyId,
      dueDate,
      userId
    }

    return this.taskRepository.save(newTask);
  }

  async getOneTask(findQuery: any): Promise<Task> {
    return this.taskRepository.findOne({
      where: findQuery,
      relations: [
        'reportInfo',
        'reportInfo.user',
        'completeInfo',
        'completeInfo.user',
        'creator',
        'tags',
        'workers',
        'mapLocation',
      ],
    });
  }

  async update(body: ReqBodyUpdateTaskDto, adminId: number, taskId: number): Promise<{ success: boolean, notice: string, data: {task: TaskDataInterface} }> {
    try {
      const user: User = await this.userService.getOneUser({id: adminId});
      const {companyId} = user;

      if (!taskId) {
        throw new HttpException('task-id-not-found', HttpStatus.NOT_FOUND);
      }

      const findQuery: Record <string, any> = {id: taskId};
      if (companyId) {
        findQuery.companyId = companyId;
      }

      const task: Task = await this.getOneTask(findQuery);

      if (!task) {
        throw new HttpException('task-not-found', HttpStatus.NOT_FOUND);
      }

      const {tags, workers, mapLocation, ...dataUpdateTask} = body;

      await this.updateTask(task, dataUpdateTask);

      const updatedTask: Task = await this.getOneTask(findQuery);

      await this.tagService.checkTagsForTask(updatedTask, tags);
      await this.userService.checkUsersForTask(updatedTask, workers);
      // await this.locationService.checkLocations(task, mapLocation);

      const returnedTask: Task = await this.getOneTask(findQuery);

      return {
        success: true,
        notice: '200-task-has-been-updated-successfully',
        data: {task: this.getTaskData(returnedTask)}
      };

    } catch (e) {
      this.logger.error(`Error during update task: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  private async updateTask(task: Task, dataUpdateTask: UpdateTaskDto) {

    if (([TaskStatuses.WAITING, TaskStatuses.COMPLETED] as const).includes(task.status as "Waiting" | "Completed")) {
      dataUpdateTask.status = TaskStatuses.ACTIVE;
    }
    return await this.taskRepository.update(task.id, dataUpdateTask);
  }

  async complete(body: ReqBodyCompleteTaskDto, adminId: number, taskId: number): Promise<{ success: boolean, notice: string }> {
    try {
      if (!taskId) {
        throw new HttpException('task-id-not-found', HttpStatus.NOT_FOUND);
      }

      const task: Task = await this.getOneTask({id: taskId});

      if (!task) {
        throw new HttpException('task-not-found', HttpStatus.NOT_FOUND);
      }

      await this.completeTask(adminId, task, body);

      return {
        success: true,
        notice: '200-task-has-been-completed-successfully',
      };

    } catch (e) {
      this.logger.error(`Error during complete task: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  private async completeTask(userId: number, task: Task, completeData: ReqBodyCompleteTaskDto): Promise<CompleteTask> {
    this.checkTaskStatus(task.status, 'complete');

    const {timeLog, comment, mediaInfo} = completeData;

    const newCompleteData: CompleteTask_createDto = {
      userId,
      taskId: task.id,
      timeLog,
      comment,
      mediaInfo
    }

    const completeInfo: CompleteTask_createDto & CompleteTask = await this.completeTaskRepository.save(newCompleteData);
    await this.taskRepository.update(task.id, {completedAt: new Date(), status: TaskStatuses.COMPLETED});
    return completeInfo;
  }

  private checkTaskStatus(status: string, action: string): void {
    if (action === 'start' && status !== TaskStatuses.WAITING) {
      throw new HttpException('task-already-started', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    if (['report', 'complete'].includes(action) && status !== TaskStatuses.ACTIVE) {
      throw new HttpException(`task-${status === TaskStatuses.WAITING ? "didn't-start-yet" : 'already'}${status !== TaskStatuses.WAITING ? '-' + status.toLowerCase() : ''}`, HttpStatus.UNPROCESSABLE_ENTITY);
    }
  }

  async report(body: ReqBodyReportTaskDto, adminId: number, taskId): Promise<{ success: boolean, notice: string }> {
    try {

      if (!taskId) {
        throw new HttpException('task-id-not-found', HttpStatus.NOT_FOUND);
      }

      const task: Task = await this.getOneTask({id: taskId});

      if (!task) {
        throw new HttpException('task-not-found', HttpStatus.NOT_FOUND);
      }

      await this.reportTask(adminId, task, body);

      return {
        success: true,
        notice: '200-task-has-been-reported-successfully',
      };

    } catch (e) {
      this.logger.error(`Error during report task: ${e.message}`);
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }
  }

  private async reportTask(userId, task, reportData): Promise<ReportTask> {
    this.checkTaskStatus(task.status, 'report');

    const {comment, mediaInfo} = reportData;

    const newReportData: ReportTask_createDto = {
      userId,
      taskId: task.id,
      comment,
      mediaInfo
    }

    const reportInfo: ReportTask_createDto & ReportTask = await this.reportTaskRepository.save(newReportData);
    await this.taskRepository.update(task.id, {status: TaskStatuses.WAITING});

    return reportInfo;
  }
}
