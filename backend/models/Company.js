
class Company {
  constructor(row) {
    this.company_id = row.company_id;
    this.ticker = row.ticker;
    this.name = row.name;
    this.sector = row.sector;
  }
}

module.exports = Company;
