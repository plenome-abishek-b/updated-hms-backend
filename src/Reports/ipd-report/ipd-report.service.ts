import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IpdDetailsEntity } from './ipd-report.entity';

@Injectable()
export class IpdReportService {
  constructor(
    @InjectRepository(IpdDetailsEntity)
    private readonly ipdDetailsRepository: Repository<IpdDetailsEntity>,
  ) {}

  async getIpdReport(filters: any) {
    const {
      timeDuration,
      doctor,
      fromAge,
      toAge,
      gender,
      symptoms,
      findings,
      fromDate,
      toDate,
    } = filters;

    const conditions = [];
    const values = [];

    let query = `
      SELECT 
        ipd_details.date, 
        ipd_details.id, 
        ipd_details.symptoms, 
        CONCAT(patients.patient_name, "/ (", patients.id, ")") AS patient_name, 
        patients.age, 
        patients.gender, 
        patients.mobileno, 
        patients.guardian_name, 
        CONCAT(staff.name, staff.surname, "/ (", staff.employee_id, ")") AS doctor_name, 
        staff.surname, 
        ipd_prescription_basic.finding_description 
      FROM 
        ipd_details 
      LEFT JOIN 
        ipd_prescription_basic ON ipd_details.id = ipd_prescription_basic.ipd_id 
      LEFT JOIN 
        patients ON patients.id = ipd_details.patient_id 
      LEFT JOIN 
        staff ON staff.id = ipd_details.cons_doctor 
      WHERE 
        1 = 1`;

    if (timeDuration) {
      const timeDurationConditions = {
        today: 'CURDATE()',
        ThisWeek: 'YEAR(NOW()) AND WEEK(NOW())',
        LastWeek: 'YEAR(NOW()) AND WEEK(NOW()) - 1',
        ThisMonth: 'YEAR(CURDATE()) AND MONTH(CURDATE())',
        LastMonth: 'YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH)) AND MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))',
        Last3Months: 'YEAR(DATE_SUB(NOW(), INTERVAL 3 MONTH)) AND MONTH(DATE_SUB(NOW(), INTERVAL 3 MONTH))',
        Last6Months: 'YEAR(DATE_SUB(NOW(), INTERVAL 6 MONTH)) AND MONTH(DATE_SUB(NOW(), INTERVAL 6 MONTH))',
        Last9Months: 'YEAR(DATE_SUB(NOW(), INTERVAL 9 MONTH)) AND MONTH(DATE_SUB(NOW(), INTERVAL 9 MONTH))',
        Last12Months: 'YEAR(DATE_SUB(NOW(), INTERVAL 12 MONTH)) AND MONTH(DATE_SUB(NOW(), INTERVAL 12 MONTH))',
        ThisYear: 'YEAR(NOW())',
        LastYear: 'YEAR(NOW()) - 1',
      };

      if (timeDurationConditions.hasOwnProperty(timeDuration)) {
        conditions.push(`DATE(ipd_details.date) = ${timeDurationConditions[timeDuration]}`);
      } else if (timeDuration === 'Period' && fromDate && toDate) {
        conditions.push('DATE(ipd_details.date) BETWEEN ? AND ?');
        values.push(fromDate, toDate);
      }
    }

    if (doctor) {
      conditions.push('cons_doctor = ?');
      values.push(doctor);
    }

    if (fromAge) {
      conditions.push('patients.age >= ?');
      values.push(fromAge);
    }

    if (toAge) {
      conditions.push('patients.age <= ?');
      values.push(toAge);
    }

    if (gender) {
      conditions.push('patients.gender = ?');
      values.push(gender);
    }

    if (symptoms) {
      conditions.push('ipd_details.symptoms LIKE ?');
      values.push(`%${symptoms}%`);
    }

    if (findings) {
      conditions.push('ipd_prescription_basic.finding_description LIKE ?');
      values.push(`%${findings}%`);
    }

    if (conditions.length > 0) {
      query += ' AND ' + conditions.join(' AND ');
    }

    const ipdReport = await this.ipdDetailsRepository.query(query, values);
    return ipdReport;
  }
}
