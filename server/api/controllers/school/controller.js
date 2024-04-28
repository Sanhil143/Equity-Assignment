import SchoolService from "../../services/school.service";
import { compressImages } from "../../../common/images";

function generateUniqueInviteCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

class SchoolController {
  async createSchool(req, res) {
    const { schoolName, userId } = req.body;
    const image = req.files;
    if (!schoolName) {
      return res
        .status(400)
        .send({ status: false, message: "schoolName is needed" });
    }
    if (!userId) {
      return res
        .status(400)
        .send({ status: false, message: "userId is needed" });
    }
     req.body.uniqueCode = generateUniqueInviteCode()

    const folderPath = "./images/schoolImage";
    let imageUrl;
    if (image.photo !== undefined) {
      imageUrl = await compressImages(image, folderPath, "schoolImage");
      req.body.photo = imageUrl;
    }
    SchoolService.createSchool(req.body)
      .then((result) => {
        if (result === "School added successfully") {
          return res.status(201).send({
            status: true,
            message: "Registration has been Successfully"
          }); 
        }
        return res.status(400).send({
          status: false,
          message: "bad request during school creation",
        });
        
      })
      .catch((err) => {
        return res.status(500).send({ status: false, message: err.message });
      });
  }

  getMySchool(req,res){
    if(!req.params.userId){
      return res.status(400).send({status:false,message:'userId is required'})
    }
    SchoolService.getMySchool(req.params.userId).then((r) => {
      if (r.length === 0) {
        res.status(404).json({ status: false, message: "resource not found" });
      } else {
        res.json(r);
      }
    }).catch((error) => {
      res.status(500).json({ status: false, message: error.message });
    });
  }

  getMySchoolTeacher(req,res){
    if(!req.params.schoolId){
      return res.status(400).send({status:false,message:'schoolId is required'})
    }
    SchoolService.getMySchoolTeacher(req.params.schoolId).then((r) => {
      if (r.length === 0) {
        res.status(404).json({ status: false, message: "resource not found" });
      } else {
        res.json(r);
      }
    }).catch((error) => {
      res.status(500).json({ status: false, message: error.message });
    });
  }
}

export default new SchoolController();
