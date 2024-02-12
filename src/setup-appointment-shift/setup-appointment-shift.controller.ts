import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupAppointmentShiftService } from './setup-appointment-shift.service';
import { SetupAppointmentShift } from './entities/setup-appointment-shift.entity';

@Controller('setup-appointment-shift')
export class SetupAppointmentShiftController {
  constructor(private readonly setupAppointmentShiftService: SetupAppointmentShiftService) {}

  @Post()
  create(@Body() appointment_shiftEntity: SetupAppointmentShift  ) {
    return this.setupAppointmentShiftService.create(appointment_shiftEntity);
  }

  @Get()
  findAll() {
    return this.setupAppointmentShiftService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupAppointmentShiftService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() appointment_shiftEntity: SetupAppointmentShift ) {
    return this.setupAppointmentShiftService.update(id,appointment_shiftEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupAppointmentShiftService.remove(id);
  }
}
