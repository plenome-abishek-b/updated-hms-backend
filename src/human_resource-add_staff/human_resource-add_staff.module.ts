import { Module } from '@nestjs/common';
import { HumanResourceAddStaffService } from './human_resource-add_staff.service';
import { HumanResourceAddStaffController } from './human_resource-add_staff.controller';

@Module({
  controllers: [HumanResourceAddStaffController],
  providers: [HumanResourceAddStaffService],
})
export class HumanResourceAddStaffModule {}
