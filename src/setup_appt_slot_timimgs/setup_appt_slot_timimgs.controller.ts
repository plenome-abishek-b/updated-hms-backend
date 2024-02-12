import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SetupApptSlotTimimgsService } from './setup_appt_slot_timimgs.service';
import { SetupApptSlotTimimg } from './entities/setup_appt_slot_timimg.entity';

@Controller('setup-appt-slot-timimgs')
export class SetupApptSlotTimimgsController {
  constructor(private readonly setupApptSlotTimimgsService: SetupApptSlotTimimgsService) {}

  @Post()
  create(@Body() timingEntity: SetupApptSlotTimimg) {
    return this.setupApptSlotTimimgsService.create(timingEntity);
  }

  @Get()
  findAll(@Query('day')day:string,@Query('staff_id')staff_id:number,@Query('shift_id')shift_id:number) {
    return this.setupApptSlotTimimgsService.finforDocAndShift(day,staff_id,shift_id);
  }



  @Patch(':id')
  update(@Param('id') id: string, @Body()  timingEntity: SetupApptSlotTimimg) {
    return this.setupApptSlotTimimgsService.update(+id, timingEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupApptSlotTimimgsService.remove(+id);
  }
}
