import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HumanResourceAddStaffService } from './human_resource-add_staff.service';
import { HumanResourceAddStaff } from './entities/human_resource-add_staff.entity';


@Controller('human-resource-add-staff')
export class HumanResourceAddStaffController {
  constructor(private readonly humanResourceAddStaffService: HumanResourceAddStaffService) {}

  @Post()
  create(@Body() add_staffEntity: HumanResourceAddStaff ) {
    console.log(add_staffEntity);
    
    return this.humanResourceAddStaffService.create(add_staffEntity);
    
  }

  @Get()
  findAll(@Query("role_id")role_id) {
    return this.humanResourceAddStaffService.findAll(role_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.humanResourceAddStaffService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() add_staffEntity: HumanResourceAddStaff ) {
    console.log("add_staffEntity",add_staffEntity)
    return this.humanResourceAddStaffService.update(id, add_staffEntity);

  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.humanResourceAddStaffService.remove(id);
  }
}
