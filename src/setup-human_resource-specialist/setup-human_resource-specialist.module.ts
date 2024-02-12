import { Module } from '@nestjs/common';
import { SetupHumanResourceSpecialistService } from './setup-human_resource-specialist.service';
import { SetupHumanResourceSpecialistController } from './setup-human_resource-specialist.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupHumanResourceSpecialist } from './entities/setup-human_resource-specialist.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupHumanResourceSpecialist])],

  controllers: [SetupHumanResourceSpecialistController],
  providers: [SetupHumanResourceSpecialistService,DynamicDatabaseService],
})
export class SetupHumanResourceSpecialistModule {}
