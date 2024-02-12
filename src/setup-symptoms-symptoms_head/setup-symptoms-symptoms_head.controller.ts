import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupSymptomsSymptomsHeadService } from './setup-symptoms-symptoms_head.service';
import { SetupSymptomsSymptomsHead } from './entities/setup-symptoms-symptoms_head.entity';

@Controller('setup-symptoms-symptoms-head')
export class SetupSymptomsSymptomsHeadController {
  constructor(private readonly setupSymptomsSymptomsHeadService: SetupSymptomsSymptomsHeadService) {}

  @Post()
  create(@Body() symptoms_headEntity: SetupSymptomsSymptomsHead ) {
    return this.setupSymptomsSymptomsHeadService.create(symptoms_headEntity);
  }

  @Get()
  findAll() {
    return this.setupSymptomsSymptomsHeadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupSymptomsSymptomsHeadService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()  symptoms_headEntity: SetupSymptomsSymptomsHead ) {
    return this.setupSymptomsSymptomsHeadService.update(id,symptoms_headEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupSymptomsSymptomsHeadService.remove(id);
  }
}
