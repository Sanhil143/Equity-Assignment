let sql = require("mssql");
const mssqlconn = require("../../common/dbConnection");

class StudentDatabase {
  createStudent(data) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("firstName", sql.NVarChar, data.firstName)
          .input("lastName", sql.NVarChar, data.lastName)
          .input("photo", sql.NVarChar, data.photo)
          .input("schoolId", sql.Int, data.schoolId)
          .query(
            `
            insert into tblStudents(firstName,lastName,photo,schoolId)
            values(@firstName,@lastName,@photo,@schoolId)`
          );
      })
      .then((result) => {
        if (result.rowsAffected && result.rowsAffected[0] > 0) {
          return "student added successfully";
        } else {
          return "error during student addition";
        }
      })
      .catch((err) => {
        return err.message;
      });
  }

  getStudentById(studentId) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("studentId", sql.Int, studentId)
          .query(
            `select 
          * 
          from tblStudents
          where studentId = @studentId and isDeleted = 0`
          );
      })
      .then((result) => {
        return result.recordset;
      })
      .catch((err) => {
        return err.message;
      });
  }

  getStudentBySchoolId(schoolId) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("schoolId", sql.Int, schoolId)
          .query(
            `select
						studentId,
						firstName,
						lastName,
						photo as studentProfilePic,
						createdAt
						from tblStudents
						where schoolId = @schoolId and isDeleted = 0`
          );
      })
      .then((result) => {
        return result.recordset;
      })
      .catch((err) => {
        return err.message;
      });
  }

  activeInAllClassStudent(userId, schoolId) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("userId", sql.Int, userId)
          .input("schoolId", sql.Int, schoolId)
          .query(
            `
            select
            tblstudents.studentId,
            tblstudents.firstName,
            tblstudents.lastName,
            tblstudents.photo as studentProfilePic
            from tblstudents
              where not exists (
                select tblClasses.classId
                from tblclasses
                where tblClasses.classId not in (
                  select tblClassStudents.classId
                  from tblClassStudents
                  join tblUserSchools on tblClasses.schoolId = tblUserSchools.schoolId
                  where tblClassStudents.studentId = tblStudent.studentId 
                  and tblUserSchools.userId = @userId and tblclasses.schoolId = @schoolId
                )
              )
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

  getClassmateSpecificStudent(userId, schoolId, studentId) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("userId", sql.Int, userId)
          .input("schoolId", sql.Int, schoolId)
          .input("studentId", sql.Int, studentId)
          .query(
            `WITH StudentClasses AS (
              SELECT classId
              FROM tblClassStudents
              WHERE studentId = @studentId
                AND EXISTS (
                  SELECT 1
                  FROM tblClasses
                  WHERE classId = tblClassStudents.classId
                    AND schoolId = @schoolId
                )
          )
          SELECT DISTINCT tblStudents.studentId, tblStudents.firstName, tblStudents.lastName
          FROM tblClassStudents
          JOIN tblStudents ON tblClassStudents.studentId = tblStudents.studentId
          JOIN StudentClasses ON tblClassStudents.classId = StudentClasses.classId
          JOIN tblClassStudents AS tblClassStudents2 ON tblStudents.studentId = tblClassStudents2.studentId
          WHERE tblClassStudents2.classId IN (SELECT classId FROM StudentClasses)
            AND tblClassStudents.studentId <> tblStudents.studentId
            AND EXISTS (
              SELECT classId
              FROM StudentClasses
              GROUP BY classId
              HAVING COUNT(DISTINCT tblClassStudents2.studentId) = COUNT(DISTINCT tblClassStudents.studentId)
            )
          AND EXISTS (
              SELECT 1
              FROM tblUserSchools
              WHERE userId = @userId
                AND schoolId = @schoolId
          );
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

export default new StudentDatabase();
