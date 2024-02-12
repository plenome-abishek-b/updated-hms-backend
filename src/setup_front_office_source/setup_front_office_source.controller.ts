import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupFrontOfficeSourceService } from './setup_front_office_source.service';
import { SetupFrontOfficeSource } from './entities/setup_front_office_source.entity';
@Controller('setup-front-office-source')

export class SetupFrontOfficeSourceController {
  constructor(private readonly setupFrontOfficeSourceService: SetupFrontOfficeSourceService) {}

  @Post()
  create(@Body() SetupFrontOfficeSourceEntity : SetupFrontOfficeSource) {
    return this.setupFrontOfficeSourceService.create(SetupFrontOfficeSourceEntity);
  }

  @Get()
  findAll() {
    return this.setupFrontOfficeSourceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupFrontOfficeSourceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() SetupFrontOfficeSourceEntity: SetupFrontOfficeSource) {
    return this.setupFrontOfficeSourceService.update(id,SetupFrontOfficeSourceEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupFrontOfficeSourceService.remove(id);
  }
}
