import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupFrontOfficeAppointmentPriorityService } from './setup_front_office_appointment_priority.service';
import { SetupFrontOfficeAppointmentPriority } from './entities/setup_front_office_appointment_priority.entity';

@Controller('setup-front-office-appointment-priority')
export class SetupFrontOfficeAppointmentPriorityController {
  constructor(private readonly setupFrontOfficeAppointmentPriorityService: SetupFrontOfficeAppointmentPriorityService) {}

  @Post()
  create(@Body() appointment_priorityEntity : SetupFrontOfficeAppointmentPriority) {
    return this.setupFrontOfficeAppointmentPriorityService.create(appointment_priorityEntity);
  }

  @Get()
  findAll() {
    return this.setupFrontOfficeAppointmentPriorityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupFrontOfficeAppointmentPriorityService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() appointment_priority : SetupFrontOfficeAppointmentPriority ) {
    return this.setupFrontOfficeAppointmentPriorityService.update(+id,appointment_priority );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupFrontOfficeAppointmentPriorityService.remove(id);
  }
}
