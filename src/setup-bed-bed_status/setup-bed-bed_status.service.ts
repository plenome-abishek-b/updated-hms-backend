import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';


@Injectable()
export class SetupBedBedStatusService {
  constructor(@InjectConnection() private connection: Connection) {}

 
  async findAll(): Promise<SetupBedBedStatusService[]> {
    const bed_status = await this.connection.query(`select bed.id, bed.name,bed.is_active as status,bed_type.name AS bed_type,bed_group.name AS bed_group,
    floor.name As floor from bed join bed_type ON bed.bed_type_id = bed_type.id join bed_group ON bed.bed_group_id = bed_group.id  
    left join floor on bed_group.floor = floor.id;`);
    return bed_status ;
  }

  
  async findOne(id: string): Promise<SetupBedBedStatusService | null> {
    const bed_status = await this.connection.query(`select bed.id, bed.name,bed.is_active as status,bed_type.name AS bed_type,bed_group.name AS bed_group,
    floor.name As floor from bed join bed_type ON bed.bed_type_id = bed_type.id join bed_group ON bed.bed_group_id = bed_group.id  
    left join floor on bed_group.floor = floor.id WHERE bed_status.id = ?`, [id]);
    
    if (bed_status.length === 1) {
      return bed_status ;
    } else {
      return null;
    }
  }



  
  // async searchBybed_sattus(name: any, bed_type: any, bed_group: any, floor: any, status: any) {
  // let searchquery = "select bed.name,bed.is_active,bed_type.name,bed_group.name,floor.name from bed join bed_type ON bed.bed_type_id = bed_type.id join bed_group ON bed.bed_group_id = bed_group.id  join floor on bed_group.floor = floor.id ";
  // if (name && bed_type && bed_group &&floor && status)   {
  //   searchquery += `WHERE name LIKE '%${name}%' AND  bed.is_active ` 
  // }
 
     
  // }
  
}
