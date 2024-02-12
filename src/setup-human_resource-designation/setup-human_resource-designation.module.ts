import { Module } from '@nestjs/common';
import { SetupHumanResourceDesignationService } from './setup-human_resource-designation.service';
import { SetupHumanResourceDesignationController } from './setup-human_resource-designation.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupHumanResourceDesignation } from './entities/setup-human_resource-designation.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupHumanResourceDesignation])],

  controllers: [SetupHumanResourceDesignationController],
  providers: [SetupHumanResourceDesignationService,DynamicDatabaseService],
})
export class SetupHumanResourceDesignationModule {}
