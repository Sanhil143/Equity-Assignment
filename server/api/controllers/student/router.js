import * as express from "express";
import controller from "./controller";
import { middleWare } from "../../middlewares/jwtAuth";

export default express
  .Router()
  .post("/createStudent",middleWare(["Admin", "Teacher"]),controller.createStudent)
  .get("/getStudentBySchoolId/:schoolId",middleWare(["Admin", "Teacher"]),controller.getStudentBySchoolId)
  .get("/activeInAllClassStudent/:userId/:schoolId",middleWare(["Admin", "Teacher"]),controller.activeInAllClassStudent)
  .get("/getClassmateSpecificStudent/:userId/:schoolId/:studentId",middleWare(["Admin", "Teacher", "Parent"]),controller.getClassmateSpecificStudent);
