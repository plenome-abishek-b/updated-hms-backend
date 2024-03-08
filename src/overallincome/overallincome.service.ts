import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IncomeSummary } from './entities/overallincome.entity';

@Injectable()
export class IncomeSummaryService {
  constructor(
    @InjectRepository(IncomeSummary)
    private readonly incomeSummaryRepository: Repository<IncomeSummary>,
  ) {}

  async getOverallIncomeAndExpense(): Promise<IncomeSummary> {
    const query = `
    SELECT 
    (SELECT SUM(CASE WHEN section = 'OPD' OR section = 'Appointment' THEN amount ELSE 0 END) FROM transactions 
     WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
     AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)) AS OPD,
    
    (SELECT SUM(CASE WHEN section = 'IPD' THEN amount ELSE 0 END) FROM transactions 
     WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
     AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)) AS IPD,
    
    (SELECT SUM(CASE WHEN section = 'Pathology' THEN amount ELSE 0 END) FROM transactions 
     WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
     AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)) AS pathology_income,
    
    (SELECT SUM(CASE WHEN section = 'Pharmacy' THEN amount ELSE 0 END) FROM transactions 
     WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
     AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)) AS pharmacy_income,
    
    (SELECT SUM(CASE WHEN section = 'Radiology' THEN amount ELSE 0 END) FROM transactions 
     WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
     AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)) AS radiology_income,
    
    (SELECT SUM(CASE WHEN section = 'BloodBank' THEN amount ELSE 0 END) FROM transactions 
     WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
     AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)) AS bloodbank_income,
    
    (SELECT SUM(CASE WHEN section = 'Ambulance' THEN amount ELSE 0 END) FROM transactions 
     WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
     AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)) AS ambulance_income,
    
    (SELECT SUM(CASE WHEN section = 'Expense' THEN amount ELSE 0 END) FROM transactions 
     WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
     AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)) AS total_expense,
    
    (SELECT SUM(amount) FROM expenses 
     WHERE created_at >= DATE_FORMAT(NOW(), '%Y-%m-01') 
     AND created_at < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)) AS expenses,
    
    (SELECT SUM(amount) FROM income 
     WHERE created_at >= DATE_FORMAT(NOW(), '%Y-%m-01') 
     AND created_at < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)) AS general_income;
    `;
    return this.incomeSummaryRepository.query(query);
  }

  async getYearlyIncomeByCategory(): Promise<any[]> {
    const query = `
WITH Months AS (
    SELECT 1 AS month_number UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION 
    SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12
)
SELECT 
    MONTHNAME(DATE_FORMAT(CONCAT(YEAR(NOW()), '-', m.month_number, '-01'), '%Y-%m-%d')) AS month,
    COALESCE(income_total, 0) AS income_total,
    COALESCE(expenses_total, 0) AS expenses_total
FROM 
    Months m
LEFT JOIN 
    (SELECT 
         MONTH(payment_date) AS month,
         SUM(amount) AS income_total
     FROM 
         transactions 
     WHERE 
         YEAR(payment_date) = YEAR(NOW())
     GROUP BY 
         MONTH(payment_date)) AS income ON m.month_number = income.month
LEFT JOIN 
    (SELECT 
         MONTH(created_at) AS month,
         SUM(amount) AS expenses_total
     FROM 
         expenses
     WHERE 
         YEAR(created_at) = YEAR(NOW())
     GROUP BY 
         MONTH(created_at)) AS expenses ON m.month_number = expenses.month
ORDER BY 
    m.month_number;
    `;
    return this.incomeSummaryRepository.query(query);
  }


  async getYearlyIncomeByPercentage(): Promise<any[]> {
    const query = `
    WITH 
    OPD_total AS (
        SELECT 
            SUM(CASE WHEN section = 'OPD' OR section = 'Appointment' THEN amount ELSE 0 END) AS OPD_amount
        FROM transactions 
        WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
        AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)
    ),
    IPD_total AS (
        SELECT 
            SUM(CASE WHEN section = 'IPD' THEN amount ELSE 0 END) AS IPD_amount
        FROM transactions 
        WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
        AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)
    ),
    Pathology_total AS (
        SELECT 
            SUM(CASE WHEN section = 'Pathology' THEN amount ELSE 0 END) AS pathology_amount
        FROM transactions 
        WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
        AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)
    ),
    Radiology_total AS (
        SELECT 
            SUM(CASE WHEN section = 'Radiology' THEN amount ELSE 0 END) AS radiology_amount
        FROM transactions 
        WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
        AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)
    ),
    Pharmacy_total AS (
        SELECT 
            SUM(CASE WHEN section = 'Pharmacy' THEN amount ELSE 0 END) AS pharmacy_amount
        FROM transactions 
        WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
        AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)
    ),
    bloodbank_total AS (
        SELECT 
            SUM(CASE WHEN section = 'Bloodbank' THEN amount ELSE 0 END) AS bloodbank_amount
        FROM transactions 
        WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
        AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)
    ),
    Ambulance_total AS (
        SELECT 
            SUM(CASE WHEN section = 'Bloodbank' THEN amount ELSE 0 END) AS ambulance_amount
        FROM transactions 
        WHERE payment_date >= DATE_FORMAT(NOW(), '%Y-%m-01') 
        AND payment_date < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)
    ),
    General_income_total AS (
        SELECT 
            SUM(amount) AS general_income_amount
        FROM income 
        WHERE created_at >= DATE_FORMAT(NOW(), '%Y-%m-01') 
        AND created_at < DATE_ADD(DATE_FORMAT(NOW(), '%Y-%m-01'), INTERVAL 1 MONTH)
    )
    SELECT 
        CONCAT('OPD - ', ROUND(OPD_amount / (OPD_amount + general_income_amount) * 100), '%') AS OPD_percentage,
        CONCAT('IPD - ', ROUND(IPD_amount / (IPD_amount + general_income_amount) * 100), '%') AS IPD_percentage,
        CONCAT('Pathology - ', ROUND(pathology_amount / (pathology_amount + general_income_amount) * 100), '%') AS Pathology_percentage,
        CONCAT('Radiology - ', ROUND(radiology_amount / (radiology_amount + general_income_amount) * 100), '%') AS Radiology_percentage,
        CONCAT('Pharmacy - ', ROUND(pharmacy_amount / (pharmacy_amount + general_income_amount) * 100), '%') AS Pharmacy_percentage,
        CONCAT('Bloodbank - ', ROUND(bloodbank_amount / (bloodbank_amount + general_income_amount) * 100), '%') AS blood_bank_percentage,
        CONCAT('Ambulance - ', ROUND(ambulance_amount / (ambulance_amount + general_income_amount) * 100), '%') AS ambulance_percentage,
        CONCAT('General Income - ', ROUND(general_income_amount / (OPD_amount + IPD_amount + pathology_amount + radiology_amount + pharmacy_amount + bloodbank_amount + general_income_amount ) * 100), '%') AS general_income_percentage
    FROM 
        OPD_total, IPD_total, Pathology_total, Radiology_total, Pharmacy_total, bloodbank_total, Ambulance_total, General_income_total`;

        return this.incomeSummaryRepository.query(query);


}


}
