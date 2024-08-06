import responseMessage from '../configs/responseMessage.config.js';

export const isSuccess = (code) => code === 200;

const response = (
  code = 200,
  data,
  message = responseMessage[code],
  meta = {},
  errors = [],
) => ({
  code,
  data,
  message,
  meta,
  errors,
});

export default response;
