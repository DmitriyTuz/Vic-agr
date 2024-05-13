import {Injectable, CanActivate, ExecutionContext, HttpStatus, HttpException} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {User} from "@src/entities/user/user.entity";
import {UserTypes} from "@src/lib/constants";
import {CustomHttpException} from "@src/exceptions/сustomHttp.exception";


@Injectable()
export class CheckSuperUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const user: User = request.user;

      if (user.type === UserTypes.SUPER_ADMIN) {
        throw new HttpException('422-the-super-admin-can-only-update-or-remove-existing-items', HttpStatus.UNPROCESSABLE_ENTITY);
      }

      return true;
    } catch (e) {
      throw new CustomHttpException(e.message, HttpStatus.UNPROCESSABLE_ENTITY, [e.message], new Error().stack);
    }

  }
}
