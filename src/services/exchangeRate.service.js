import Joi from 'joi';

export const insertCurrencyInfo = async (currencyInfo) => {
  const schema = Joi.object().keys({
    code: Joi.string().reuiqred(),
    name: Joi.string().reuiqred(),
    country: Joi.string().reuiqred(),
  });

  const result = schema.validate(currencyInfo);
};
