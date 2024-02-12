import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ModulesPatientService } from './modules_patient.service';
import { CreateModulesPatientDto } from './dto/create-modules_patient.dto';
import { UpdateModulesPatientDto } from './dto/update-modules_patient.dto';

@Controller('modules-patient')
export class ModulesPatientController {
  constructor(private readonly modulesPatientService: ModulesPatientService) {}

  @Post()
  create(@Body() createModulesPatientDto: CreateModulesPatientDto) {
    return this.modulesPatientService.create(createModulesPatientDto);
  }

  @Get()
  findAll() {
    return this.modulesPatientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modulesPatientService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModulesPatientDto: UpdateModulesPatientDto) {
    return this.modulesPatientService.update(+id, updateModulesPatientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.modulesPatientService.remove(+id);
  }
}
