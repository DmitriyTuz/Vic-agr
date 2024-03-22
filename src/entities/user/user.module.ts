import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from '@src/entities/user/user.controller';
import { UserService } from '@src/entities/user/user.service';
import { User } from '@src/entities/user/user.entity';
import { AuthModule } from '@src/auth/auth.module';
import { HelperModule } from '@src/helper/helper.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [TypeOrmModule.forFeature([User]), forwardRef(() => AuthModule), HelperModule],
  exports: [UserService],
})
export class UserModule {}
