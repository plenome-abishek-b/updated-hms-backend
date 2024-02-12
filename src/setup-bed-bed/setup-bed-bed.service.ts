import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import { SetupBedBed } from './entities/setup-bed-bed.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class SetupBedBedService {
  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService

  ) {}
  
  async create(bedEntity: SetupBedBed ): Promise<{ [key: string]: any }[]> {
   let dynamicConnection;
   try{
    const result = await this.connection.query(
      'INSERT INTO bed (name,bed_type_id,bed_group_id,is_active) VALUES (?,?,?,?)',
      [bedEntity.name,
        bedEntity.bed_type_id,
        bedEntity.bed_group_id,
        bedEntity.is_active,
       
      ]
    );

    const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

      process.env.ADMIN_IP,
      process.env.ADMIN_DB_NAME,
      process.env.ADMIN_DB_PASSWORD,
      process.env.ADMIN_DB_USER_NAME
      )
      
    const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
     dynamicConnection = await createConnection(dynamicConnectionOptions);
   
     console.log("dddd");

const [bed_type] = await dynamicConnection.query(`select id from bed_type where Hospital_id = ? and hospital_bed_type_id = ?`,[
  bedEntity.Hospital_id,
  bedEntity.bed_type_id
])

const [bed_group] = await dynamicConnection.query(`select id from bed_group where Hospital_id =? and hospital_bed_group_id = ?`,[
  bedEntity.Hospital_id,
  bedEntity.bed_group_id
])

    const AdminCategory = await dynamicConnection.query('INSERT INTO bed (name,bed_type_id,bed_group_id,is_active,Hospital_id,hospital_bed_id) values (?,?,?,?,?,?) ',[
      bedEntity.name,
      bed_type.id,
      bed_group.id,
      bedEntity.is_active,
      bedEntity.Hospital_id,
      result.insertId
    ])
    console.log("entering if",AdminCategory);
    await dynamicConnection.close();

   
    return  [{"data ":{"id  ":result.insertId,
              "status":"success",
              "messege":"bed details added successfully ",
              "inserted_data": await this.connection.query('SELECT * FROM bed WHERE id = ?', [result.insertId])
              }}];
  } catch (error){
    if(dynamicConnection){
      await dynamicConnection.close();
      return error
    }
    }
  }




  async findAll(): Promise<SetupBedBed[]> {
    const bed = await this.connection.query("SELECT bed.id,bed.name, bed.is_active as used, bed_type.name as Bed_Type, CONCAT(bed_group.name, '-', floor.name) AS bed_group FROM bed JOIN bed_type ON bed.bed_type_id = bed_type.id JOIN bed_group ON bed.bed_group_id = bed_group.id JOIN floor ON bed_group.floor = floor.id");
    return bed  ;
  }

  
  async findOne(id: string): Promise<SetupBedBed | null> {
    const bed = await this.connection.query("SELECT bed.id, bed.name, bed.is_active as used, bed_type.name as Bed_Type, CONCAT(bed_group.name, '-', floor.name) AS bed_group FROM bed JOIN bed_type ON bed.bed_type_id = bed_type.id JOIN bed_group ON bed.bed_group_id = bed_group.id JOIN floor ON bed_group.floor = floor.id WHERE bed.id = ?", [id]);
    
    if (bed.length === 1) {
      return bed ;
    } else {
      return null;
    }
  }


  async update(id: string, bedEntity: SetupBedBed ): Promise<{ [key: string]: any }[]> {
    let dynamicConnection;

    try {
      
      const result = await this.connection.query(
        'UPDATE bed SET name =?, bed_type_id =?, bed_group_id =?, is_active =? WHERE id = ?',
        [bedEntity.name, 
          bedEntity.bed_type_id,
          bedEntity.bed_group_id,
          bedEntity.is_active,
         id
        ]
      );
  console.log("kkkkkkkk");

  
  const dynamicDbConfig = this.dynamicDbService.createDynamicDatabaseConfig(

    process.env.ADMIN_IP,
    process.env.ADMIN_DB_NAME,
    process.env.ADMIN_DB_PASSWORD,
    process.env.ADMIN_DB_USER_NAME
    )
    
  const dynamicConnectionOptions: MysqlConnectionOptions = dynamicDbConfig as MysqlConnectionOptions;
   dynamicConnection = await createConnection(dynamicConnectionOptions);

  const repo = await dynamicConnection.query(
    'update bed SET  name =?, bed_type_id =?, bed_group_id =?, is_active =? where hospital_bed_id = ? and Hospital_id = ?',
    [
      bedEntity.name,
      bedEntity.bed_type_id,
      bedEntity.bed_group_id,
      bedEntity.is_active,
      id,
      bedEntity.Hospital_id
    ]
  )
  
      return  [{"data ":{
      status:"success",
      "messege":"bed details updated successfully inserted",
      "updated_values":await this.connection.query('SELECT * FROM bed WHERE id = ?', [id])
      }}];
    } catch (error) {
      return [
        {status:"failed",
         "messege":"cannot update bed profile",
         "error":error
      }
      ]
    }
  }

  async remove(id: string): Promise<{ [key: string]: any }[]> {
    const result = await this.connection.query('DELETE FROM bed WHERE id = ?', [id]);
    return [{
      "status":"success",
      "message":" id: "+ id+" deleted successfully"
    }
    ];
  }
}
