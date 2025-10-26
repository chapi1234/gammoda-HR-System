import Joi from "joi";

// Register Validation
const registerValidation = (data) => {
  const schema = Joi.object({
    fullName: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    role: Joi.string()
      .valid("user", "moderator", "admin", "superadmin")
      .required(),
    gender: Joi.string().valid("male", "female").required(),
    phone: Joi.number().required(),
  });
  return schema.validate(data, { abortEarly: false });
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid("employee", "hr").required(),
  });
  return schema.validate(data, { abortEarly: false });
};

const authValidation = {
  registerValidation,
  loginValidation,
};

export default authValidation;
