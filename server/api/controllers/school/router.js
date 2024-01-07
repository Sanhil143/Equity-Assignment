import * as express from 'express';
import controller from './controller';
import { middleWare } from "../../middlewares/jwtAuth";

export default express
  .Router()
  .post('/createSchool',middleWare(['Admin']),controller.createSchool)
  .get('/getMySchool/:userId',middleWare(['Admin','Teacher']),controller.getMySchool);