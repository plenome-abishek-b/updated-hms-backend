import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupHumanResourceSpecialistService } from './setup-human_resource-specialist.service';
import { SetupHumanResourceSpecialist } from './entities/setup-human_resource-specialist.entity';


@Controller('setup-human-resource-specialist')
export class SetupHumanResourceSpecialistController {
  constructor(private readonly setupHumanResourceSpecialistService: SetupHumanResourceSpecialistService) {}

  @Post()
  create(@Body() specialsitEntity: SetupHumanResourceSpecialist) {
    return this.setupHumanResourceSpecialistService.create(specialsitEntity);
  }

  @Get()
  findAll() {
    return this.setupHumanResourceSpecialistService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupHumanResourceSpecialistService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() specialsitEntity: SetupHumanResourceSpecialist) {
    return this.setupHumanResourceSpecialistService.update(id,specialsitEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupHumanResourceSpecialistService.remove(id);
  }
}
