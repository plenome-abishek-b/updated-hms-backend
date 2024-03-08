import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from './staffcount.entity';

@Injectable()
export class StaffRoleService {
  constructor(
    @InjectRepository(Roles)
    private staffRoleRepository: Repository<Roles>,
  ) {}

  async getStaffRolesCount(): Promise<any[]> {
    const query = `SELECT roles.name AS role_name, COUNT(staff_roles.staff_id) AS staff_count
    FROM roles 
    LEFT JOIN staff_roles ON roles.id = staff_roles.role_id
    GROUP BY roles.name;
    `
    return this.staffRoleRepository.query(query);
      
  }
}
