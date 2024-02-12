import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection, createConnection } from 'typeorm';
import { SettingsRolesPermission } from './entities/settings_roles-permission.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SettingsRolesPermissionsService {
  
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbservice: DynamicDatabaseService
  ){}

  async create(rolesEntity: SettingsRolesPermission) {
    let dynamicConnection
try{
      const result = await this.connection.query(
      `INSERT INTO roles (name, slug, is_active, is_system, is_superadmin) values (?,?,?,?,?)`,
      [
        rolesEntity.name,
        rolesEntity.slug,
        rolesEntity.is_active,
        rolesEntity.is_system,
        rolesEntity.is_superadmin
      ]
    );
   
  

    const dynamicDbConfig = this.dynamicDbservice.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )

      const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
      dynamicConnection = await createConnection(dynamicConnectionOptions);

      const AdminCategory = await dynamicConnection.query(`INSERT INTO roles (name, slug, is_active, is_system, is_superadmin,hospital_id,hospital_roles_id) values (?,?,?,?,?,?,?)`,[
        rolesEntity.name,
        rolesEntity.slug,
        rolesEntity.is_active,
        rolesEntity.is_system,
      rolesEntity.is_superadmin,
      rolesEntity.hospital_id,
      result.insertId
       ])
       console.log("entering if",AdminCategory);
            await dynamicConnection.close();

    return [{"data":{"id: ":result.insertId,
    "status":"success",
    "messege":"roles details added successfully ",
    "inserted_data": await this.connection.query('SELECT * FROM roles WHERE id = ?', [result.insertId])
  }}]
  } catch (error) {
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
  }
  }
  async findAll() {
    const roles = await this.connection.query(`select roles.id, roles.name,roles.is_system from roles`);
    return roles;
  }

  async findone(id:string) {
    const roles = await this.connection.query(`select roles.id, roles.name,roles.is_system from roles where id = ?`, [id]);

    if(roles.length === 1) {
      return roles;
    } else {
      return null;
    }
  }


  async update (id:string, rolesEntity: SettingsRolesPermission) {
    let dynamicConnection;

    try{
      const result = await this.connection.query(
        'update roles SET name = ? where id =?',
        [rolesEntity.name,
        id
      ]
      );

      console.log("ddddd");

      const dynamicDbConfig = this.dynamicDbservice.createDynamicDatabaseConfig(
        process.env.ADMIN_IP,
        process.env.ADMIN_DB_NAME,
        process.env.ADMIN_DB_PASSWORD,
        process.env.ADMIN_DB_USER_NAME
      )

          
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
  dynamicConnection = await createConnection(dynamicConnectionOptions);

  const repo = await dynamicConnection.query(
    `update roles SET name = ? where hospital_roles_id = ? and hospital_id = ?`,

    [
      rolesEntity.name,
      id,
      rolesEntity.hospital_id
    ]
  );
  console.log("wwwwww");

  return [{"data":{
    status:"success",
    "message":"roles details updated successfully",
    "updated_values":await this.connection.query(`select * from roles where id = ?`, [id])
  }}];
    } catch (error) {
      return [
        {status:"failed",
      "message":"cannot update roles profile",
    "error":error
    }
      ]
    }
  }


  async remove(id:string){
    const result = await this.connection.query('delete from roles where id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+ " deleted successfully"
    }]
  }
}
