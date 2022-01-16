import Joi from "joi";
import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const newUserValidation = (data) => {
  const userJoiSchema = Joi.object({
    fullname: Joi.string().min(3).max(50),
    email: Joi.string().min(6).max(512).email().exist(),
    password: Joi.string().min(6).max(1024).exist(),
  });

  return userJoiSchema.validate(data);
};

export const userLoginValidation = (data) => {
  const userJoiSchema = Joi.object({
    email: Joi.string().min(6).max(512).email().exist(),
    password: Joi.string().min(6).max(1024).exist(),
  });
  return userJoiSchema.validate(data);
};

const User = mongoose.model("User", userSchema);

export default User;
