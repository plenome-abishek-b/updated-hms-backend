import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupPathologyUnitService } from './setup-pathology-unit.service';
import { SetupPathologyUnit } from './entities/setup-pathology-unit.entity';


@Controller('setup-pathology-unit')
export class SetupPathologyUnitController {
  constructor(private readonly setupPathologyUnitService: SetupPathologyUnitService) {}

  @Post()
  create(@Body() unitEntity: SetupPathologyUnit ) {
    return this.setupPathologyUnitService.create(unitEntity);
  }

  @Get()
  findAll() {
    return this.setupPathologyUnitService.findAll();
  }

  

  @Patch(':id')
  update(@Param('id') id: string, @Body() unitEntity: SetupPathologyUnit) {
    return this.setupPathologyUnitService.update(id, unitEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupPathologyUnitService.remove(id);
  }
}
