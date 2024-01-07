import l from "../../common/logger";
import db from "./student.db.service";

class StudentService {
  createStudent(data) {
    l.info(`${this.constructor.name}.createStudent()`);
    return db.createStudent(data);
  }

  getStudentBySchoolId(schoolId) {
    l.info(`${this.constructor.name}.getStudentBySchoolId(${schoolId})`);
    return db.getStudentBySchoolId(schoolId);
  }

  activeInAllClassStudent(userId,schoolId) {
    l.info(`${this.constructor.name}.activeInAllClassStudent(${userId},${schoolId})`);
    return db.activeInAllClassStudent(userId,schoolId);
  }

  getClassmateSpecificStudent(userId, schoolId, studentId){
    l.info(`${this.constructor.name}.getClassmateSpecificStudent(${userId},${schoolId},${studentId})`);
    return db.getClassmateSpecificStudent(userId,schoolId,studentId);
  }
}

export default new StudentService();
