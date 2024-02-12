import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupReferralReferralCategoryService } from './setup-referral-referral_category.service';
import { SetupReferralReferralCategory } from './entities/setup-referral-referral_category.entity';

@Controller('setup-referral-referral-category')
export class SetupReferralReferralCategoryController {
  constructor(private readonly setupReferralReferralCategoryService: SetupReferralReferralCategoryService) {}

  @Post()
  create(@Body() referral_categoryEntity: SetupReferralReferralCategory ) {
    return this.setupReferralReferralCategoryService.create(referral_categoryEntity);
  }

  @Get()
  findAll() {
    return this.setupReferralReferralCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupReferralReferralCategoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()  referral_categoryEntity: SetupReferralReferralCategory ) {
    return this.setupReferralReferralCategoryService.update(id,referral_categoryEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupReferralReferralCategoryService.remove(id);
  }
}
