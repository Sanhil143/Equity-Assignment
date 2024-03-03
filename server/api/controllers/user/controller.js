import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthService from "../../services/user.service";
import { compressImages } from "../../../common/images";

class Controller {
  async userSignup(req, res) {
    const { firstName, lastName, email, password,role,uniqueCode } = req.body;
    const image = req.files;
    if (!firstName) {
      return res
        .status(400)
        .send({ status: false, message: "firstname is needed" });
    }
    if (!lastName) {
      return res
        .status(400)
        .send({ status: false, message: "lastname is needed" });
    }
    if (!role) {
      return res
        .status(400)
        .send({ status: false, message: "role is needed" });
    }
    if (!email) {
      return res
        .status(400)
        .send({ status: false, message: "correct email or number is needed" });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        status: false,
        message: "password is needed or minimum length is 6",
      });
    }
    const hashed = await bcrypt.hash(password, 10);
    req.body.password = hashed;
    const folderPath = './images/userProfileImage'
    let imageUrl;
    if(image.photo !== undefined){
      imageUrl = await compressImages(image,folderPath,'userProfileImage');
      req.body.photo = imageUrl;
    }
    AuthService.userSignup(req.body)
      .then((r) => {
        if(r === 'user registration has done successfully'){
          return res.status(201).send({status:true,message:'user account created successfully'})
        }
        return res.status(400).send({status:false,error:'error during user account creation'})
      })
      .catch((err) => {
        return res.status(500).send({ status: false, message: err.message });
      });
  }

  userLogin(req, res) {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).send({
        status: false,
        message: "please provide email for login",
      });
    }
    if (!password) {
      return res
        .status(400)
        .send({ status: false, message: "please provide password for login" });
    }
    AuthService.userLogin(req.body)
      .then(async (user) => {
        if (!user) {
          return res.status(404).end();
        }
        if (user[0].userId) {
          const passwordMatched = await bcrypt.compare(
            password,
            user[0].password
          );
          if (!passwordMatched) {
            return res
              .status(401)
              .send({ status: false, message: "invalid password" });
          }
          delete user[0].password;
          const token = jwt.sign(
            { userId: user[0].userId,role:user[0].role},
            process.env.JWT_SECRET,
            {
              expiresIn: "7d",
            }
          );
          return res
            .status(200)
            .send({ status: true, message: "Login Successfully", token, user });
        } else {
          return res
            .status(400)
            .send({ status: false, message: "An error occurred during login" });
        }
      })
      .catch((error) => {
        return res.status(500).send({ status: false, message: error.message });
      });
  }
}
export default new Controller();
