
CREATE DATABASE IF NOT EXISTS finratios;
USE finratios;

CREATE TABLE companies (
  company_id INT AUTO_INCREMENT PRIMARY KEY,
  ticker VARCHAR(16) NOT NULL UNIQUE,
  name VARCHAR(255),
  sector VARCHAR(128),
  market_cap BIGINT
);

CREATE TABLE financials (
  financial_id INT AUTO_INCREMENT PRIMARY KEY,
  company_id INT,
  year INT,
  revenue BIGINT,
  net_income BIGINT,
  total_assets BIGINT,
  total_equity BIGINT,
  current_assets BIGINT,
  current_liabilities BIGINT,
  inventory BIGINT,
  cost_of_goods_sold BIGINT,
  FOREIGN KEY (company_id) REFERENCES companies(company_id)
);

CREATE TABLE macroeconomics (
  macro_id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE,
  gdp_growth DECIMAL(5,2),
  inflation DECIMAL(5,2),
  policy_rate DECIMAL(5,2),
  exchange_rate DECIMAL(10,4),
  kse_index BIGINT
);

