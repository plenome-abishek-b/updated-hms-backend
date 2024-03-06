import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection, createConnection } from 'typeorm';
import { OpdReport } from './entities/opd_report.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';


@Injectable()
export class OpdReportService {


  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){}


  async getOpdReport(filters: any) {
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



    let query = `SELECT visit_details.appointment_date, 
    concat('OPDN',"",opd_details.id) AS OPD_No,
    concat('OCID',"",visit_details.id) AS OpdCheckupID,
    CONCAT(patients.patient_name, "(", patients.id, ")") AS patient_name,
    patients.age AS Age,
    patients.gender AS Gender, 
    patients.mobileno AS MobileNumber, 
    patients.guardian_name AS GaurdianName, 
    CONCAT(staff.name, ' ', staff.surname,"(",staff.employee_id,")") AS DoctorName, 
    visit_details.symptoms,
    ipd_prescription_basic.finding_description
    FROM visit_details
    LEFT JOIN opd_details ON visit_details.opd_details_id = opd_details.id
    LEFT JOIN patients ON opd_details.patient_id = patients.id
    LEFT JOIN staff ON visit_details.cons_doctor = staff.id
    LEFT JOIN ipd_prescription_basic ON ipd_prescription_basic.visit_details_id = visit_details.id
    WHERE 1 = 1
      `;

      const values = [];



      if (timeDuration) {
        switch (timeDuration) {
          case 'today':
            query += ' AND DATE(visit_details.appointment_date) = CURDATE()';
            break;
          case 'ThisWeek':
            query += ' AND YEAR(visit_details.appointment_date) = YEAR(NOW()) AND WEEK(visit_details.appointment_date) = WEEK(NOW())';
            break;
          case 'LastWeek':
            query += ' AND YEAR(visit_details.appointment_date) = YEAR(NOW()) AND WEEK(visit_details.appointment_date) = WEEK(NOW()) - 1';
            break;
          case 'ThisMonth':
            query += ' AND YEAR(visit_details.appointment_date) = YEAR(CURDATE()) AND MONTH(visit_details.appointment_date) = MONTH(CURDATE())';
            break;
          case 'LastMonth':
            query +=
              ' AND YEAR(visit_details.appointment_date) = YEAR(DATE_SUB(NOW(), INTERVAL 1 MONTH)) AND MONTH(visit_details.appointment_date) = MONTH(DATE_SUB(NOW(), INTERVAL 1 MONTH))';
            break;
          case 'Last3Months':
          query +=
          " AND visit_details.appointment_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)";
          break;
          case 'Last6Months':
          query +=
          " AND visit_details.appointment_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)";
          break;
          case 'Last12Months':
          query +=
          " AND visit_details.appointment_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)";
          break;
          case 'ThisYear':
            query += ' AND YEAR(visit_details.appointment_date) = YEAR(NOW())';
            break;
          case 'LastYear':
            query += ' AND YEAR(visit_details.appointment_date) = YEAR(NOW()) - 1';
            break;
          case 'Period':
            if (fromDate && toDate) {
              query += ' AND DATE(visit_details.appointment_date) BETWEEN ? AND ?';
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
   
      if (symptoms) {
        query += ' AND visit_details.symptoms LIKE ?';
        values.push('%' + symptoms + '%');
      }
   
      if (findings) {
        query += ' AND ipd_prescription_basic.finding_description LIKE ?';
        values.push('%' + findings + '%');
      }






      const opdReport = await this.connection.query(query, values);
      return opdReport;

  
  }

}
