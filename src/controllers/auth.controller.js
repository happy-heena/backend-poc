import Joi from 'joi';
import User from '../models/user.model.js';
import auth from '../services/auth.service.js';
import { isSuccess } from '../utils/response.util.js';

export const register = async (req, res, next) => {
  try {
    const response = await auth.register(req.body);
    const { code, message, data } = response;
    if (isSuccess(code)) {
      const { token, user: userInfo } = data;
      res.cookie('access_token', token, {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
      });
      res.status(code).json(userInfo);
    } else {
      res.status(code).json(message);
    }
  } catch (e) {
    next(e);
  }
};

export const login = async (req, res, next) => {
  console.log('login');
  const { username, password } = req.body;
  console.log('??username', username);

  if (!username || !password) {
    res.sendStatus(401); // Unauthorized
    return;
  }

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      res.sendStatus(401);
      return;
    }

    const valid = await user.checkPassword(password);
    if (!valid) {
      res.sendStatus(401);
      return;
    }

    const token = user.generateToken();
    res.cookie('access_token', token, {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });
    res.send(user.serialize());
  } catch (e) {
    next(e);
  }
};

export const check = async (req, res, next) => {
  const { user } = req;
  if (!user) {
    res.sendStatus(401); // Unauthorized
    return;
  }
  res.send(user);
};

export const logout = async (req, res, next) => {
  res.clearCookie('access_token');
  res.sendStatus(204); // No Content
};
