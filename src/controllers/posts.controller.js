import Post from '../models/post.model.js';
import mongoose from 'mongoose';
import Joi from 'joi';

const { ObjectId } = mongoose.Types;

export const getPostById = async (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    res.sendStatus(400); // Bad Request
    return;
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      res.sendStatus(404);
      return;
    }
    res.send(post);
    return next();
  } catch (e) {
    next(e);
  }
};

export const write = async (req, res, next) => {
  // 객체가 다음 필드를 가지고 있음을 검증
  const schema = Joi.object().keys({
    title: Joi.string().required(),
    body: Joi.string().required(),
    tags: Joi.array().items(Joi.string()).required(),
  });
  // 검증하고 나서 검증 실패인 경우 에러 처리
  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error);
    return;
  }

  const { title, body, tags } = req.body;
  const post = new Post({
    title,
    body,
    tags,
    user: req.user,
  });

  try {
    await post.save();
    res.send(post);
  } catch (e) {
    next(e);
  }
};

/* 
/api/posts?username=&tag=&page=
*/
export const list = async (req, res, next) => {
  // query는 문자열이기 때문에 숫자로 변환해 주어야 한다.
  // 값이 주어지지 않았다면 1을 기본으로 사용한다.
  const page = parseInt(req.query.page || '1', 10);

  if (page < 1) {
    res.sendStatus(400);
    return;
  }

  const { tag, username } = req.query;
  const query = {
    ...(username ? { 'user.username': username } : {}),
    ...(tag ? { tags: tag } : {}),
  };

  try {
    const posts = await Post.find(query)
      .sort({ _id: 1 })
      .limit(10)
      .skip((page - 1) * 10)
      .lean()
      .exec();

    const postCount = await Post.countDocuments(query).exec();
    res.set('Last-Page', Math.ceil(postCount / 10));
    res.send(
      posts.map((post) => ({
        ...post,
        body:
          post.body.length < 200 ? post.body : `${post.body.slice(0, 200)}...`,
      })),
    );
  } catch (e) {
    next(e);
  }
};

export const read = async (req, res) => {
  res.send(req.body.post);
};

export const remove = async (req, res, next) => {
  const { id } = req.params;
  try {
    await Post.findByIdAndDelete(id).exec();
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};

export const update = async (req, res, next) => {
  const { id } = req.params;
  const schema = Joi.object().keys({
    title: Joi.string(),
    body: Joi.string(),
    tags: Joi.array().items(Joi.string()),
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error);
    return;
  }

  try {
    const post = await Post.findByIdAndUpdate(id, req.body, {
      new: true, // 이 값을 설정하면 업데이트된 데이터를 반환합니다.
      // false일 때는 업데이트되기 전의 데이터를 반환합니다.
    }).exec();

    if (!post) {
      res.sendStatus(404);
      return;
    }
    res.send(post);
  } catch (e) {
    next(e);
  }
};

export const checkOwnPost = (req, res, next) => {
  const { user, post } = req.body;
  if (post.user._id.toString() !== user._id) {
    res.sendStatus(403);
    return;
  }
  return next();
};
