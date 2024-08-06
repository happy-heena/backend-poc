import express from 'express';
import * as postsController from '../controllers/posts.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const posts = express.Router();
posts.get('/', postsController.list);
posts.post('/', authMiddleware, postsController.write);

const post = express.Router();
post.get('/', postsController.read);
post.delete(
  '/',
  authMiddleware,
  postsController.checkOwnPost,
  postsController.remove,
);
post.patch(
  '/',
  authMiddleware,
  postsController.checkOwnPost,
  postsController.update,
);

posts.use('/:id', postsController.getPostById, post);

export default posts;
