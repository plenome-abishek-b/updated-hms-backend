import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { HumanResourceStaffService } from './human_resource_staff.service';
import { HumanResourceStaff } from './entities/human_resource_staff.entity';
 
@Controller('human-resource-staff')
export class HumanResourceStaffController {
  constructor(private readonly humanResourceStaffService: HumanResourceStaffService) {}
 
  @Post()
  create(@Body() HumanResourceStaffEntity: HumanResourceStaff) {
    return this.humanResourceStaffService.create(HumanResourceStaffEntity);
  }
 
  @Get()
  findAll() {
    return this.humanResourceStaffService.findAll();
  }
 
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.humanResourceStaffService.findOne(id);
  }
 
  @Get('/role/:id')
  findByRole(@Param('id') id: number) {
    return this.humanResourceStaffService.findByRole(id);
  }
 
  @Get('/keyword/:search')
  findByStaffIdNameRole(@Param('search') search: string) {
    console.log(search,"aaaaa");
   
    return this.humanResourceStaffService.findByStaffIdNameRole(search);
  }
 
 
  @Patch('/:id')
  update(@Param('id') id: number, @Body()  HumanResourceStaffENTITY: HumanResourceStaff) {
    return this.humanResourceStaffService.update(id, HumanResourceStaffENTITY);
  }
 
 
 
  @Patch('/password/:id')
  updateStaffPassword(@Param('id') id: number, @Body()  HumanResourceStaffENTITY: HumanResourceStaff) {
    return this.humanResourceStaffService.updateStaffPassword(id, HumanResourceStaffENTITY);
  }
 
 
  @Post('disable/:id')
  async disableStaff(@Param('id') id: number) {
    return this.humanResourceStaffService.disableStaff(id);
  }
 
  @Post('enable/:id')
  async enableStaff(@Param('id') id: number) {
    return this.humanResourceStaffService.enableStaff(id);
  }
 
 
 
 
 
 
  @Delete('/:id')
  async removeStaff(@Param('id') id: number,@Query('hospital_id') hospital_id: number): Promise<{ status: string; message: string }> {
   
      const deletedStaff = await this.humanResourceStaffService.remove(id,hospital_id);
      return {
        status: 'success',
        message: `id: ${id} deleted successfully`,
      };
 
 
    }
 
 
    @Get('/disabled/staff')
    findAllDisableStaff() {
      return this.humanResourceStaffService.findAllDisableStaff();
    }
 
 
 
    @Get('/disabled/role/:id')
    findByDisabledStaffRole(@Param('id') id: number) {
      return this.humanResourceStaffService.findByDisabledStaffRole(id);
    }
 
 
    @Get('/keyword/disabledStaff/:search')
    findByDisabledStaffIdNameRole(@Param('search') search: string) {
      console.log(search,"aaaaa");
     
      return this.humanResourceStaffService.findByDisabledStaffIdNameRole(search);
    }
 
 
}