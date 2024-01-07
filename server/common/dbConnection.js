const mssql = require('mssql');
import { dbConfig } from './dbConfig';

const connConfig = {
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  server: dbConfig.server,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  // options: {
  //   encrypt: true, // for azure
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  // },
};

mssql.on('error', (err) => {
  // ... error handler
  console.log(err);
});

class DBConnection {
  getDbConnection() {
    try {
      return mssql.connect(connConfig);
    } catch (error) {
      console.log(error);
    }
  }
}
module.exports = new DBConnection();

