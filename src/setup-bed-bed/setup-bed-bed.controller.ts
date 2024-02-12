import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupBedBedService } from './setup-bed-bed.service';
import { SetupBedBed } from './entities/setup-bed-bed.entity';
@Controller('setup-bed-bed')
export class SetupBedBedController {
  constructor(private readonly setupBedBedService: SetupBedBedService) {}

  @Post()
  create(@Body() bedEntity: SetupBedBed) {
    return this.setupBedBedService.create(bedEntity);
  }

  @Get()
  findAll() {
    return this.setupBedBedService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupBedBedService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() bedEntity: SetupBedBed) {
    return this.setupBedBedService.update(id, bedEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupBedBedService.remove(id);
  }
}
