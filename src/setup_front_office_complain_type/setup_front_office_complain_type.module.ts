import { Module } from '@nestjs/common';
import { SetupFrontOfficeComplainTypeService } from './setup_front_office_complain_type.service';
import { SetupFrontOfficeComplainTypeController } from './setup_front_office_complain_type.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { SetupFrontOfficeComplainType } from './entities/setup_front_office_complain_type.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupFrontOfficeComplainType])],

  controllers: [SetupFrontOfficeComplainTypeController],
  providers: [SetupFrontOfficeComplainTypeService,DynamicDatabaseService],
})
export class SetupFrontOfficeComplainTypeModule {}
