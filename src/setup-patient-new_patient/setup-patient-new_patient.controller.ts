import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupPatientNewPatientService } from './setup-patient-new_patient.service';
import { SetupPatientNewPatient } from './entities/setup-patient-new_patient.entity';

@Controller('setup-patient-new-patient')
export class SetupPatientNewPatientController {
  constructor(private readonly setupPatientNewPatientService: SetupPatientNewPatientService) {}


  @Post()
  create(@Body() new_patientEntity: SetupPatientNewPatient) {
    return this.setupPatientNewPatientService.create(new_patientEntity);
  }

  @Get()
  findAll() {
    return this.setupPatientNewPatientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupPatientNewPatientService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() new_patientEntity: SetupPatientNewPatient) {
    return this.setupPatientNewPatientService.update(id, new_patientEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupPatientNewPatientService.remove(id);
  }
}
