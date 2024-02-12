import { Module } from '@nestjs/common';
import { SetupApptSlotAmountService } from './setup_appt_slot_amount.service';
import { SetupApptSlotAmountController } from './setup_appt_slot_amount.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupApptSlotAmount } from './entities/setup_appt_slot_amount.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupApptSlotAmount])],

  controllers: [SetupApptSlotAmountController],
  providers: [SetupApptSlotAmountService,DynamicDatabaseService],
})
export class SetupApptSlotAmountModule {}
