/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupPatientDisabledPatientListService } from './setup-patient-disabled_patient_list.service';
 
@Controller('setup-patient-disabled-patient-list')
export class SetupPatientDisabledPatientListController {
  constructor(private readonly setupPatientDisabledPatientListService: SetupPatientDisabledPatientListService) {}
 
 
  @Get()
  findAll() {
    return this.setupPatientDisabledPatientListService.findAll();
  }
  @Patch(':id')
  update(@Param('id')id:number,@Body()data:any){
    return this.setupPatientDisabledPatientListService.update(id,data)
  }
 
 
}