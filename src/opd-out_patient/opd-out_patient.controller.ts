import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OpdOutPatientService } from './opd-out_patient.service';
import { OpdOutPatient } from './entities/opd-out_patient.entity';
@Controller('opd-out-patient')
export class OpdOutPatientController {
  constructor(private readonly opdOutPatientService: OpdOutPatientService) {}

  @Post()
  create(@Body() opd_entity:OpdOutPatient) {
    return this.opdOutPatientService.create(opd_entity);
  }

  @Get()
  findAll() {
    return this.opdOutPatientService.findAll();
  }

  @Get('/one')
  findOne(@Query('search') search: string) {
    console.log("varudhuuuuuuu");
    
    return this.opdOutPatientService.findOne(search);
  }

  

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.opdOutPatientService.remove(+id);
  // }
}
