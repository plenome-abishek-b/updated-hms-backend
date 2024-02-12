import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupBedBedGroupService } from './setup-bed-bed_group.service';
import { SetupBedBedGroup } from './entities/setup-bed-bed_group.entity';

@Controller('setup-bed-bed-group')
export class SetupBedBedGroupController {
  constructor(private readonly setupBedBedGroupService: SetupBedBedGroupService) {}

  @Post()
  create(@Body() bed_groupEntity: SetupBedBedGroup) {
    return this.setupBedBedGroupService.create(bed_groupEntity);
  }

  @Get()
  findAll() {
    return this.setupBedBedGroupService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupBedBedGroupService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() bed_groupEntity: SetupBedBedGroup) {
    return this.setupBedBedGroupService.update(id, bed_groupEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupBedBedGroupService.remove(id);
  }
}
