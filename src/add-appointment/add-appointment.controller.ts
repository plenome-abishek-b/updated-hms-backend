import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AddAppointmentService } from './add-appointment.service';
import { AddAppointment } from './entities/add-appointment.entity';
 
@Controller('add-appointment')
export class AddAppointmentController {
  constructor(private readonly addAppointmentService: AddAppointmentService) {}
 
  @Post()
  create(@Body() add_appointment:AddAppointment) {
    return this.addAppointmentService.create(add_appointment);
  }
 
  @Get()
  findAll() {
    return this.addAppointmentService.findAll();
  }
 
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.addAppointmentService.findOne(id);
  }
 
  @Patch(':id')
  update(@Param('id') id: string, @Body() add_appointment:AddAppointment) {
    return this.addAppointmentService.update(+id, add_appointment);
  }
 
  @Delete(':id')
  remove(@Param('id') id: string,@Query('hos_id') hos_id: number) {
    return this.addAppointmentService.remove(id,hos_id);
  }
}