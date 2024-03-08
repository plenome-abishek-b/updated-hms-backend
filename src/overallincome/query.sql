Query:

1. Doughnut chart:

WITH OPD_total AS (
    SELECT 
        SUM(CASE WHEN section = 'OPD' OR section = 'Appointment' THEN amount ELSE 0 END) AS OPD_amount
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
    CONCAT('General Income - ', ROUND(general_income_amount / (OPD_amount + general_income_amount) * 100), '%') AS general_income_percentage
FROM 
    OPD_total, General_income_total;

2. Line Chart:

SELECT 
    MONTHNAME(payment_date) AS month,
    (SELECT SUM(amount) 
     FROM transactions t 
     WHERE MONTH(t.payment_date) = MONTH(transactions.payment_date) AND YEAR(t.payment_date) = YEAR(transactions.payment_date)) AS income_total,
    (SELECT SUM(amount) 
     FROM expenses e
     WHERE MONTH(e.created_at) = MONTH(transactions.payment_date) AND YEAR(e.created_at) = YEAR(transactions.payment_date)) AS expenses_total
FROM 
    transactions
WHERE 
    YEAR(payment_date) = YEAR(NOW())
GROUP BY 
    MONTH(payment_date)
ORDER BY 
    MONTH(payment_date);









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
    OPD_total, IPD_total, Pathology_total, Radiology_total, Pharmacy_total, bloodbank_total, Ambulance_total, General_income_total;








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
