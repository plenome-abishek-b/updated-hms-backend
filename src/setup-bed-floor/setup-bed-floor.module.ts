import { Module } from '@nestjs/common';
import { SetupBedFloorService } from './setup-bed-floor.service';
import { SetupBedFloorController } from './setup-bed-floor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupBedFloorService])],

  controllers: [SetupBedFloorController],
  providers: [SetupBedFloorService,DynamicDatabaseService],
})
export class SetupBedFloorModule {}
