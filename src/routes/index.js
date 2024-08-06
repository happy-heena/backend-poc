import express from 'express';
import posts from './posts.route.js';
import auth from './auth.route.js';

const api = express.Router();

api.use('/posts', posts);
api.use('/auth', auth);

export default api;
