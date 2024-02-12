import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupHumanResourceDesignationService } from './setup-human_resource-designation.service';
import { SetupHumanResourceDesignation } from './entities/setup-human_resource-designation.entity';


@Controller('setup-human-resource-designation')
export class SetupHumanResourceDesignationController {
  constructor(private readonly setupHumanResourceDesignationService: SetupHumanResourceDesignationService) {}

  @Post()
  create(@Body() designationEntity:SetupHumanResourceDesignation ) {
    return this.setupHumanResourceDesignationService.create(designationEntity);
  }

  @Get()
  findAll() {
    return this.setupHumanResourceDesignationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupHumanResourceDesignationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() designationEntity:SetupHumanResourceDesignation ) {
    return this.setupHumanResourceDesignationService.update(id, designationEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupHumanResourceDesignationService.remove(id);
  }
}
