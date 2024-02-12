import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupReferralReferralCommissionService } from './setup-referral-referral_commission.service';
import { SetupReferralReferralCommission } from './entities/setup-referral-referral_commission.entity';


@Controller('setup-referral-referral-commission')
export class SetupReferralReferralCommissionController {
  constructor(private readonly setupReferralReferralCommissionService: SetupReferralReferralCommissionService) {}

  @Post()
  create(@Body() referral_commissionEntity: SetupReferralReferralCommission ) {
    console.log(referral_commissionEntity);
    
    return this.setupReferralReferralCommissionService.create(referral_commissionEntity);
  }

  @Get()
  findAll() {
    return this.setupReferralReferralCommissionService.findAll();
  }

 

  @Patch(':id')
  update(@Param('id') id: string, @Body()  referral_commissionEntity: SetupReferralReferralCommission ) {
    return this.setupReferralReferralCommissionService.update(id, referral_commissionEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupReferralReferralCommissionService.remove(id);
  }
}
