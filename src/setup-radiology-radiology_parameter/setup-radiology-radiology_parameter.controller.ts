import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupRadiologyRadiologyParameterService } from './setup-radiology-radiology_parameter.service';
import { SetupRadiologyRadiologyParameter } from './entities/setup-radiology-radiology_parameter.entity';

@Controller('setup-radiology-radiology-parameter')
export class SetupRadiologyRadiologyParameterController {
  constructor(private readonly setupRadiologyRadiologyParameterService: SetupRadiologyRadiologyParameterService) {}

  @Post()
  create(@Body() radiology_parameterEntity: SetupRadiologyRadiologyParameter) {
    return this.setupRadiologyRadiologyParameterService.create(radiology_parameterEntity);
  }

  @Get()
  findAll() {
    return this.setupRadiologyRadiologyParameterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupRadiologyRadiologyParameterService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() radiology_parameterEntity: SetupRadiologyRadiologyParameter) {
    return this.setupRadiologyRadiologyParameterService.update(id,radiology_parameterEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupRadiologyRadiologyParameterService.remove(id);
  }
}
