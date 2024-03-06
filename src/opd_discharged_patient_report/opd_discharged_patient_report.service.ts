import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection, createConnection } from 'typeorm';
import { OpdDischargedPatientReport } from './entities/opd_discharged_patient_report.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';


@Injectable()
export class OpdDischargedPatientReportService {


  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){}



  async getOpdDischargePatientReport(filters: any) {
    const {
      timeDuration,
      doctor,
      fromAge,
      toAge,
      gender,
      dischargeStatus,
      fromDate,
      toDate,
    } = filters;



    let query = `select concat(patients.patient_name, "(",patients.id,")" ) AS patientName,patients.gender,patients.age,
    patients.mobileno,concat("OPDN",opd_details.id) as opd_no,opd_details.case_reference_id,
    CONCAT(staff.name, ' ', staff.surname,"(",staff.employee_id,")") AS Consultant,
    visit_details.appointment_date,
    discharge_card.discharge_date,
    discharge_card.discharge_status,
    (TIMESTAMPDIFF(day,visit_details.appointment_date,discharge_card.discharge_date))+1 as admitted_days 
    from discharge_card 
    join opd_details on opd_details.id = discharge_card.opd_details_id 
    join visit_details on visit_details.opd_details_id = opd_details.id 
    join patients on patients.id = opd_details.patient_id 
    join staff on staff.id = visit_details.cons_doctor  
    where opd_details.id
      `;

      const values = [];



      if (timeDuration) {
        switch (timeDuration) {
          case 'today':
            query += ' AND DATE(discharge_card.discharge_date) = CURDATE()';
            break;
          case 'ThisWeek':
            query += ' AND YEAR(discharge_card.discharge_date) = YEAR(NOW()) AND WEEK(discharge_card.discharge_date) = WEEK(NOW())';
            break;
          case 'LastWeek':
            query += ' AND YEAR(discharge_card.discharge_date) = YEAR(NOW()) AND WEEK(discharge_card.discharge_date) = WEEK(NOW()) - 1';
            break;
          case 'ThisMonth':
            query += ' AND YEAR(discharge_card.discharge_date) = YEAR(CURDATE()) AND MONTH(discharge_card.discharge_date) = MONTH(CURDATE())';
            break;
          case 'LastMonth':
            query +=
              ' AND YEAR(discharge_card.discharge_date) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH)) AND MONTH(discharge_card.discharge_date) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))';
            break;
          case 'Last3Months':
          query +=
          " AND discharge_card.discharge_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)";
          break;
          case 'Last6Months':
          query +=
          " AND discharge_card.discharge_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)";
          break;
          case 'Last12Months':
          query +=
          " AND discharge_card.discharge_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)";
          break;
          case 'ThisYear':
            query += ' AND YEAR(discharge_card.discharge_date) = YEAR(NOW())';
            break;
          case 'LastYear':
            query += ' AND YEAR(discharge_card.discharge_date) = YEAR(NOW()) - 1';
            break;
          case 'Period':
            if (fromDate && toDate) {
              query += ' AND DATE(discharge_card.discharge_date) BETWEEN ? AND ?';
              values.push(fromDate, toDate);
            }
            break;
          default:
            // Handle the case for an invalid timeDuration.
            throw new Error('Invalid timeDuration');
        }
      }
   
      if (doctor) {
        query += ' AND cons_doctor = ?';
        values.push(doctor);
      }
      if (fromAge) {
        query += ' AND age >= ?';
        values.push(fromAge);
      }
      if (toAge) {
        query += ' AND age <= ?';
        values.push(toAge);
      }
   
      if (gender) {
        query += ' AND patients.gender = ?';
        values.push(gender);
      }
   
      if (dischargeStatus) {
        query += ' AND discharge_card.discharge_status = ?';
        values.push(dischargeStatus);
      }
   

      const opdDischargeReport = await this.connection.query(query, values);
      return opdDischargeReport;

  
  }





}
