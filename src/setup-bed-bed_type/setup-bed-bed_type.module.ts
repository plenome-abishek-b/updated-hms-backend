import { Module } from '@nestjs/common';
import { SetupBedBedTypeService } from './setup-bed-bed_type.service';
import { SetupBedBedTypeController } from './setup-bed-bed_type.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupBedBedType } from './entities/setup-bed-bed_type.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupBedBedType])],

  controllers: [SetupBedBedTypeController],
  providers: [SetupBedBedTypeService,DynamicDatabaseService],
})
export class SetupBedBedTypeModule {}
