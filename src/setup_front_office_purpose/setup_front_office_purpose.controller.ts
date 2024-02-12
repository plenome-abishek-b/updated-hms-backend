import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupFrontOfficePurposeService } from './setup_front_office_purpose.service';
import { SetupFrontOfficePurpose } from './entities/setup_front_office_purpose.entity';

@Controller('setup-front-office-purpose')
export class SetupFrontOfficePurposeController {
  constructor(private readonly setupFrontOfficePurposeService: SetupFrontOfficePurposeService) {}

  @Post()
  create(@Body() purposeEntity:SetupFrontOfficePurpose) {
    return this.setupFrontOfficePurposeService.create(purposeEntity);
  }

  @Get()
  findAll() {
    return this.setupFrontOfficePurposeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupFrontOfficePurposeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() purposeEntity:SetupFrontOfficePurpose ) {
    return this.setupFrontOfficePurposeService.update(id,purposeEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupFrontOfficePurposeService.remove(id);
  }
}
