import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './staffcount.entity';
import { StaffRoleService } from './staffcount.service';
import { RoleController } from './staffcount.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  providers: [StaffRoleService],
  controllers: [RoleController],
})
export class StaffRoleModule {}
