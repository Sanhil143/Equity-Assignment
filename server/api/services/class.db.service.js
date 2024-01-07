let sql = require("mssql");
const mssqlconn = require("../../common/dbConnection");

class ClassDatabase {
  createClass(data) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("className", sql.NVarChar, data.schoolName)
          .input("schoolId", sql.Int, data.schoolId)
          .query(
            `
            insert into tblClasses(name,schoolId)
            values(@className,@schoolId)`
          );
      })
      .then((result) => {
        if (result.rowsAffected && result.rowsAffected[0] > 0) {
          return "class added successfully";
        } else {
          return "error during class addition";
        }
      })
      .catch((err) => {
        return err.message;
      });
  }

  getClasses(schoolId,userId) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("userId", sql.Int, userId)
          .input("schoolId", sql.Int, schoolId)
          .query(
            `select 
            tblSchools.schoolId,
            tblclasses.classId,
            tblSchools.name as schoolName,
            tblSchools.photo as schoolImage,
            tblClasses.name as className
            from tblClasses
            inner join tblSchools on tblClasses.schoolId and tblSchool.schoolId
            inner join tblUserSchools on tblSchools.schoolId and tblUserSchools.schoolId
            inner join tblUsers on tblUserSchools.userId and tblUsers.userId
            where tblUsers.userId = @userId and tblSchools.schoolId = @schoolId 
            and tblSchools.isDeleted = 0 and tblClasses.isDeleted = 0 and tblUsers.isDeleted = 0`
          );
      })
      .then((result) => {
        return result.recordset;
      })
      .catch((err) => {
        return err.message;
      });
  }

  getClassStudent(schoolId,classId) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("classId", sql.Int, classId)
          .input("schoolId", sql.Int, schoolId)
          .query(
            `select
            tblclasses.classId,
            tblStudents.studentId,
            tblSchools.name as schoolName,
            tblClasses.name as className,
            tblStudents.firstName,
            tblStudents.lastName,
            tblStudents.photo as studentProfile
            from tblClassStudents
            inner join tblSchools on tblClassStudents.schoolId and tblSchool.schoolId
            inner join tblStudents on tblClassStudents.studentId and tblStudents.studentId
            where tblClassStudents.schoolId = @schoolId and tblClassStudents.classId = @classId 
            and tblSchools.isDeleted = 0 and tblClasses.isDeleted = 0 and tblStudents.studentId = 0`
          );
      })
      .then((result) => {
        return result.recordset;
      })
      .catch((err) => {
        return err.message;
      });
  }

  assignStudentInClass(classId,studentId,schoolId){
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("classId", sql.Int, classId)
          .input("studentId", sql.Int, studentId)
          .input("schoolId", sql.Int, schoolId)
          .query(
            `
            insert into tblClassStudents(classId,studentId,schoolId)
             values(@classId,@studentId,@schoolId)`
            );
      })
      .then((result) => {
        if (result.rowsAffected && result.rowsAffected[0] > 0) {
          return "student assign successfully";
        } else {
          return "error during student assigning";
        }
      })
      .catch((err) => {
        return err.message;
      });
  }
}

export default new ClassDatabase();
