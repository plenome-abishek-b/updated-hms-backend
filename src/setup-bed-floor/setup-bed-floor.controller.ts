import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupBedFloorService } from './setup-bed-floor.service';
import { SetupBedFloor } from './entities/setup-bed-floor.entity';

@Controller('setup-bed-floor')
export class SetupBedFloorController {
  constructor(private readonly setupBedFloorService: SetupBedFloorService) {}

  @Post()
  create(@Body() floorEntity: SetupBedFloor) {
    return this.setupBedFloorService.create(floorEntity);
  }

  @Get()
  findAll() {
    return this.setupBedFloorService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupBedFloorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() floorEntity: SetupBedFloor ) {
    return this.setupBedFloorService.update(id,floorEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupBedFloorService.remove(id);
  }
}
