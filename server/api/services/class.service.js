import l from "../../common/logger";
import db from "./class.db.service";

class ClassService {
  createClass(data) {
    l.info(`${this.constructor.name}.createClass()`);
    return db.createClass(data);
  }

  getClasses(schoolId,userId) {
    l.info(`${this.constructor.name}.getClasses(${schoolId},${userId})`);
    return db.getClasses(schoolId,userId);
  }

  getClassStudent(schoolId,classId) {
    l.info(`${this.constructor.name}.getClassStudent(${schoolId},${classId})`);
    return db.getClassStudent(schoolId,classId);
  }

  assignStudentInClass(classId,studentId,schoolId) {
    l.info(`${this.constructor.name}.assignStudentInClass(${classId},${studentId},${schoolId})`);
    return db.assignStudentInClass(classId,studentId,schoolId);
  }
}

export default new ClassService();
