let sql = require("mssql");
const mssqlconn = require("../../common/dbConnection");

class ClassDatabase {
  createClass(data) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("className", sql.NVarChar, data.className)
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

  getClasses(schoolId, userId) {
    return mssqlconn
      .getDbConnection()
      .then((pool) => {
        return pool
          .request()
          .input("userId", sql.Int, userId)
          .input("schoolId", sql.Int, schoolId)
          .query(
            `select 
            tblUsers.userId as adminId,
            tblSchools.schoolId,
            tblclasses.classId,
            tblSchools.name as schoolName,
            tblSchools.photo as schoolImage,
            tblClasses.name as className,
			      count(tblClassStudents.studentId) as classMembers
            from tblClasses
            inner join tblSchools on tblClasses.schoolId = tblSchools.schoolId
            inner join tblUserSchools on tblSchools.schoolId = tblUserSchools.schoolId
            inner join tblUsers on tblUserSchools.userId = tblUsers.userId
			      left join tblClassStudents on tblClasses.classId = tblClassStudents.classId
            where tblUsers.userId = @userId 
			      and tblSchools.schoolId = @schoolId 
            and tblSchools.isDeleted = 0 
			      and tblClasses.isDeleted = 0 
			      and tblUsers.isDeleted = 0
			      group by 
			      tblUsers.userId,
            tblSchools.schoolId,
            tblClasses.classId,
            tblSchools.name,
            tblSchools.photo,
            tblClasses.name;
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

  getClassStudent(schoolId, classId) {
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
            tblStudents.photo as studentProfile,
            tblStudents.createdAt
            from tblClassStudents
            inner join tblSchools on tblClassStudents.schoolId = tblSchools.schoolId
            inner join tblStudents on tblClassStudents.studentId = tblStudents.studentId
            inner join tblClasses on tblClassStudents.classId = tblClasses.classId
            where tblClassStudents.schoolId = @schoolId and tblClassStudents.classId = @classId 
            and tblSchools.isDeleted = 0 and tblClasses.isDeleted = 0 and tblStudents.isDeleted = 0`
          );
      })
      .then((result) => {
        return result.recordset;
      })
      .catch((err) => {
        return err.message;
      });
  }

  assignStudentInClass(classId, studentId, schoolId) {
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
