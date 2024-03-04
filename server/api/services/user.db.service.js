let sql = require("mssql");
const mssqlconn = require("../../common/dbConnection");

class AuthDatabase {
  userSignup(data) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("firstName", sql.NVarChar, data.firstName)
          .input("lastName", sql.NVarChar, data.lastName)
          .input("email", sql.NVarChar, data.email)
          .input("password", sql.NVarChar, data.password)
          .input("uniqueCode", sql.NVarChar, data.uniqueCode)
          .input("photo", sql.NVarChar, data.photo)
          .input("role", sql.NVarChar, data.role)
          .query(
            `
           IF EXISTS (SELECT 1 FROM tblUsers WHERE email = @email AND isDeleted = 0)
           BEGIN
           IF EXISTS (SELECT 1 FROM tblSchools WHERE uniqueCode = @uniqueCode AND isDeleted = 0)
           BEGIN
           DECLARE @userId INT;
           DECLARE @schoolId INT;
           SELECT @schoolId = schoolId FROM tblSchools WHERE uniqueCode = @uniqueCode AND isDeleted = 0;
           INSERT INTO tblUsers (firstName, lastName, email, password,photo, role)
           VALUES (@firstName, 
           @lastName, 
           @email, 
           @password, 
           @photo, 
           @role);
           SET @userId = SCOPE_IDENTITY();
           INSERT INTO tblUserSchools (userId, schoolId, role)
           VALUES (@userId, @schoolId, @role);
           END
           ELSE
           BEGIN
           INSERT INTO tblUsers (firstName, lastName, email, password,photo, role)
           VALUES (
           @firstName, 
           @lastName, 
           @email, 
           @password, 
           @photo, 
           @role)
           END
           END
           `          
          );
      })
      .then((result) => {
        console.log(result)
        if (result.rowsAffected && result.rowsAffected[0] > 0) {
          return "user registration has done successfully";
        } else {
          return "No data inserted";
        }
      })
      .catch((err) => {
        return err.message;
      });
  }

  userLogin(data) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("email", sql.NVarChar, data.email)
          .query(
            `select
          userId,
          firstName,
          lastName,
          photo as userProfile,
          email,
          password,
          role
          from tblUsers
          where email = @email and isDeleted = 0`
          );
      })
      .then((result) => {
        if (result.recordset.length > 0) {
          return result.recordset;
        } else {
          throw new Error("No user found");
        }
      })
      .catch((err) => {
        return err.message;
      });
  }
}

export default new AuthDatabase();
