import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupFindingsFindingService } from './setup-findings-finding.service';
import { SetupFindingsFinding } from './entities/setup-findings-finding.entity';

@Controller('setup-findings-finding')
export class SetupFindingsFindingController {
  constructor(private readonly setupFindingsFindingService: SetupFindingsFindingService) {}

  @Post()
  create(@Body() findingEntity: SetupFindingsFinding ) {
    return this.setupFindingsFindingService.create(findingEntity);
  }

  @Get()
  findAll() {
    return this.setupFindingsFindingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupFindingsFindingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() findingEntity: SetupFindingsFinding  ) {
    return this.setupFindingsFindingService.update(id,findingEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupFindingsFindingService.remove(id);
  }
}
