import Joi from "joi";

export const updateUserAccountSchema = {
  body: Joi.object({
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    DOB: Joi.date().iso().required(),
    gender: Joi.string().valid("male", "female", "other").required(),
    mobileNumber: Joi.string()
      .pattern(/^[0-9]{10,15}$/)
      .required(),
  }),
};

export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).required(),
    confirmNewPassword: Joi.string().valid(Joi.ref("newPassword")).required(),
  }),
};

export const uploadImageSchema = {
  file: Joi.object().required(),
};