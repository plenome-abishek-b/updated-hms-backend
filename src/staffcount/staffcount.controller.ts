import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { StaffRoleService } from './staffcount.service';
import { Roles } from './staffcount.entity';

@Controller('staff_roles')
export class RoleController {
  constructor(private readonly roleService: StaffRoleService) {}

  @Get()
  async findAll(): Promise<Roles[]> {
    return this.roleService.getStaffRolesCount();
  }
}