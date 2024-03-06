import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './dailytransaction.entity';

@Injectable()
export class DailyTransactionReportService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async getReport(fromDate: string, toDate: string) {
    const offlineModes = ['cash', 'cheque'];
    const onlineModes = ['upi', 'online', 'other', 'transfer to bank account'];
  
    const query = `
  WITH RECURSIVE date_seq AS (
    SELECT '${fromDate}' AS payment_date
    UNION ALL
    SELECT DATE_ADD(payment_date, INTERVAL 1 DAY) AS payment_date
    FROM date_seq
    WHERE payment_date < '${toDate}'
  )
  SELECT 
    date_seq.payment_date,
    COUNT(transactions.id) AS totalTransaction,
    COALESCE(SUM(CASE WHEN payment_mode IN (${offlineModes.map(mode => `'${mode}'`).join(',')}) THEN transactions.amount ELSE 0.00 END), 0) AS offline,
    COALESCE(SUM(CASE WHEN payment_mode IN (${onlineModes.map(mode => `'${mode}'`).join(',')}) THEN transactions.amount ELSE 0.00 END), 0) AS online,
    (COALESCE(SUM(CASE WHEN payment_mode IN (${offlineModes.map(mode => `'${mode}'`).join(',')}) THEN transactions.amount ELSE 0.00 END), 0) + COALESCE(SUM(CASE WHEN payment_mode IN (${onlineModes.map(mode => `'${mode}'`).join(',')}) THEN transactions.amount ELSE 0.00 END), 0)) AS total
  FROM 
    date_seq
    LEFT JOIN transactions ON DATE(transactions.payment_date) = date_seq.payment_date
  GROUP BY 
    date_seq.payment_date
`;




    return await this.transactionRepository.query(query);
  }
}  
