import * as express from 'express';
import controller from './controller';

export default express
  .Router()
  .post('/signup',controller.userSignup)
  .post('/login',controller.userLogin);