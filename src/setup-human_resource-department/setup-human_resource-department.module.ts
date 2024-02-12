import { Module } from '@nestjs/common';
import { SetupHumanResourceDepartmentService } from './setup-human_resource-department.service';
import { SetupHumanResourceDepartmentController } from './setup-human_resource-department.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupHumanResourceDepartment } from './entities/setup-human_resource-department.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupHumanResourceDepartment])],

  controllers: [SetupHumanResourceDepartmentController],
  providers: [SetupHumanResourceDepartmentService,DynamicDatabaseService],
})
export class SetupHumanResourceDepartmentModule {}
