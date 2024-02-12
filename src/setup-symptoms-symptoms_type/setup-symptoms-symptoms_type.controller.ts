import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupSymptomsSymptomsTypeService } from './setup-symptoms-symptoms_type.service';
import { SetupSymptomsSymptomsType } from './entities/setup-symptoms-symptoms_type.entity';


@Controller('setup-symptoms-symptoms-type')
export class SetupSymptomsSymptomsTypeController {
  constructor(private readonly setupSymptomsSymptomsTypeService: SetupSymptomsSymptomsTypeService) {}

  @Post()
  create(@Body()  symptoms_typeEntity: SetupSymptomsSymptomsType) {
    return this.setupSymptomsSymptomsTypeService.create(symptoms_typeEntity);
  }

  @Get()
  findAll() {
    return this.setupSymptomsSymptomsTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupSymptomsSymptomsTypeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() symptoms_typeEntity: SetupSymptomsSymptomsType) {
    return this.setupSymptomsSymptomsTypeService.update(id, symptoms_typeEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupSymptomsSymptomsTypeService.remove(id);
  }
}
