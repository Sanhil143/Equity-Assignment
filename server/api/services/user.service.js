import l from '../../common/logger';
import db from "./user.db.service";

class AuthService {
  userSignup(data) {
    l.info(`${this.constructor.name}.userSignup()`);
    return db.userSignup(data);
  }

  userLogin(data) {
    l.info(`${this.constructor.name}.userLogin()`);
    return db.userLogin(data);
  }

  updateProfile(data,userId) {
    l.info(`${this.constructor.name}.updateProfile(${userId})`);
    return db.updateProfile(data,userId);
  }

  
}

export default new AuthService();
