const joi = require("@hapi/joi");

const validateUser = (data) => {
  const format = joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).required(),
  });

  return format.validate(data);
};

module.exports = { validateUser };
