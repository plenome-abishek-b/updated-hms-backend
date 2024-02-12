import { Module } from '@nestjs/common';
import { SetupApptSlotTimimgsService } from './setup_appt_slot_timimgs.service';
import { SetupApptSlotTimimgsController } from './setup_appt_slot_timimgs.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupApptSlotTimimg } from './entities/setup_appt_slot_timimg.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupApptSlotTimimg])],

  controllers: [SetupApptSlotTimimgsController],
  providers: [SetupApptSlotTimimgsService,DynamicDatabaseService],
})
export class SetupApptSlotTimimgsModule {}
