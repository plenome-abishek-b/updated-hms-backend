import { Module } from '@nestjs/common';
import {  tax_categoryservice } from './setup_hospital_charges_tax_category.service';
import { SetupHospitalChargesTaxCategoryController } from './setup_hospital_charges_tax_category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupHospitalChargesTaxCategory } from './entities/setup_hospital_charges_tax_category.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupHospitalChargesTaxCategory])],

  controllers: [SetupHospitalChargesTaxCategoryController],
  providers: [tax_categoryservice,DynamicDatabaseService],
})
export class SetupHospitalChargesTaxCategoryModule {}
