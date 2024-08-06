import express from 'express';
import * as authController from '../controllers/auth.controller.js';

const auth = express.Router();

auth.post('/register', authController.register);
auth.post('/login', authController.login);
auth.get('/check', authController.check);
auth.post('/logout', authController.logout);

export default auth;
