import { Module } from '@nestjs/common';
import { SetupBedBedGroupService } from './setup-bed-bed_group.service';
import { SetupBedBedGroupController } from './setup-bed-bed_group.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupBedBedGroup } from './entities/setup-bed-bed_group.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupBedBedGroup])],

  controllers: [SetupBedBedGroupController],
  providers: [SetupBedBedGroupService,DynamicDatabaseService],
})
export class SetupBedBedGroupModule {}
