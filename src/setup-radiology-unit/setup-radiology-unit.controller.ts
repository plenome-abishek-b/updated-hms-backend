import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupRadiologyUnitService } from './setup-radiology-unit.service';
import { SetupRadiologyUnit } from './entities/setup-radiology-unit.entity';

@Controller('setup-radiology-unit')
export class SetupRadiologyUnitController {
  constructor(private readonly setupRadiologyUnitService: SetupRadiologyUnitService) {}

  @Post()
  create(@Body()  unitEntity: SetupRadiologyUnit ) {
    return this.setupRadiologyUnitService.create(unitEntity);
  }

 

  @Get()
  findOne() {
    return this.setupRadiologyUnitService.findOne();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()  unitEntity: SetupRadiologyUnit ) {
    return this.setupRadiologyUnitService.update(id, unitEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupRadiologyUnitService.remove(id);
  }
}
