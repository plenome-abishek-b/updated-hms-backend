import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupBedBedTypeService } from './setup-bed-bed_type.service';
import { SetupBedBedType } from './entities/setup-bed-bed_type.entity';

@Controller('setup-bed-bed-type')
export class SetupBedBedTypeController {
  constructor(private readonly setupBedBedTypeService: SetupBedBedTypeService) {}

  @Post()
  create(@Body() bed_typeEntity: SetupBedBedType ) {
    return this.setupBedBedTypeService.create(bed_typeEntity);
  }

  @Get()
  findAll() {
    return this.setupBedBedTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupBedBedTypeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() bed_typeEntity: SetupBedBedType) {
    return this.setupBedBedTypeService.update(id,bed_typeEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupBedBedTypeService.remove(id);
  }
}
