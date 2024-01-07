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
            `DECLARE @InsertedUserId INT 
          
            IF NOT EXISTS (SELECT 1 FROM tblSchools WHERE email = @schoolName)
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
            
                SET @InsertedUserId = SCOPE_IDENTITY()
                insert into tblUserScool(
                  userId,schoolId,role
                ) values (
                  @userId, @schoolId, @role
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
            tblSchools.uniqueCode
            from tblUsers
            inner join tblUserSchools on tblUsers.userId and tblUserSchools.userId
            inner join tblSchools on tblUserSchools.schoolId and tblSchools.schoolId
            where tblUsers.userId = @id and isDeleted = 0
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
