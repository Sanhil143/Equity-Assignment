import * as express from "express";
import controller from "./controller";
import { middleWare } from "../../middlewares/jwtAuth";

export default express
  .Router()
  .post("/createStudent",middleWare(["Admin", "Teacher"]),controller.createStudent)
  .get("/getStudentById/:studentId",middleWare(["Admin", "Teacher","Parent"]),controller.getStudentById)
  .get("/getStudentBySchoolId/:schoolId",middleWare(["Admin", "Teacher"]),controller.getStudentBySchoolId)
  .get("/activeInAllClassStudent/:userId/:schoolId",middleWare(["Admin", "Teacher"]),controller.activeInAllClassStudent)
  .get("/getClassmateSpecificStudent/:userId/:schoolId/:studentId",middleWare(["Admin", "Teacher", "Parent"]),controller.getClassmateSpecificStudent)
  .post("/assignStudentToClass/:userId/:schoolId/:classId",middleWare(["Admin"]),controller.assignStudentToClass)
