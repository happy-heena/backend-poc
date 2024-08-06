import Joi from 'joi';
import User from '../models/user.model.js';
import response from '../utils/response.util.js';

const register = async (userInfo) => {
  const schema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(20).required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(userInfo);

  if (result.error) {
    return response(400, result.error);
  }

  const { username, password } = userInfo;

  const exists = await User.findByUsername(username);
  if (exists) {
    return response(409);
  }

  const user = new User({
    username,
  });
  await user.setPassword(password); // 비밀번호 설정
  await user.save(); // 데이터베이스에 저장

  return response(200, {
    user: user.serialize(),
    token: user.generateToken(),
  });
};

const login = () => {
  console.log('test');
};

export default { register, login };
