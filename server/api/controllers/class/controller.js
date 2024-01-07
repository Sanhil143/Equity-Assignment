import ClassService from "../../services/class.service";

class ClassController {
  createClass(req, res) {
    const { className, schoolId } = req.body;
    if (!className) {
      return res
        .status(400)
        .send({ status: false, message: "className is needed" });
    }
    if (!schoolId) {
      return res
        .status(400)
        .send({ status: false, message: "userId is needed" });
    }
    ClassService.createClass(req.body)
      .then((result) => {
        if (
          !result ||
          result === "error during class addition" ||
          result === "string"
        ) {
          return res.status(400).send({
            status: false,
            message: "bad request during class creation",
          });
        }
        return res.status(201).send({
          status: true,
          message: "Registration has been Successfully",
        });
      })
      .catch((err) => {
        return res.status(500).send({ status: false, message: err.message });
      });
  }

  getClasses(req, res) {
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
    ClassService.getClasses(req.params.schoolId, req.params.userId)
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

  getClassStudent(req, res) {
    if (!req.params.classId) {
      return res
        .status(400)
        .send({ status: false, message: "classId is required" });
    }
    if (!req.params.schoolId) {
      return res
        .status(400)
        .send({ status: false, message: "schoolId is required" });
    }
    ClassService.getClassStudent(req.params.schoolId, req.params.classId)
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

  assignStudentInClass(req,res){
    ClassService.assignStudentInClass(
      req.params.classId,
      req.params.studentId,
      req.params.schoolId
    ).then((r) => {
      if (r === 'student assign successfully'){
        return res.status(201).send({status:true,message:'student assign successfully'})
      }
      else res.status(400).send({status:false,message:'error during student assigning'});
    });
  }
}

export default new ClassController();
