import * as express from "express";
import controller from "./controller";
import { middleWare } from "../../middlewares/jwtAuth";

export default express
  .Router()
  .post(
    "/createClass",
    middleWare(["Admin", "Teacher"]),
    controller.createClass
  )
  .get(
    "/getClasses/:userId/:schoolId",
    middleWare(["Admin", "Teacher", "Parent"]),
    controller.getClasses
  )
  .get(
    "/getClassStudent/:classId/:schoolId",
    middleWare(["Admin", "Teacher"]),
    controller.getClassStudent
  )
  .post(
    "/assignStudentInClass/:classId/:studentId/:schoolId",
    middleWare(["Admin", "Teacher"]),
    controller.assignStudentInClass
  );
