import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupHospitalChargesUnitTypeModule } from './setup_hospital_charges_unit_type/setup_hospital_charges_unit_type.module';
import { SetupHospitalChargesTaxCategoryModule } from './setup_hospital_charges_tax_category/setup_hospital_charges_tax_category.module';
import { SetupHospitalChargesChargeCategoryModule } from './setup_hospital_charges_charge_category/setup_hospital_charges_charge_category.module';
import { SetupFrontOfficeAppointmentPriorityModule } from './setup_front_office_appointment_priority/setup_front_office_appointment_priority.module';
import { SetupFrontOfficeSourceModule } from './setup_front_office_source/setup_front_office_source.module';
import { SetupFrontOfficeComplainTypeModule } from './setup_front_office_complain_type/setup_front_office_complain_type.module';
import { SetupFrontOfficePurposeModule } from './setup_front_office_purpose/setup_front_office_purpose.module';
import { SetupPharmacyDoseDurationModule } from './setup_pharmacy_dose_duration/setup_pharmacy_dose_duration.module';
import { SetupPharmacyDoseIntervalModule } from './setup-pharmacy-dose_interval/setup-pharmacy-dose_interval.module';
import { MedicineCategoryModule} from './setup_pharmacy_medicine_category/setup_pharmacy_medicine_category.module';
import { SetupPharmacySupplierModule } from './setup_pharmacy_supplier/setup_pharmacy_supplier.module';
import { SetupPharmacyMedicineDosageModule } from './setup_pharmacy_medicine_dosage/setup_pharmacy_medicine_dosage.module';
import { FindingsCategoryModule } from './findings_category/findings_category.module';
import { SetupFindingsFindingModule } from './setup-findings-finding/setup-findings-finding.module';
import { SetupPathologyPathologyCategoryModule } from './setup-pathology-pathology_category/setup-pathology-pathology_category.module';
import { SetupPathologyUnitModule } from './setup-pathology-unit/setup-pathology-unit.module';
import { SetupPathologyPathologyParameterModule } from './setup-pathology-pathology_parameter/setup-pathology-pathology_parameter.module';
import { SetupOperationOperationCategoryModule } from './setup-operation-operation_category/setup-operation-operation_category.module';
import { SetupOperationOperationModule } from './setup-operation-operation/setup-operation-operation.module';
import { OtpModule } from './otp/otp.module';
import { SetupRadiologyRadiologyCategoryModule } from './setup-radiology-radiology_category/setup-radiology-radiology_category.module';
import { SetupRadiologyUnitModule } from './setup-radiology-unit/setup-radiology-unit.module';
import { SetupRadiologyRadiologyParameterModule } from './setup-radiology-radiology_parameter/setup-radiology-radiology_parameter.module';
import { SetupBloodBankProductsModule } from './setup-blood_bank-products/setup-blood_bank-products.module';
import { SetupHospitalChargesChargeTypeMasterModule } from './setup-hospital-charges_charge_type_master/setup-hospital-charges_charge_type_master.module';
import { SetupHospitalChargesChargeTypeModuleModule } from './setup-hospital-charges_charge_type_module/setup-hospital-charges_charge_type_module.module';
import { SetupHospitalChargeChargesModule } from './setup-hospital_charge-charges/setup-hospital_charge-charges.module';
import { SetupSymptomsSymptomsTypeModule } from './setup-symptoms-symptoms_type/setup-symptoms-symptoms_type.module';
import { SetupSymptomsSymptomsHeadModule } from './setup-symptoms-symptoms_head/setup-symptoms-symptoms_head.module';
import { SetupFinanceIncomeHeadModule } from './setup-finance-income_head/setup-finance-income_head.module';
import { SetupFinanceExpenseHeadModule } from './setup-finance-expense_head/setup-finance-expense_head.module';
import { SetupInventoryItemCategoryModule } from './setup-inventory-item_category/setup-inventory-item_category.module';
import { SetupInventoryItemStoreModule } from './setup-inventory-item_store/setup-inventory-item_store.module';
import { SetupInventoryItemSupplierModule } from './setup-inventory-item_supplier/setup-inventory-item_supplier.module';
import { SetupBedFloorModule } from './setup-bed-floor/setup-bed-floor.module';
import { SetupBedBedTypeModule } from './setup-bed-bed_type/setup-bed-bed_type.module';
import { SetupBedBedGroupModule } from './setup-bed-bed_group/setup-bed-bed_group.module';
import { SetupBedBedModule } from './setup-bed-bed/setup-bed-bed.module';
import { SetupBedBedStatusModule } from './setup-bed-bed_status/setup-bed-bed_status.module';
import { SetupHumanResourceSpecialistModule } from './setup-human_resource-specialist/setup-human_resource-specialist.module';
import { SetupHumanResourceDesignationModule } from './setup-human_resource-designation/setup-human_resource-designation.module';
import { SetupHumanResourceDepartmentModule } from './setup-human_resource-department/setup-human_resource-department.module';
import { SetupHumanResourceLeaveTypesModule } from './setup-human_resource-leave_types/setup-human_resource-leave_types.module';
import { SetupReferralReferralCategoryModule } from './setup-referral-referral_category/setup-referral-referral_category.module';
import { SetupPatientNewPatientModule } from './setup-patient-new_patient/setup-patient-new_patient.module';
import { SetupAppointmentShiftModule } from './setup-appointment-shift/setup-appointment-shift.module';
import { SetupAppointmentDoctorShiftModule } from './setup-appointment-doctor_shift/setup-appointment-doctor_shift.module';
import { SetupPatientDisabledPatientListModule } from './setup-patient-disabled_patient_list/setup-patient-disabled_patient_list.module';
import { SetupApptSlotAmountModule } from './setup_appt_slot_amount/setup_appt_slot_amount.module';
import { SetupApptSlotTimimgsModule } from './setup_appt_slot_timimgs/setup_appt_slot_timimgs.module';
import { SetupReferralReferralCommissionModule } from './setup-referral-referral_commission/setup-referral-referral_commission.module';
// import { HumanResourceAddStaffModule } from './human_resource-add_staff/human_resource-add_staff.module';
import { AddAppointmentModule } from './add-appointment/add-appointment.module';
import { InternalAppointmentStaffModule } from './internal-appointment-staff/internal-appointment-staff.module';
import { InternalAppointmentChargesModule } from './internal-appointment-charges/internal-appointment-charges.module';
import { InternalAppointmentShiftModule } from './internal-appointment-shift/internal-appointment-shift.module';
import { InternalAppointmentSlotModule } from './internal-appointment-slot/internal-appointment-slot.module';
import { InternalAppointmentPriorityModule } from './internal-appointment-priority/internal-appointment-priority.module';
import { OpdOutPatientModule } from './opd-out_patient/opd-out_patient.module';
import { InternalOpdOverviewModule } from './internal-opd-overview/internal-opd-overview.module';
import { InternalOpdOverviewConsultantDoctorModule } from './internal-opd-overview-consultant_doctor/internal-opd-overview-consultant_doctor.module';
import { InternalOpdOverviewVisitsModule } from './internal-opd-overview-visits/internal-opd-overview-visits.module';
import { InternalOpdTimelineModule } from './internal-opd-timeline/internal-opd-timeline.module';
import { InternalOpdChargesModule } from './internal-opd-charges/internal-opd-charges.module';
import { SettingsRolesPermissionsModule } from './settings_roles-permissions/settings_roles-permissions.module';
import { SettingsNotificationSettingModule } from './settings_notification_setting/settings_notification_setting.module';
import { SettingsSystemNotificationSettingModule } from './settings-system_notification_setting/settings-system_notification_setting.module';
import { SettingPrefixSettingModule } from './setting-prefix_setting/setting-prefix_setting.module';
import { SettingLanguagesModule } from './setting-languages/setting-languages.module';
import { SettingsUsersPatientsModule } from './settings-users_patients/settings-users_patients.module';
import { SettingsUsersStaffsModule } from './settings-users-staffs/settings-users-staffs.module';
import { ModulesPatientModule } from './modules_patient/modules_patient.module';
import { SettingsModulesPatientModule } from './settings-modules_patient/settings-modules_patient.module';
import { SettingsGeneralSettingModule } from './settings-general_setting/settings-general_setting.module';
import { SettingsCaptchaSettingsModule } from './settings-captcha_settings/settings-captcha_settings.module';
import { SettingsFrontCmsSettingModule } from './settings-front_cms_setting/settings-front_cms_setting.module';
import { AddAppointmentDoctorWiseModule } from './add-appointment-doctor_wise/add-appointment-doctor_wise.module';
import { AddAppointmentPatientQueueModule } from './add-appointment-patient_queue/add-appointment-patient_queue.module';
import { TpaManagementModule } from './tpa_management/tpa_management.module';
import { HumanResourceAddStaffModule } from './human_resource-add_staff/human_resource-add_staff.module';
import { HumanResourceStaffModule } from './human_resource_staff/human_resource_staff.module';



