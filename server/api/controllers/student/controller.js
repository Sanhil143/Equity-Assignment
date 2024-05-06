import StudentService from "../../services/student.service";
import { compressImages } from "../../../common/images";

class StudentController {
  async createStudent(req, res) {
    const { firstName, lastName, schoolId } = req.body;
    const image = req.files;

    if (!firstName) {
      return res
        .status(400)
        .send({ status: false, message: "firstName is needed" });
    }
    if (!lastName) {
      return res
        .status(400)
        .send({ status: false, message: "lastName is needed" });
    }
    if (!schoolId) {
      return res
        .status(400)
        .send({ status: false, message: "schoolId is needed" });
    }
    const folderPath = "./images/studentProfileImages";
    let imageUrl;
    if (image.photo !== undefined) {
      imageUrl = await compressImages(image, folderPath, "studentProfile");
      req.body.photo = imageUrl;
    }
    StudentService.createStudent(req.body)
      .then((result) => {
        if (result === "student added successfully") {
          return res.status(201).send({
            status: true,
            message: "Registration has been Successfully",
          });
        }
        return res.status(400).send({
          status: true,
          message: "bad request during student creation",
        });
      })
      .catch((err) => {
        return res.status(500).send({ status: false, message: err.message });
      });
  }

  getStudentById(req, res) {
    if (!req.params.studentId) {
      return res
        .status(400)
        .send({ status: false, message: "studentId is required" });
    }
    StudentService.getStudentById(req.params.studentId)
      .then((r) => {
        if (r.length === 0) {
          res
            .status(404)
            .json({ status: false, message: "resource not found" });
        } else {
          res.json(r);
        }
      })
      .catch((error) => {
        res.status(500).json({ status: false, message: error.message });
      });
  }

  getStudentBySchoolId(req, res) {
    if (!req.params.schoolId) {
      return res
        .status(400)
        .send({ status: false, message: "schoolId is required" });
    }
    StudentService.getStudentBySchoolId(req.params.schoolId)
      .then((r) => {
        if (r.length === 0) {
          res
            .status(404)
            .json({ status: false, message: "resource not found" });
        } else {
          res.json(r);
        }
      })
      .catch((error) => {
        res.status(500).json({ status: false, message: error.message });
      });
  }

  activeInAllClassStudent(req, res) {
    if (!req.params.userId) {
      return res
        .status(400)
        .send({ status: false, message: "userId is required" });
    }
    if (!req.params.schoolId) {
      return res
        .status(400)
        .send({ status: false, message: "schoolId is required" });
    }
    StudentService.activeInAllClassStudent(
      req.params.userId,
      req.params.schoolId
    )
      .then((r) => {
        if (r.length === 0) {
          res
            .status(404)
            .json({ status: false, message: "resource not found" });
        } else {
          res.json(r);
        }
      })
      .catch((error) => {
        res.status(500).json({ status: false, message: error.message });
      });
  }

  getClassmateSpecificStudent(req, res) {
    if (!req.params.userId) {
      return res
        .status(400)
        .send({ status: false, message: "userId is required" });
    }
    if (!req.params.schoolId) {
      return res
        .status(400)
        .send({ status: false, message: "schoolId is required" });
    }
    if (!req.params.studentId) {
      return res
        .status(400)
        .send({ status: false, message: "studentId is required" });
    }
    StudentService.getClassmateSpecificStudent(
      req.params.userId,
      req.params.schoolId,
      req.params.studentId
    )
      .then((r) => {
        if (r.length === 0) {
          res
            .status(404)
            .json({ status: false, message: "resource not found" });
        } else {
          res.json(r);
        }
      })
      .catch((error) => {
        res.status(500).json({ status: false, message: error.message });
      });
  }

  assignStudentToClass(req, res) {
    try {
      const schoolId = req.params.schoolId;
      const classId = req.params.classId;
      const { firstName, lastName } = req.body;
      if (!firstName) {
        return res
          .status(400)
          .sendd({ status: false, error: "firstname is required" });
      }
      if (!lastName) {
        return res
          .status(400)
          .send({ status: false, error: "lastname is required" });
      }
      StudentService.assignStudentToClass(req.body, schoolId, classId).then(
        (result) => {
          if (result === 'student created or assign') {
            return res
              .status(201)
              .send({
                status: true,
                message: "student assign and created successfully",
              });
          } else {
            return res
              .status(400)
              .send({ status: false, error: "error during student assigning" });
          }
        }
      );
    } catch (error) {
      return res.status(500).send({ status: false, error: error.message });
    }
  }
}

export default new StudentController();
