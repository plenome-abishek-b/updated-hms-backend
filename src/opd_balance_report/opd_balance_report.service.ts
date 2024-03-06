import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { Connection, createConnection } from 'typeorm';
import { OpdBalanceReport } from './entities/opd_balance_report.entity';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

@Injectable()
export class OpdBalanceReportService {


  constructor(@InjectConnection() private connection: Connection,
  @Inject(forwardRef(() => DynamicDatabaseService)) private dynamicDbService: DynamicDatabaseService
  ){}

  async getOpdBalanceReport(filters: any) {
    const {
      timeDuration,
      fromAge,
      toAge,
      gender,
      discharged,
      fromDate,
      toDate,
    } = filters;


    let query = `select distinct 
    concat("OPDN",opd_details.id) as opd_no,
    patients.patient_name,
    concat(patients.age," Years ",patients.month," Months ",patients.day," Days ") as age,patients.gender,
    patients.mobileno,opd_details.case_reference_id,opd_details.discharged,
    visit_details.appointment_date,
    coalesce((select sum(patient_charges.amount) from patient_charges where patient_charges.opd_id = opd_details.id ),0) as net_amount,
    coalesce((select sum(transactions.amount) from transactions where transactions.opd_id =  opd_details.id)) as paid_amount,
    (coalesce((select sum(patient_charges.amount) from patient_charges where patient_charges.opd_id = opd_details.id ),0) - coalesce((select sum(transactions.amount) from transactions where transactions.opd_id =  opd_details.id))) as balance_amount 
    from opd_details 
    join patients on patients.id = opd_details.patient_id join transactions on transactions.opd_id = opd_details.id  
    join visit_details on opd_details.id = visit_details.opd_details_id where opd_details.id
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
   
      if (discharged) {
        query += ' AND opd_details.discharged = ?';
        values.push(discharged);
      }
   

      const opdbalanceReport = await this.connection.query(query, values);
      return opdbalanceReport;




  }
}
