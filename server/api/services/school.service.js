import l from "../../common/logger";
import db from "./school.db.service";

class SchoolService {
  createSchool(data) {
    l.info(`${this.constructor.name}.createSchool()`);
    return db.createSchool(data);
  }

  getMySchool(userId) {
    l.info(`${this.constructor.name}.getMySchool(${userId})`);
    return db.getMySchool(userId);
  }

  getMySchoolTeacher(schoolId) {
    l.info(`${this.constructor.name}.getMySchoolTeacher(${schoolId})`);
    return db.getMySchoolTeacher(schoolId);
  }
}

export default new SchoolService();
