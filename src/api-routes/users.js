import express from "express";
import bcrypt from "bcryptjs";
import User, {
  newUserValidation,
  userLoginValidation,
} from "../models/user-model.js";
import jwt from "jsonwebtoken";
import errorTypes from "./errorTypes.js";

const router = express.Router();

const errorResponse = (errorType, errorMessage, errorCode) => {
  return {
    error: {
      type: errorType,
      message: errorMessage,
      code: errorCode,
    },
  };
};

router.post("/", async (req, MainRes) => {
  const postedUserData = req.body;
  const { error } = newUserValidation(postedUserData);
  if (error) {
    return MainRes.status(400).json(
      errorResponse(errorTypes.VALIDATION_ERROR, error.details[0].message, 400)
    );
  }
  const hash = bcrypt.hashSync(req.body.password);
  try {
    const userAlreadyExist = await User.exists({ email: req.body.email });
    if (userAlreadyExist) {
      return MainRes.status(409).json(
        errorResponse(
          errorTypes.DUPLICATE_RESOURCE_ERROR,
          "Email address already taken",
          400
        )
      );
    } else {
      const newAddedUser = await User.create({
        ...postedUserData,
        password: hash,
      });
      return MainRes.status(201).json(newAddedUser);
    }
  } catch (error) {
    MainRes.status(500).json(
      errorResponse(
        errorTypes.INTERNAL_SERVER_ERROR,
        "Something goes wrong with server",
        500
      )
    );
  }
});

router.get("/login", async (req, res) => {
  const postedUserData = req.body;
  const { error } = userLoginValidation(postedUserData);
  if (error) {
    return res
      .status(400)
      .json(
        errorResponse(
          errorTypes.VALIDATION_ERROR,
          error.details[0].message,
          400
        )
      );
  }
  try {
    const savedUserData = await User.findOne({ email: postedUserData.email });
    if (!savedUserData) {
      return res
        .status(404)
        .json(
          errorResponse(
            errorTypes.RESOURCE_NOT_FOUND,
            "This email is not registered",
            400
          )
        );
    }
    const isValidPass = await bcrypt.compare(
      postedUserData.password,
      savedUserData.password
    );
    if (isValidPass) {
      const userData = {
        fullname: savedUserData.fullname,
        email: savedUserData.email,
        _id: savedUserData._id,
      };
      const tokenSecret = process.env.TOKEN_SECRET;
      const token = jwt.sign(userData, tokenSecret);
      res
        .header("auth-token", token)
        .status(200)
        .json({ ...userData, token: token });
    } else {
      res
        .status(401)
        .json(
          errorResponse(
            errorTypes.INCORRECT_CREDENTIALS,
            "Incorrect Password",
            401
          )
        );
    }
  } catch (error) {
    res
      .status(500)
      .json(
        errorResponse(
          errorTypes.INTERNAL_SERVER_ERROR,
          "Something goes wrong with server",
          500
        )
      );
  }
});

export default router;
