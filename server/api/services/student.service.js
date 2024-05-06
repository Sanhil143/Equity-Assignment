import l from "../../common/logger";
import db from "./student.db.service";

class StudentService {
  createStudent(data) {
    l.info(`${this.constructor.name}.createStudent()`);
    return db.createStudent(data);
  }

  getStudentById(studentId) {
    l.info(`${this.constructor.name}.getStudentById(${studentId})`);
    return db.getStudentById(studentId);
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

  assignStudentToClass(data, schoolId, classId){
    l.info(`${this.constructor.name}.assignStudentToClass(${schoolId},${classId})`);
    return db.assignStudentToClass(data,schoolId,classId);
  }
}

export default new StudentService();
