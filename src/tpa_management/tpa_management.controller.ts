import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TpaManagementService } from './tpa_management.service';
import { TpaManagement } from './entities/tpa_management.entity';

@Controller('tpa-management')
export class TpaManagementController {
  constructor(private readonly tpaManagementService: TpaManagementService) {}

  @Post()
  create(@Body() tpa_managementEntity:TpaManagement) {
    return this.tpaManagementService.create(tpa_managementEntity);
  }

  @Get()
  findAll() {
    return this.tpaManagementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tpaManagementService.findone(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() tpa_managementEntity:TpaManagement) {
    return this.tpaManagementService.update(id, tpa_managementEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Query('hos_id') hos_id: number) {
    return this.tpaManagementService.remove(id,hos_id);
  }
}
