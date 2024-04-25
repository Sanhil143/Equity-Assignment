let sql = require("mssql");
const mssqlconn = require("../../common/dbConnection");

class SchoolDatabase {
  createSchool(data) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("schoolName", sql.NVarChar, data.schoolName)
          .input("uniqueCode", sql.NVarChar, data.uniqueCode)
          .input("photo", sql.NVarChar, data.photo)
          .input("userId", sql.Int, data.userId)
          .input("role", sql.NVarChar, data.role)
          .query(
            `
            DECLARE @insertedSchoolId INT 
            IF NOT EXISTS (SELECT 1 FROM tblSchools WHERE name = @schoolName)
            BEGIN
                INSERT INTO tblSchools (
                name, 
                uniqueCode,
                photo
                )
                VALUES (
                @schoolName, 
                @uniqueCode,
                @photo
                )
                SET @insertedSchoolId = SCOPE_IDENTITY()
                INSERT INTO tblUserSchools (
                userId,
                schoolId,
                role
                ) 
                VALUES (
                @userId, 
                @insertedSchoolId,
                @role
                )
            END`
          );
      })
      .then((result) => {
        if (result.rowsAffected && result.rowsAffected[0] > 0) {
          return "School added successfully";
        } else {
          return "error during school addition";
        }
      })
      .catch((err) => {
        return err.message;
      });
  }

  getMySchool(userId) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("userId", sql.Int, userId)
          .query(
            `
					  select 
            tblUsers.userId,
            tblSchools.schoolId,
            tblUsers.role,
            tblSchools.name,
            tblSchools.photo,
            tblSchools.uniqueCode,
            tblSchools.createdAt,
            from tblUsers
            inner join tblUserSchools on tblUsers.userId = tblUserSchools.userId
            inner join tblSchools on tblUserSchools.schoolId = tblSchools.schoolId
            where tblUsers.userId = @userId and tblUsers.isDeleted = 0
					`
          );
      })
      .then((result) => {
        return result.recordset;
      })
      .catch((err) => {
        return err.message;
      });
  }
}

export default new SchoolDatabase();
