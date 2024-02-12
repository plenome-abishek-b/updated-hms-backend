import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupFrontOfficeComplainTypeService } from './setup_front_office_complain_type.service';
import { SetupFrontOfficeComplainType } from './entities/setup_front_office_complain_type.entity';

@Controller('setup-front-office-complain-type')
export class SetupFrontOfficeComplainTypeController {
  constructor(private readonly setupFrontOfficeComplainTypeService: SetupFrontOfficeComplainTypeService) {}

  @Post()
  create(@Body() complaintypeEntity:SetupFrontOfficeComplainType ) {
    return this.setupFrontOfficeComplainTypeService.create(complaintypeEntity);
  }

  @Get()
  findAll() {
    return this.setupFrontOfficeComplainTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupFrontOfficeComplainTypeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()  complaintypeEntity:SetupFrontOfficeComplainType) {
    return this.setupFrontOfficeComplainTypeService.update(id,complaintypeEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupFrontOfficeComplainTypeService.remove(id);
  }
}
