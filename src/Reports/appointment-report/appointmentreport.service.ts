import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentReport } from './appointmentreport.entity';

@Injectable()
export class AppointmentReportService {
  constructor(
    @InjectRepository(AppointmentReport)
    private readonly appointmentReportRepository: Repository<AppointmentReport>,
  ) {}

  async getAppointmentReport(
    timeDuration: string,
    doctor: number,
    shift: number,
    priority: number,
    source: string,
    fromDate?: string,
    toDate?: string,
  ): Promise<AppointmentReport[]> {

    const queryConditions = [];
    const queryValues = [];

    let query = `
    SELECT 
      CONCAT(patients.patient_name, " (", patients.id, ")") AS name,
      patients.mobileno,
      patients.gender,
      staff.id,
      CONCAT(staff.name, " ", staff.surname, "(", staff.employee_id, ")") AS doctor,
      appointment.date,
      appointment.appointment_status,
      appointment.source,
      appointment_payment.paid_amount 
    FROM 
      appointment 
    JOIN 
      patients ON patients.id = appointment.patient_id 
    JOIN 
      appointment_payment ON appointment_payment.appointment_id = appointment.id 
    JOIN 
      staff ON staff.id = appointment.doctor
    WHERE 
      1 = 1`;

    const timeDurationConditions = {
      today: 'DATE(appointment.date) = CURDATE()',
      'ThisWeek': 'YEAR(appointment.date) = YEAR(NOW()) AND WEEK(appointment.date) = WEEK(NOW())',
      'LastWeek': 'YEAR(appointment.date) = YEAR(NOW()) AND WEEK(appointment.date) = WEEK(NOW()) - 1',
      'ThisMonth': 'YEAR(appointment.date) = YEAR(NOW()) AND MONTH(appointment.date) = MONTH(NOW())',
      'LastMonth': 'YEAR(appointment.date) = YEAR(NOW()) AND MONTH(appointment.date) = MONTH(NOW()) - 1',
      'Last3Months': 'appointment.date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)',
      'Last6Months': 'appointment.date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)',
      'Last9Months': 'appointment.date >= DATE_SUB(NOW(), INTERVAL 9 MONTH)',
      'Last12Months': 'appointment.date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)',
      'ThisYear': 'YEAR(appointment.date) = YEAR(NOW())',
      'LastYear': 'YEAR(appointment.date) = YEAR(NOW()) - 1',
    };

    if (timeDurationConditions.hasOwnProperty(timeDuration)) {
      queryConditions.push(timeDurationConditions[timeDuration]);
    } else if (timeDuration === 'Period' && fromDate && toDate) {
      queryConditions.push(`DATE(appointment.date) BETWEEN ? AND ?`);
      queryValues.push(fromDate, toDate);
    }

    if (doctor) {
      queryConditions.push('appointment.doctor = ?');
      queryValues.push(doctor);
    }

    if (shift) {
      queryConditions.push('appointment.global_shift_id = ?');
      queryValues.push(shift);
    }

    if (priority) {
      queryConditions.push('appointment.priority = ?');
      queryValues.push(priority);
    }

    if (source) {
      queryConditions.push('appointment.source = ?');
      queryValues.push(source);
    }

    if (queryConditions.length > 0) {
      query += ' AND ' + queryConditions.join(' AND ');
    }

    const results = await this.appointmentReportRepository.query(query, queryValues);
    return results;
  }
}
