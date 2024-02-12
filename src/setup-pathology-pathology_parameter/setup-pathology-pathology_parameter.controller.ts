import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupPathologyPathologyParameter } from './entities/setup-pathology-pathology_parameter.entity';
import { SetupPathologyPathologyParameterService } from './setup-pathology-pathology_parameter.service';

@Controller('setup-pathology-pathology-parameter')
export class SetupPathologyPathologyParameterController {
  constructor(private readonly pathology_parameterService: SetupPathologyPathologyParameterService) {}

  @Post()
  create(@Body() pathology_parameterEntity: SetupPathologyPathologyParameter) {
    return this.pathology_parameterService.create(pathology_parameterEntity);
  }

  @Get()
  findAll() {
    return this.pathology_parameterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pathology_parameterService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()  pathology_parameterEntity: SetupPathologyPathologyParameter) {
    return this.pathology_parameterService.update(id,pathology_parameterEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pathology_parameterService.remove(id);
  }
}
