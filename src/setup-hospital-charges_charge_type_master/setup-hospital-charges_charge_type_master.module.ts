import { Module } from '@nestjs/common';
import { SetupHospitalChargesChargeTypeMasterService } from './setup-hospital-charges_charge_type_master.service';
import { SetupHospitalChargesChargeTypeMasterController } from './setup-hospital-charges_charge_type_master.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { SetupHospitalChargesChargeTypeMaster } from './entities/setup-hospital-charges_charge_type_master.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupHospitalChargesChargeTypeMaster])],

  controllers: [SetupHospitalChargesChargeTypeMasterController],
  providers: [SetupHospitalChargesChargeTypeMasterService,DynamicDatabaseService],
})
export class SetupHospitalChargesChargeTypeMasterModule {}