@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      "type": "mysql",
      "host": "13.200.35.19",
      "port": 3306,
      "username": "root",
      "password": "pn::host-cloudDB1#2023",
      "database": "plenome_HMS",
      "entities": ["dist/**/*.entity{.ts,.js}"],
      "synchronize": false
  }),

    SetupHospitalChargesUnitTypeModule,

    SetupHospitalChargesTaxCategoryModule,

    SetupHospitalChargesChargeCategoryModule,

    SetupFrontOfficeAppointmentPriorityModule,

    SetupFrontOfficeSourceModule,

    SetupFrontOfficeComplainTypeModule,

    SetupFrontOfficePurposeModule,

    SetupPharmacyDoseDurationModule,

    SetupPharmacyDoseIntervalModule,

    MedicineCategoryModule,

    SetupPharmacySupplierModule,

    SetupPharmacyMedicineDosageModule,

    FindingsCategoryModule,

    SetupFindingsFindingModule,

    SetupPathologyPathologyCategoryModule,

    SetupPathologyUnitModule,

    SetupPathologyPathologyParameterModule,

    SetupOperationOperationCategoryModule,

    SetupOperationOperationModule,

    OtpModule,

    SetupRadiologyRadiologyCategoryModule,

    SetupRadiologyUnitModule,

    SetupRadiologyRadiologyParameterModule,

    SetupBloodBankProductsModule,

    SetupHospitalChargesChargeTypeMasterModule,

    SetupHospitalChargesChargeTypeModuleModule,

    SetupHospitalChargeChargesModule,

    SetupSymptomsSymptomsTypeModule,

    SetupSymptomsSymptomsHeadModule,

    SetupFinanceIncomeHeadModule,

    SetupFinanceExpenseHeadModule,

    SetupInventoryItemCategoryModule,

    SetupInventoryItemStoreModule,

    SetupInventoryItemSupplierModule,

    SetupBedFloorModule,

    SetupBedBedTypeModule,

    SetupBedBedGroupModule,


    SetupBedBedModule,

    SetupBedBedStatusModule,

    SetupHumanResourceSpecialistModule,

    SetupHumanResourceDesignationModule,

    SetupHumanResourceDepartmentModule,

    SetupHumanResourceLeaveTypesModule,


    SetupReferralReferralCategoryModule,

    SetupPatientNewPatientModule,


    SetupAppointmentShiftModule,

    SetupPatientDisabledPatientListModule,

    SetupAppointmentDoctorShiftModule,

    SetupApptSlotAmountModule,


    SetupApptSlotTimimgsModule,

    SetupReferralReferralCommissionModule,
    HumanResourceAddStaffModule,
    AddAppointmentModule,
    InternalAppointmentStaffModule,
    InternalAppointmentChargesModule,
    InternalAppointmentShiftModule,
    InternalAppointmentSlotModule,
    InternalAppointmentPriorityModule,
    OpdOutPatientModule,
    InternalOpdOverviewModule,
    InternalOpdOverviewConsultantDoctorModule,
    InternalOpdOverviewVisitsModule,
    InternalOpdTimelineModule,
    InternalOpdChargesModule,
    SettingsRolesPermissionsModule,
    SettingsNotificationSettingModule,
    SettingsSystemNotificationSettingModule,
    SettingPrefixSettingModule,
    SettingLanguagesModule,
    SettingsUsersPatientsModule,
    SettingsUsersStaffsModule,
    ModulesPatientModule,
    SettingsModulesPatientModule,
    SettingsGeneralSettingModule,
    SettingsCaptchaSettingsModule,
    SettingsFrontCmsSettingModule,
    AddAppointmentDoctorWiseModule,
    AddAppointmentPatientQueueModule,
    TpaManagementModule,
    HumanResourceAddStaffModule,
    HumanResourceStaffModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
