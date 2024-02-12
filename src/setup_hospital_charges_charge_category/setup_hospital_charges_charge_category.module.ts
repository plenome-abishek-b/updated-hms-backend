import { Module } from '@nestjs/common';
import { SetupHospitalChargesChargeCategoryService } from './setup_hospital_charges_charge_category.service';
import { SetupHospitalChargesChargeCategoryController } from './setup_hospital_charges_charge_category.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupHospitalChargesChargeCategory } from './entities/setup_hospital_charges_charge_category.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupHospitalChargesChargeCategory])],

  controllers: [SetupHospitalChargesChargeCategoryController],
  providers: [SetupHospitalChargesChargeCategoryService,DynamicDatabaseService],
})
export class SetupHospitalChargesChargeCategoryModule {}
