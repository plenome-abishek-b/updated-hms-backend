import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { transactions_report } from './transactionreport.entity';

@Injectable()
export class TransactionReportService {
  constructor(
    @InjectRepository(transactions_report)
    private readonly transactionReportRepository: Repository<transactions_report>,
  ) {}

  async getTransactionReport(
    timeDuration: string,
    collectedBy: number,
    head: string,
    fromDate?: string,
    toDate?: string,
  ): Promise<transactions_report[]> {

    const queryConditions = [];
    const queryValues = [];

    const timeDurationConditions = {
      today: 'DATE(transactions.payment_date) = CURDATE()',
      'This Week': 'YEAR(transactions.payment_date) = YEAR(NOW()) AND WEEK(transactions.payment_date) = WEEK(NOW())',
      'Last Week': 'YEAR(transactions.payment_date) = YEAR(NOW()) AND WEEK(transactions.payment_date) = WEEK(NOW()) - 1',
      'This Month': 'YEAR(transactions.payment_date) = YEAR(NOW()) AND MONTH(transactions.payment_date) = MONTH(NOW())',
      'Last Month': 'YEAR(transactions.payment_date) = YEAR(NOW()) AND MONTH(transactions.payment_date) = MONTH(NOW()) - 1',
      'Last 3 Months': 'transactions.payment_date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)',
      'Last 6 Months': 'transactions.payment_date >= DATE_SUB(NOW(), INTERVAL 6 MONTH)',
      'Last 9 Months': 'transactions.payment_date >= DATE_SUB(NOW(), INTERVAL 9 MONTH)',
      'Last 12 Months': 'transactions.payment_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)',
      'This Year': 'YEAR(transactions.payment_date) = YEAR(NOW())',
      'Last Year': 'YEAR(transactions.payment_date) = YEAR(NOW()) - 1',
    };

    const periodCondition = fromDate && toDate ? `DATE(transactions.payment_date) BETWEEN ? AND ?` : null;

    if (timeDurationConditions.hasOwnProperty(timeDuration)) {
      queryConditions.push(timeDurationConditions[timeDuration]);
    } else if (periodCondition) {
      queryConditions.push(periodCondition);
      queryValues.push(fromDate, toDate);
    }

    if (collectedBy) {
      queryConditions.push('transactions.received_by = ?');
      queryValues.push(collectedBy);
    }

    if (head) {
      queryConditions.push('transactions.section = ?');
      queryValues.push(head);
    }

    const whereClause = queryConditions.length > 0 ? 'WHERE ' + queryConditions.join(' AND ') : '';

    const query = `
    SELECT
      CONCAT("TRID", transactions.id) AS billno,
      transactions.payment_date,
      CONCAT(patients.patient_name, " (", patients.id, ")") AS patient_name,
      (CASE
        WHEN transactions.opd_id THEN CONCAT("OPDN", transactions.opd_id)
        WHEN transactions.pharmacy_bill_basic_id THEN CONCAT("PHAB", transactions.pharmacy_bill_basic_id)
        WHEN transactions.pathology_billing_id THEN CONCAT("PATB", transactions.pathology_billing_id)
        WHEN transactions.radiology_billing_id THEN CONCAT("RADB", transactions.radiology_billing_id)
        WHEN transactions.blood_issue_id THEN CONCAT("BLBB", transactions.blood_issue_id)
        WHEN transactions.ambulance_call_id THEN CONCAT("AMCB", transactions.ambulance_call_id)
        ELSE ''
      END) AS referance,
      transactions.section,
      CONCAT(staff.name, " ", staff.surname, " (", staff.employee_id, ")") AS collected_by,
      transactions.payment_mode,
      transactions.type,
      transactions.amount 
    FROM
      transactions
    LEFT JOIN
      patients ON patients.id = transactions.patient_id 
    LEFT JOIN
      staff ON staff.id = transactions.received_by 
    ${whereClause}`;

    const results = await this.transactionReportRepository.query(query, queryValues);
    return results;
  }
}
